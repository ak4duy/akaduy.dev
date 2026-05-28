ALTER TABLE blog_poll_votes
ADD COLUMN voter_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_poll_votes_unique_voter
ON blog_poll_votes (poll_id, voter_key)
WHERE voter_key IS NOT NULL;
