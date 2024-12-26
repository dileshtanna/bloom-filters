DROP database if exists users;

create database users;

\c users;

create table users (
    id serial primary key,
    username varchar(50)
);