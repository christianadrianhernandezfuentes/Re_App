create table usuarios (
    id serial primary key,
    usuario varchar(50) unique not null,
    password varchar(50) not null
);

create table armas (
    id serial primary key,
    nombre varchar(100) not null,
    detalle varchar(255) not null
);

create table consumibles (
    id serial primary key,
    nombre varchar(100) not null,
    detalle varchar(255) not null
);