-- create type inet_protocol as enum ('tcp', 'udp');

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inet_protocol') THEN
        CREATE TYPE inet_protocol AS enum ('tcp', 'udp');
    END IF;
    --more types here...
END$$;

create table if not exists client (
 client_id uuid NOT NULL unique,
 created timestamp NOT NULL,
 ip_address inet NOT NULL,
 protocol inet_protocol NOT NULL,
 enabled boolean NOT NULL,
 last_packets bigint default 0,
 last_activity timestamp,
 primary key (client_id, ip_address, protocol)
);

create index if not exists client_ip_address_index on client (ip_address);
