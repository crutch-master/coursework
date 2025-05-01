-- migrate:up
create table events (
    id       varchar primary key not null,
    name     text    not null,
    start    integer not null    default(unixepoch()),
    duration integer not null, -- in minutes
    public   boolean not null,
    host_id  integer not null
);

create table event_visitor (
    user_id  integer not null,
    event_id integer not null
);

-- migrate:down
drop table events;
drop table event_visitor;
