#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


POSITION_GROUPS = {
    "GK": "Bramkarze",
    "DF": "Obrońcy",
    "MF": "Pomocnicy",
    "FW": "Napastnicy",
}

CODE_ALIASES = {}

PLAYER_PATTERN = re.compile(
    r"^\s*(\d+)\s*(GK|DF|MF|FW)\s+"
    r"(.+?)\s{2,}(.+?)\s{2,}(.+?)\s{2,}(.+?)\s{2,}"
    r"(\d{2}/\d{2}/\d{4})(.+?)\s+(\d{3})\s*$"
)
TEAM_PATTERN = re.compile(r"^\s*(.+?) \(([A-Z]{3})\)\s*$", re.MULTILINE)


def clean(value):
    return re.sub(r"\s+", " ", value.replace("\x00", "fi")).strip()


def clean_upper_field(value):
    value = clean(value)
    return re.sub(r"\bM\s+(?=[A-ZÀ-Ž])", "M", value)


def title_name(value):
    return " ".join(
        part if len(part) == 1 and part.isupper() else part.title()
        for part in value.split()
    )


def display_player_name(player_name):
    value = clean_upper_field(player_name)
    tokens = value.split()
    if not tokens:
        return value

    if value == value.upper():
        return title_name(value)

    surname = []
    given = []
    found_given = False
    for token in tokens:
        if not found_given and token == token.upper():
            surname.append(token)
        else:
            found_given = True
            given.append(token)

    if not surname or not given:
        return title_name(value)
    return f"{' '.join(given)} {title_name(' '.join(surname))}"


def parse_coach(line):
    parts = [clean(part) for part in re.split(r"\s{2,}", line.strip())]
    if len(parts) != 5 or parts[0] != "Head coach":
        raise ValueError(f"Nie można odczytać selekcjonera: {line!r}")
    _, _, first_names, last_names, nationality = parts
    return {
        "name": f"{first_names} {title_name(clean_upper_field(last_names))}",
        "nationality": nationality,
    }


def parse_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    if len(reader.pages) != 48:
        raise ValueError(f"Oczekiwano 48 stron, znaleziono {len(reader.pages)}")

    squads = {}
    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text(extraction_mode="layout")
        team_match = TEAM_PATTERN.search(text)
        if not team_match:
            raise ValueError(f"Brak nazwy reprezentacji na stronie {page_number}")

        team_name = clean(team_match.group(1))
        fifa_code = team_match.group(2)
        app_code = CODE_ALIASES.get(fifa_code, fifa_code)
        players = []
        coach = None

        for line in text.splitlines():
            player_match = PLAYER_PATTERN.match(line)
            if player_match:
                (
                    number,
                    position,
                    player_name,
                    first_names,
                    last_names,
                    shirt_name,
                    birth_date,
                    club,
                    height,
                ) = player_match.groups()
                players.append(
                    {
                        "number": int(number),
                        "position": position,
                        "name": display_player_name(player_name),
                        "firstNames": clean(first_names),
                        "lastNames": clean_upper_field(last_names),
                        "shirtName": clean_upper_field(shirt_name),
                        "birthDate": birth_date,
                        "club": clean(club),
                        "heightCm": int(height),
                    }
                )
            elif line.strip().startswith("Head coach"):
                coach = parse_coach(line)

        if len(players) != 26:
            raise ValueError(
                f"{team_name}: oczekiwano 26 zawodników, znaleziono {len(players)}"
            )
        if coach is None:
            raise ValueError(f"{team_name}: brak selekcjonera")

        grouped = {label: [] for label in POSITION_GROUPS.values()}
        for player in players:
            grouped[POSITION_GROUPS[player["position"]]].append(player["name"])

        squads[app_code] = {
            "team": team_name,
            "fifaCode": fifa_code,
            "coach": coach["name"],
            "coachNationality": coach["nationality"],
            "squad": grouped,
            "players": players,
            "source": "FIFA Squad List, version 1, 9 June 2026",
        }

    if len(squads) != 48:
        raise ValueError(f"Oczekiwano 48 reprezentacji, znaleziono {len(squads)}")
    return dict(sorted(squads.items()))


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Użycie: scripts/import-squads.py /ścieżka/do/składy.pdf")

    root = Path(__file__).resolve().parent.parent
    squads = parse_pdf(Path(sys.argv[1]))
    data_dir = root / "data"
    assets_dir = root / "assets"
    data_dir.mkdir(exist_ok=True)
    assets_dir.mkdir(exist_ok=True)

    payload = {
        "updatedAt": "2026-06-09",
        "source": "FIFA World Cup 2026 Squad List, version 1",
        "teams": squads,
    }
    json_text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    (data_dir / "squads.json").write_text(json_text, encoding="utf-8")

    runtime_squads = {
        code: {
            "coach": team["coach"],
            "squad": team["squad"],
            "source": team["source"],
        }
        for code, team in squads.items()
    }
    compact = json.dumps(runtime_squads, ensure_ascii=False, separators=(",", ":"))
    js_text = (
        "/* Generated by scripts/import-squads.py. */\n"
        f"window.WC2026_SQUADS={compact};\n"
    )
    (assets_dir / "squads.js").write_text(js_text, encoding="utf-8")

    player_count = sum(len(team["players"]) for team in squads.values())
    print(f"Imported {len(squads)} teams and {player_count} players.")


if __name__ == "__main__":
    main()
