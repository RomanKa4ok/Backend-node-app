CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE entity_status AS ENUM (
    'active',
    'draft',
    'deleted'
);

CREATE TABLE articles (
    id uuid primary key,
    title varchar(255) not null,
    content text not null,
    entity_status entity_status default 'draft' not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);