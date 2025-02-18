ALTER TABLE files
ADD COLUMN meta jsonb not null default '{}';