CREATE TABLE IF NOT EXISTS blog_poll_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poll_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_poll_votes_poll_id
ON blog_poll_votes (poll_id);

CREATE INDEX IF NOT EXISTS idx_blog_poll_votes_poll_option
ON blog_poll_votes (poll_id, option_id);
