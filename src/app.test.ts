import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';

describe('Vacancies endpoints', () => {
  it('GET /vacancies returns 200 with the list', async () => {
    const response = await request(createApp()).get('/vacancies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /vacancies returns 201 with the created vacancy', async () => {
    const response = await request(createApp())
      .post('/vacancies')
      .send({ title: 'Analista QA', company: 'Andes Digital', salary: 900 });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: expect.any(Number), title: 'Analista QA' });
  });

  it('POST /vacancies returns 400 with invalid data', async () => {
    const response = await request(createApp()).post('/vacancies').send({ title: 'Analista QA', salary: 900 });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'El título y la empresa son obligatorios' });
  });
});

describe('Candidates endpoints', () => {
  const newCandidate = { name: 'Ana Torres', email: 'ana.torres@correo.com', city: 'Cuenca', experienceYears: 2 };

  it('GET /candidates returns 200 with the list', async () => {
    const response = await request(createApp()).get('/candidates');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('GET /candidates/:id returns 200, 404 when missing and 400 with an invalid id', async () => {
    const app = createApp();
    const found = await request(app).get('/candidates/1');
    expect(found.status).toBe(200);
    expect(found.body).toMatchObject({ id: 1, name: 'María López' });

    const missing = await request(app).get('/candidates/99');
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: 'Candidato no encontrado' });

    const invalid = await request(app).get('/candidates/abc');
    expect(invalid.status).toBe(400);
    expect(invalid.body).toEqual({ error: 'El identificador no es válido' });
  });

  it('POST /candidates returns 201 with the id and 400 with invalid data', async () => {
    const app = createApp();
    const created = await request(app).post('/candidates').send(newCandidate);
    expect(created.status).toBe(201);
    expect(created.body).toEqual({ id: 3, ...newCandidate });

    const invalid = await request(app).post('/candidates').send({ ...newCandidate, email: 'ana.correo.com' });
    expect(invalid.status).toBe(400);
    expect(invalid.body).toEqual({ error: 'El correo no tiene un formato válido' });
  });

  it('PUT /candidates/:id returns 200, 400 with invalid data and 404 when missing', async () => {
    const app = createApp();
    const updated = await request(app).put('/candidates/1').send(newCandidate);
    expect(updated.status).toBe(200);
    expect(updated.body).toEqual({ id: 1, ...newCandidate });

    const invalid = await request(app).put('/candidates/1').send({ ...newCandidate, experienceYears: -2 });
    expect(invalid.status).toBe(400);
    expect(invalid.body).toEqual({ error: 'Los años de experiencia deben ser un número igual o mayor que 0' });

    const missing = await request(app).put('/candidates/99').send(newCandidate);
    expect(missing.status).toBe(404);
  });

  it('DELETE /candidates/:id returns 204 without content and 404 when missing', async () => {
    const app = createApp();
    const deleted = await request(app).delete('/candidates/1');
    expect(deleted.status).toBe(204);
    expect(deleted.text).toBe('');

    const missing = await request(app).delete('/candidates/1');
    expect(missing.status).toBe(404);
  });
});
