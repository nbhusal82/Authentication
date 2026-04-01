create database authentication_system
create table register(
    id int primary key auto_increment,
    username varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null
) 


