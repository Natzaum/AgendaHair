-- Criação das tabelas
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    ref VARCHAR(20) UNIQUE CHECK (ref IN ('clients', 'professionals', 'admins'))
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(14),
    cnpj VARCHAR(18),
    sex VARCHAR(32) CHECK (sex IN ('Masculino', 'Feminino', 'Outro')),
    role_id INT REFERENCES roles(id),
    admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) UNIQUE,
    available BOOLEAN DEFAULT TRUE,
    observations TEXT
);

CREATE TABLE IF NOT EXISTS professionals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) UNIQUE,
    available BOOLEAN DEFAULT TRUE,
    observations TEXT
);

CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    street VARCHAR(255),
    cep VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(50),
    number VARCHAR(10),
    available_days TEXT[], 
    open_time TIME, 
    close_time TIME
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES service_categories(id),
    price INT NOT NULL CHECK (price > 0),
    provider_id INT REFERENCES professionals(id),
    location_id INT REFERENCES locations(id),
    description TEXT,
    status VARCHAR(10) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    date_created DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id),
    provider_id INT REFERENCES professionals(id),
    service_id INT REFERENCES services(id),
    schedule_date VARCHAR(24),
    status VARCHAR(50) CHECK (status IN ('Agendado', 'Cancelado', 'Concluído')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_schedules_client_id ON schedules(client_id);
CREATE INDEX idx_schedules_service_id ON schedules(service_id);

-- Dados de teste
INSERT INTO roles (name, slug, ref) VALUES 
('Cliente', 'CLIENT', 'clients'),
('Prestador de serviços', 'PROVIDER', 'professionals'),
('Administrador', 'ADMIN', 'admins');

INSERT INTO service_categories (name, slug, description) VALUES 
('Cabelereiro(a)', 'HAIR','Profissional em cortes de cabelo'),
('Manicure', 'MANICURE','Consiste em lixar e modelar a borda livre das unhas'),
('Maquiador(a)', 'MAKE','Beleza facial');

INSERT INTO locations (name, street, cep, city, state, number, available_days, open_time, close_time) VALUES 
('Salão Estilo Único', 'Rua das Flores', '12345-678', 'Carazinho', 'RS', '227', ARRAY['Monday', 'Wednesday', 'Friday'], '08:00:00', '18:00:00'),
('Beleza & Cia', 'Avenida Central', '98765-432', 'Itapipoca', 'CE', '200', ARRAY['Tuesday', 'Thursday', 'Saturday'], '09:00:00', '17:00:00');

-- Inserir dois usuários na tabela users
INSERT INTO users (name, email, password, phone, cpf, sex, role_id) VALUES 
('Maria Silva', 'maria.silva@example.com', 'hashed_password1', '11999999999', '123.456.789-00', 'Feminino', 2),
('João Pereira', 'joao.pereira@example.com', 'hashed_password2', '21999999999', '987.654.321-00', 'Masculino', 2);

-- Profissionais default
INSERT INTO professionals (user_id, available, observations) VALUES 
((SELECT id FROM users WHERE email = 'maria.silva@example.com'), TRUE, 'Profissional especializado em manicure'),
((SELECT id FROM users WHERE email = 'joao.pereira@example.com'), TRUE, 'Profissional especializado em cortes de cabelo');

-- Serviços default
INSERT INTO services (name, category_id, price, provider_id, location_id, description) VALUES 
('Manicure Completa', (SELECT id FROM service_categories WHERE slug = 'MANICURE'), 50, 
    (SELECT id FROM professionals WHERE user_id = (SELECT id FROM users WHERE email = 'maria.silva@example.com')), 
    (SELECT id FROM locations WHERE name = 'Salão Estilo Único'), 
    'Serviço completo de manicure incluindo corte, lixamento e esmaltação'),
    
('Corte de Cabelo Masculino', (SELECT id FROM service_categories WHERE slug = 'HAIR'), 30, 
    (SELECT id FROM professionals WHERE user_id = (SELECT id FROM users WHERE email = 'joao.pereira@example.com')), 
    (SELECT id FROM locations WHERE name = 'Beleza & Cia'), 
    'Corte de cabelo masculino com estilo moderno');

-- VIEWS
CREATE VIEW available_professionals AS
SELECT u.id, u.name, p.observations
FROM users u
JOIN professionals p ON u.id = p.user_id
WHERE p.available = TRUE;

-- STORED PROCEDURES
CREATE OR REPLACE PROCEDURE add_service(
    service_name VARCHAR,
    category_slug VARCHAR,
    price INT,
    provider_email VARCHAR,
    location_name VARCHAR,
    description TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO services (name, category_id, price, provider_id, location_id, description) VALUES (
        service_name,
        (SELECT id FROM service_categories WHERE slug = category_slug),
        price,
        (SELECT id FROM professionals WHERE user_id = (SELECT id FROM users WHERE email = provider_email)),
        (SELECT id FROM locations WHERE name = location_name),
        description
    );
END;
$$;

-- FUNCTIONS
CREATE OR REPLACE FUNCTION calculate_total_price(service_ids INT[]) RETURNS INT AS $$
DECLARE
    total_price INT := 0;
    service_price INT;
BEGIN
    FOREACH service_price IN ARRAY service_ids LOOP
        total_price := total_price + (SELECT price FROM services WHERE id = service_price);
    END LOOP;
    RETURN total_price;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
