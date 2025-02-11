ALTER TABLE users
ADD COLUMN email_confirmed_at timestamp,
ADD COLUMN email_confirmation_token varchar(30);