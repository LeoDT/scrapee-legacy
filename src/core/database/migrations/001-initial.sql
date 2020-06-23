--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

create table job (
  id integer primary key,
  type text not null,
  priority integer not null default 0,
  status text not null default 'created',
  interval integer,
  failReason text,
  data text
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

drop table job;