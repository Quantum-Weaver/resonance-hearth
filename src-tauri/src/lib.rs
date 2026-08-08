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
    },
    Migration {
        version: 2,
        description: "personal_overwhelm_protocols",
        // DESIGN-003 SS2/SS3: each vessel authors their own Meltdown Protocol
        // in calm, executed in storm. The 30-second pause remains protected
        // and non-configurable; what personalizes is WHO is told and WHAT
        // is offered -- never WHETHER there is a pause.
        // overwhelm_events.tell snapshots the audience at start time, so a
        // later protocol edit never retroactively changes a live event.
        sql: "
            CREATE TABLE IF NOT EXISTS protocols (
                member_id TEXT PRIMARY KEY REFERENCES members(id),
                tell_scope TEXT NOT NULL DEFAULT 'household',
                    -- household | some | none
                tell_members TEXT NOT NULL DEFAULT '[]',
                card_text TEXT,
                needs TEXT NOT NULL DEFAULT '[]',
                checkback_minutes INTEGER NOT NULL DEFAULT 30
            );
            ALTER TABLE overwhelm_events ADD COLUMN need TEXT;
            ALTER TABLE overwhelm_events ADD COLUMN tell TEXT;
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 3,
        description: "entity_cards_and_gentle_reminders",
        // The entity-card season (KP's rulings, 2026-07-31 — the geode's
        // hearth node holds them verbatim):
        //   - members.arrival: family history, never a database timestamp
        //     ("arrival, never adopted" — three of the four animals are
        //     rescues and the eldest is not).
        //   - members.species: the vessel's own word, free text, optional.
        //   - members.card_color / color_source: the card begins as a color
        //     of the vessel's choice and fades white -> yellow -> red as a
        //     window elapses ("gentle reminders"; the word is "care").
        //     color_source: 'first' = all emojis compete, whichever enters
        //     the danger zone first drives the card; or a card_actions.id =
        //     one chosen emoji drives it.
        //   - card_actions: an emoji is a button that does a thing.
        //     kind 'done' completes a thing | 'take' opens the member's
        //     meds | 'reset' is a fresh take on a temporal window (state
        //     DERIVED from the clock, never stored) | 'feeling' logs a
        //     feeling ("no wheel" - "just emojis" - "simple").
        //   - feelings: an emoji and/or the vessel's own word. PRIVATE by
        //     default, like meds.
        //   - bonds: inseparable pairs ("He and Charlie are inseparable") -
        //     schema for the seeding era; boarded, medicated, moved together.
        // ASCII-only defaults (the Android JNI law).
        sql: "
            ALTER TABLE members ADD COLUMN arrival INTEGER;
            ALTER TABLE members ADD COLUMN species TEXT;
            ALTER TABLE members ADD COLUMN card_color TEXT;
            ALTER TABLE members ADD COLUMN color_source TEXT NOT NULL DEFAULT 'first';

            CREATE TABLE IF NOT EXISTS card_actions (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                emoji TEXT NOT NULL,
                label TEXT,
                kind TEXT NOT NULL DEFAULT 'done',
                    -- done | take | reset | feeling
                thing_id TEXT REFERENCES things(id),
                keeps_for INTEGER,      -- ms window (reset kind)
                approach_at REAL,       -- 0..1; app default 0.75
                started_at INTEGER,     -- last fresh take (reset kind)
                position INTEGER NOT NULL DEFAULT 0
            );
            CREATE INDEX IF NOT EXISTS idx_card_actions_member
                ON card_actions(member_id, position);

            CREATE TABLE IF NOT EXISTS feelings (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                emoji TEXT NOT NULL,
                word TEXT,
                shared INTEGER NOT NULL DEFAULT 0,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_feelings_member_ts
                ON feelings(member_id, ts);

            CREATE TABLE IF NOT EXISTS bonds (
                a_member_id TEXT NOT NULL REFERENCES members(id),
                b_member_id TEXT NOT NULL REFERENCES members(id),
                note TEXT,
                PRIMARY KEY (a_member_id, b_member_id)
            );
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 4,
        description: "the_household_lexicon",
        // The emoji folksonomy, at home (KP's ask, 2026-07-31: an "own
        // definition" layer for the emojis). The Folksonomy Principle
        // governs (Grammar 6.2): no emoji has a single meaning; ALL
        // definitions are preserved; none overwrites another. Meanings are
        // per-vessel (whose word it is) and append-only by law - a new
        // meaning is a new row, never an edit of someone else's. Local
        // always; the personal-definition law of the-lexicon rides: a
        // vessel's definitions live in their app, on their device, never
        // in any canon unless poured there by KP's own hand.
        sql: "
            CREATE TABLE IF NOT EXISTS emoji_meanings (
                id TEXT PRIMARY KEY,
                emoji TEXT NOT NULL,
                member_id TEXT REFERENCES members(id),
                meaning TEXT NOT NULL,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_emoji_meanings
                ON emoji_meanings(emoji, ts);
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 5,
        description: "the_house_itself",
        // THE HOUSE POUR (KP, 2026-08-06 — the geode's hearth node holds it
        // verbatim at its eleventh pour; THE-HOUSE-WALK.md is the blueprint):
        // the hearth keeper adds the house itself. Rooms carry their types;
        // the guidance shelf (how - how often - WHY) ships as authored
        // knowledge in src/lib/data/houseCare.ts, never in the DB, so the
        // app carries the teaching and no person has to. The electrical map
        // records understanding ONCE (the anti-drift law, in copper).
        // Rooms and wiring are house-scoped by nature - a room is not a
        // person; window-not-monitor is untouched.
        // ASCII-only defaults (the Android JNI law).
        sql: "
            CREATE TABLE IF NOT EXISTS rooms (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                room_type TEXT NOT NULL DEFAULT 'room',
                floor_type TEXT,
                notes TEXT,
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS room_responsibles (
                room_id TEXT NOT NULL REFERENCES rooms(id),
                member_id TEXT NOT NULL REFERENCES members(id),
                PRIMARY KEY (room_id, member_id)
            );

            CREATE TABLE IF NOT EXISTS fixtures (
                id TEXT PRIMARY KEY,
                room_id TEXT NOT NULL REFERENCES rooms(id),
                kind TEXT NOT NULL DEFAULT 'other',
                label TEXT,
                notes TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_fixtures_room ON fixtures(room_id);

            CREATE TABLE IF NOT EXISTS circuits (
                id TEXT PRIMARY KEY,
                breaker_label TEXT NOT NULL,
                amps INTEGER,
                notes TEXT
            );

            CREATE TABLE IF NOT EXISTS electric_points (
                id TEXT PRIMARY KEY,
                room_id TEXT NOT NULL REFERENCES rooms(id),
                kind TEXT NOT NULL DEFAULT 'outlet',
                label TEXT,
                circuit_id TEXT REFERENCES circuits(id)
            );
            CREATE INDEX IF NOT EXISTS idx_points_room ON electric_points(room_id);
            CREATE INDEX IF NOT EXISTS idx_points_circuit ON electric_points(circuit_id);

            ALTER TABLE things ADD COLUMN room_id TEXT REFERENCES rooms(id);
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 6,
        description: "the_mantel",
        // THE MANTEL (KP's pour, 2026-08-06, the communications sitting's
        // first built piece): a screen where the household places notes
        // about their life for others to see and comment on. PLACEMENT IS
        // THE OPT-IN - the act of writing a note there is the consent;
        // nothing arrives by push. Cards are color-coded by kind and wear
        // the owner's sigil. The scope column is ring-ready (personal
        // house | community house), filed for the pairing era, defaulting
        // to the household. The author's note stays the author's -
        // removable by their own hand; its comments rest with it.
        // ASCII-only defaults (the Android JNI law).
        sql: "
            CREATE TABLE IF NOT EXISTS mantel_notes (
                id TEXT PRIMARY KEY,
                member_id TEXT NOT NULL REFERENCES members(id),
                kind TEXT NOT NULL DEFAULT 'note',
                    -- note | win | ask | idea
                text TEXT NOT NULL,
                emoji TEXT,
                scope TEXT NOT NULL DEFAULT 'house',
                    -- unit | house (the rings, filed not yet governing)
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_mantel_ts ON mantel_notes(ts);

            CREATE TABLE IF NOT EXISTS mantel_comments (
                id TEXT PRIMARY KEY,
                note_id TEXT NOT NULL REFERENCES mantel_notes(id),
                member_id TEXT NOT NULL REFERENCES members(id),
                emoji TEXT,
                text TEXT,
                ts INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_mantel_comments
                ON mantel_comments(note_id, ts);
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
