-- Estructura de la tabla de candidatos (opcion A: PostgreSQL con pg).
-- Ejecutar en la base de desarrollo y en la de pruebas:
--   psql -U postgres -d candidates_dev -f db/schema.sql
--   psql -U postgres -d candidates_test -f db/schema.sql

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  experience_years DOUBLE PRECISION NOT NULL CHECK (experience_years >= 0),
  skills TEXT[] NOT NULL DEFAULT '{}'
);
