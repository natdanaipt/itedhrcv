-- Migration: 001_init.sql

CREATE TABLE IF NOT EXISTS personnel (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    position VARCHAR(255),
    department VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personnel_skills (
    id SERIAL PRIMARY KEY,
    personnel_id INTEGER REFERENCES personnel(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    proficiency INTEGER NULL
);

CREATE TABLE IF NOT EXISTS personnel_experience (
    id SERIAL PRIMARY KEY,
    personnel_id INTEGER REFERENCES personnel(id) ON DELETE CASCADE,
    position VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    start_date TEXT,
    end_date TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS personnel_education (
    id SERIAL PRIMARY KEY,
    personnel_id INTEGER REFERENCES personnel(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    institution VARCHAR(255),
    year TEXT
);

CREATE TABLE IF NOT EXISTS personnel_certifications (
    id SERIAL PRIMARY KEY,
    personnel_id INTEGER REFERENCES personnel(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    year TEXT
);
