CREATE TYPE user_role AS enum ('admin', 'user', 'author');

CREATE TABLE users (
    id uuid primary key default gen_random_uuid(),
    first_name varchar(20) not null,
    last_name varchar(20) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    salt varchar(255) not null,
    role user_role not null default 'user',
    entity_status entity_status not null default 'active',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

ALTER TABLE articles
    ADD COLUMN created_by_id uuid REFERENCES users(id) ON DELETE SET NULL;