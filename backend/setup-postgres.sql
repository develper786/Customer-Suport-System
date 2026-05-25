-- PostgreSQL Setup Script for Customer Support System
-- This script creates the database and necessary tables

-- Create the database
CREATE DATABASE customer_support_db;

-- Connect to the database
\c customer_support_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    assigned_to INTEGER REFERENCES users(id),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);

-- Insert sample data (optional)
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$xSjKMjpf8F4H1xpQZ.5AUuRYxl7aR7ByK2TfCxm1vQxHKkL1xN1NG', 'ROLE_ADMIN'),
('support', '$2a$10$xSjKMjpf8F4H1xpQZ.5AUuRYxl7aR7ByK2TfCxm1vQxHKkL1xN1NG', 'ROLE_AGENT');

-- Note: The passwords above are pre-hashed bcrypt for: admin123 and support123
-- If you need different passwords, use the Java BCryptPasswordEncoder to generate new hashes
