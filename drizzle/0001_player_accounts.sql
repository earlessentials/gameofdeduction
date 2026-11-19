CREATE TABLE player_accounts (
 username TEXT PRIMARY KEY NOT NULL,
 investigator_id TEXT NOT NULL UNIQUE REFERENCES investigators(id),
 created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE player_sessions (
 token TEXT PRIMARY KEY NOT NULL,
 investigator_id TEXT NOT NULL REFERENCES investigators(id),
 expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX player_sessions_owner ON player_sessions(investigator_id);
--> statement-breakpoint
CREATE TABLE login_limits (
 bucket TEXT PRIMARY KEY NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX login_limits_expiry ON login_limits(expires_at);
--> statement-breakpoint
ALTER TABLE investigators ADD COLUMN last_seen INTEGER NOT NULL DEFAULT 0;
