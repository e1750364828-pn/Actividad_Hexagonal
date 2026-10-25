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
