-- World Cup 2026: konta typerów, synchronizacja typów i ranking.
-- Uruchom cały plik w Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 24),
  constraint profiles_username_chars check (
    username ~ '^[[:alnum:]À-ž _.-]+$'
  )
);

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

create table if not exists public.match_results (
  match_id integer primary key,
  kickoff timestamptz not null,
  status text not null default 'NS',
  home_score integer,
  away_score integer,
  updated_at timestamptz not null default now(),
  constraint match_results_scores check (
    (home_score is null and away_score is null)
    or (home_score >= 0 and away_score >= 0)
  )
);

create table if not exists public.predictions (
  user_id uuid not null references auth.users(id) on delete cascade,
  match_id integer not null references public.match_results(match_id) on delete cascade,
  outcome text not null check (outcome in ('1', 'X', '2')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, match_id)
);

create table if not exists public.user_typing_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  special_bets jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.match_results enable row level security;
alter table public.predictions enable row level security;
alter table public.user_typing_data enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Match results are readable" on public.match_results;
create policy "Match results are readable"
  on public.match_results for select
  using (true);

drop policy if exists "Users read own predictions" on public.predictions;
create policy "Users read own predictions"
  on public.predictions for select
  using (auth.uid() = user_id);

drop policy if exists "Users read own special bets" on public.user_typing_data;
create policy "Users read own special bets"
  on public.user_typing_data for select
  using (auth.uid() = user_id);

create or replace function public.create_typer_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    'Kibic-' || upper(substr(replace(new.id::text, '-', ''), 1, 6))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_typer_profile_after_signup on auth.users;
create trigger create_typer_profile_after_signup
  after insert on auth.users
  for each row execute procedure public.create_typer_profile();

create or replace function public.sync_my_predictions(
  prediction_rows jsonb default '[]'::jsonb,
  special_bets_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  -- Usuwanie i zmiana typu są dozwolone tylko przed rozpoczęciem meczu.
  delete from public.predictions as existing
  using public.match_results as match
  where existing.user_id = current_user_id
    and match.match_id = existing.match_id
    and match.kickoff > now()
    and not exists (
      select 1
      from jsonb_array_elements(coalesce(prediction_rows, '[]'::jsonb)) as item
      where (item ->> 'match_id') ~ '^[0-9]+$'
        and (item ->> 'match_id')::integer = existing.match_id
        and item ->> 'outcome' in ('1', 'X', '2')
    );

  insert into public.predictions (user_id, match_id, outcome)
  select
    current_user_id,
    (item ->> 'match_id')::integer,
    item ->> 'outcome'
  from jsonb_array_elements(coalesce(prediction_rows, '[]'::jsonb)) as item
  join public.match_results as match
    on (item ->> 'match_id') ~ '^[0-9]+$'
    and match.match_id = (item ->> 'match_id')::integer
  where item ->> 'outcome' in ('1', 'X', '2')
    and match.kickoff > now()
  on conflict (user_id, match_id) do update
    set outcome = excluded.outcome,
        updated_at = now()
    where exists (
      select 1
      from public.match_results as match
      where match.match_id = excluded.match_id
        and match.kickoff > now()
    );

  insert into public.user_typing_data (user_id, special_bets, updated_at)
  values (
    current_user_id,
    coalesce(special_bets_payload, '{}'::jsonb),
    now()
  )
  on conflict (user_id) do update
    set special_bets = excluded.special_bets,
        updated_at = now();
end;
$$;

create or replace function public.get_leaderboard(limit_count integer default 100)
returns table (
  rank bigint,
  username text,
  points bigint,
  hits bigint,
  typed bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with player_scores as (
    select
      profile.id,
      profile.username,
      count(prediction.match_id) as typed,
      count(*) filter (
        where result.status in ('FT', 'AET', 'PEN')
          and prediction.outcome = case
            when result.home_score > result.away_score then '1'
            when result.home_score < result.away_score then '2'
            else 'X'
          end
      ) as hits
    from public.profiles as profile
    left join public.predictions as prediction
      on prediction.user_id = profile.id
    left join public.match_results as result
      on result.match_id = prediction.match_id
    group by profile.id, profile.username
  ),
  ranked as (
    select
      row_number() over (
        order by hits desc, typed desc, lower(username), id
      ) as rank,
      username,
      hits as points,
      hits,
      typed
    from player_scores
  )
  select ranked.rank, ranked.username, ranked.points, ranked.hits, ranked.typed
  from ranked
  order by ranked.rank
  limit greatest(1, least(coalesce(limit_count, 100), 500));
$$;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  delete from auth.users where id = current_user_id;
end;
$$;

revoke all on function public.sync_my_predictions(jsonb, jsonb) from public;
revoke all on function public.delete_my_account() from public;
grant execute on function public.sync_my_predictions(jsonb, jsonb) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.get_leaderboard(integer) to anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant select on public.match_results to anon, authenticated;
grant select on public.predictions to authenticated;
grant select on public.user_typing_data to authenticated;
grant insert, update on public.profiles to authenticated;
