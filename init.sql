CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(100),
    targetGroup VARCHAR(255)[],
    address VARCHAR(255),
    cpf VARCHAR(14),
    cnpj VARCHAR(18),
    sex VARCHAR(32),
    genre VARCHAR(32),
    roleId INT REFERENCES roles(id),
    admin BOOLEAN,
    token VARCHAR(100),
    available JSON
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    price INT,
    provider_id INT REFERENCES users(id),
    description TEXT,
    status VARCHAR(10),
    dateCreated DATE
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    street VARCHAR(255),
    cep VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(50),
    number VARCHAR(10)
);


INSERT INTO roles (name, slug)
VALUES 
('Cliente', 'CLIENT'),
('Prestador de serviços', 'PROVIDER');
