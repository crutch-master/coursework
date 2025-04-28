-- migrate:up
create table users (
    id       integer primary key not null,
    name     text    not null,
    login    varchar not null unique,
    password varchar not null 
);

create index login_idx on users(login);

-- migrate:down
drop table users;
drop index login_idx;
