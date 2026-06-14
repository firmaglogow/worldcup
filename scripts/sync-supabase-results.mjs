import fs from "node:fs";

const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const serviceRoleKey = String(
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

if (!supabaseUrl || !serviceRoleKey) {
  console.log("Supabase nie jest skonfigurowany. Pomijam synchronizację rankingu.");
  process.exit(0);
}

const data = JSON.parse(
  fs.readFileSync(new URL("../data/match-center.json", import.meta.url), "utf8"),
);

const rows = (data.fixtures || [])
  .filter(
    (fixture) =>
      Number.isInteger(fixture.appMatchId) && Boolean(fixture.kickoff),
  )
  .map((fixture) => ({
    match_id: fixture.appMatchId,
    kickoff: fixture.kickoff,
    status: fixture.status?.short || "NS",
    home_score: Number.isInteger(fixture.goals?.home)
      ? fixture.goals.home
      : null,
    away_score: Number.isInteger(fixture.goals?.away)
      ? fixture.goals.away
      : null,
    updated_at: data.updatedAt || new Date().toISOString(),
  }));

const response = await fetch(
  `${supabaseUrl}/rest/v1/match_results?on_conflict=match_id`,
  {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  },
);

if (!response.ok) {
  throw new Error(
    `Supabase match_results: HTTP ${response.status} ${await response.text()}`,
  );
}

console.log(`Supabase: zsynchronizowano ${rows.length} meczów.`);
