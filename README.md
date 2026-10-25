# Arquitectura hexagonal: Vacancies y Candidates

API en Express + TypeScript organizada con arquitectura hexagonal.

```
src/
  app.ts                  # ensamblado: conecta piezas y monta /vacancies y /candidates
  server.ts
  shared/                 # DomainError, NotFoundError, errorHandler, HTTP_STATUS
  modules/
    vacancies/
    candidates/
      domain/             # Candidate.ts (tipos + parseNewCandidate)
      ports/              # CandidateRepository.ts
      application/        # CandidateService.ts
      adapters/
        http/             # candidateRoutes.ts
        persistence/      # InMemoryCandidateRepository.ts
```

## Comandos

```bash
npm install
npm test        # pruebas con Vitest + Supertest
npm run build   # compila a dist/
npm run dev     # http://localhost:3000
```

## API Candidates

| Operación | Ruta                     | Éxito | Error    |
|-----------|--------------------------|-------|----------|
| Listar    | `GET /candidates`        | 200   | --       |
| Ver uno   | `GET /candidates/:id`    | 200   | 404      |
| Crear     | `POST /candidates`       | 201   | 400      |
| Editar    | `PUT /candidates/:id`    | 200   | 400, 404 |
| Eliminar  | `DELETE /candidates/:id` | 204   | 404      |

Si `:id` no es un número se responde 400 con "El identificador no es válido".

## Postman

Importe `postman/Hexagonal.postman_collection.json` (Collection v2.1). La carpeta **Candidates** tiene las 5 peticiones del CRUD con tests del código de estado.
