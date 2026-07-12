use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Welcome to the Hearth, {}.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // The Hearth's schema. Two boundaries from the naming ceremony are
    // enforced structurally, not just in UI:
    //   1. `signals` holds CURRENT state only — there is deliberately no
    //      history table for signals, so no member can ever review another's
    //      past states. Presence is now, not a log. (Window, not monitor.)
    //   2. Every shareable row carries `shared` — unshared data never leaves
    //      the owner's private views. Sharing is opt-in per row, revocable.
    let migrations = vec![Migration {
        version: 1,
        description: "hearth_founding_schema",
        sql: "
            CREATE TABLE IF NOT EXISTS members (
                id TEXT PRIMARY KEY,
                label TEXT NOT NULL,
                sigil TEXT NOT NULL DEFAULT '',
                kind TEXT NOT NULL DEFAULT 'person', -- person | pet
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS spoon_logs (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                value INTEGER,               -- 1..5, NULL = 'Not Sure'
                shared INTEGER NOT NULL DEFAULT 0,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_spoons_member_ts
                ON spoon_logs(member_id, ts);

            -- Current state only. No history, by design (protected boundary).
            CREATE TABLE IF NOT EXISTS signals (
                member_id TEXT PRIMARY KEY REFERENCES members(id),
                state TEXT NOT NULL DEFAULT 'green',
                    -- green | amber | red | dim | rainbow
                shared INTEGER NOT NULL DEFAULT 1,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS things (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                species TEXT NOT NULL DEFAULT 'breathing',
                    -- breathing | edge | loop
                notes TEXT,
                spoon_cost INTEGER,           -- 1..5 guess, NULL = unsure
                edge_date INTEGER,            -- ms epoch; edges only
                amount_cents INTEGER,         -- bills only, optional
                amount_shared INTEGER NOT NULL DEFAULT 0,
                autopay INTEGER NOT NULL DEFAULT 0,
                holder_member_id TEXT REFERENCES members(id),
                loop_rule TEXT,               -- 'daily' | 'weekly:MON' | custom note
                pool INTEGER NOT NULL DEFAULT 1,  -- household pool vs personal
                member_id TEXT REFERENCES members(id), -- personal owner if not pool
                pet_id TEXT REFERENCES members(id),    -- care loops for a pet
                shared INTEGER NOT NULL DEFAULT 1,
                rested_until INTEGER,         -- loop rests until this ts after a done
                created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_things_species ON things(species);
            CREATE INDEX IF NOT EXISTS idx_things_edge ON things(edge_date);

            -- The celebration record. Never a scoreboard: no counts surface
            -- in UI beyond the gentle acknowledgment of the moment.
            CREATE TABLE IF NOT EXISTS dones (
                id TEXT PRIMARY KEY,
                thing_id TEXT NOT NULL REFERENCES things(id),
                member_id TEXT REFERENCES members(id),
                ts INTEGER NOT NULL,
                felt TEXT                     -- optional, one word, theirs
            );
            CREATE INDEX IF NOT EXISTS idx_dones_thing ON dones(thing_id, ts);

            CREATE TABLE IF NOT EXISTS meds (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                label TEXT NOT NULL,
                schedule TEXT NOT NULL DEFAULT 'daily',
                shared INTEGER NOT NULL DEFAULT 0,  -- PRIVATE by default
                created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS med_takes (
                id TEXT PRIMARY KEY,
                med_id TEXT NOT NULL REFERENCES meds(id),
                ts INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'taken'  -- taken | skipped | later
            );
            CREATE INDEX IF NOT EXISTS idx_takes_med ON med_takes(med_id, ts);

            CREATE TABLE IF NOT EXISTS overwhelm_events (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                started_at INTEGER NOT NULL,
                returned_at INTEGER,
                helped TEXT,                  -- optional recovery log
                notes TEXT,
                shared INTEGER NOT NULL DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        ",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:hearth.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running Resonance Hearth");
}
