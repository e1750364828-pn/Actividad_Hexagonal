# Arquitectura hexagonal: Vacancies y Candidates

API en Express + TypeScript organizada con arquitectura hexagonal. El módulo **Candidates** puede guardar sus datos en memoria o en **PostgreSQL con `pg`** (opción A de la Tarea 3).

```
db/
  schema.sql              # tabla candidates (skills como TEXT[])
src/
  app.ts                  # ensamblado: elige el repositorio según CANDIDATES_ADAPTER
  server.ts               # carga .env (dotenv) antes que la aplicación
  shared/
    database/postgres.ts  # función de conexión (Pool de pg)
  modules/
    vacancies/
    candidates/
      domain/             # Candidate.ts (tipos + parseNewCandidate)
      ports/              # CandidateRepository.ts (asíncrono)
      application/        # CandidateService.ts
      adapters/
        http/             # candidateRoutes.ts
        persistence/      # InMemoryCandidateRepository.ts, PostgresCandidateRepository.ts
```

## Configuración

1. Instale dependencias: `npm install`
2. Cree las bases de desarrollo y de pruebas, y la tabla en ambas:

   ```bash
   psql -U postgres -c "CREATE DATABASE candidates_dev;"
   psql -U postgres -c "CREATE DATABASE candidates_test;"
   psql -U postgres -d candidates_dev -f db/schema.sql
   psql -U postgres -d candidates_test -f db/schema.sql
   ```

3. Copie `.env.example` a `.env` y complete la contraseña. El archivo `.env` no se sube a GitHub.

| Variable             | Uso                                                         |
|----------------------|-------------------------------------------------------------|
| `CANDIDATES_ADAPTER` | `sql` para PostgreSQL; cualquier otro valor usa memoria      |
| `DATABASE_URL`       | Base de desarrollo. Si no existe, se usa memoria             |
| `TEST_DATABASE_URL`  | Base de pruebas de integración (distinta a la de desarrollo) |

Al iniciar, la consola indica el almacenamiento elegido, por ejemplo `Candidates persistence: PostgreSQL with pg`.

## Comandos

```bash
npm test                  # pruebas unitarias y de endpoints (no necesitan base de datos)
npm run test:integration  # pruebas del adaptador PostgreSQL contra TEST_DATABASE_URL
npm run build             # compila a dist/
npm run dev               # http://localhost:3000
```

Las pruebas de integración fallan a propósito si `TEST_DATABASE_URL` no existe o es igual a `DATABASE_URL`, porque vacían la tabla antes de cada prueba.

## API Candidates

| Operación | Ruta                     | Éxito | Error    |
|-----------|--------------------------|-------|----------|
| Listar    | `GET /candidates`        | 200   | --       |
| Ver uno   | `GET /candidates/:id`    | 200   | 404      |
| Crear     | `POST /candidates`       | 201   | 400      |
| Editar    | `PUT /candidates/:id`    | 200   | 400, 404 |
| Eliminar  | `DELETE /candidates/:id` | 204   | 404      |

Si `:id` no es un número se responde 400 con "El identificador no es válido".

Ejemplo de cuerpo:

```json
{ "name": "Ana Torres", "email": "ana@correo.com", "city": "Quito", "experienceYears": 2, "skills": ["TypeScript", "SQL"] }
```

`skills` es opcional (por defecto `[]`); si se envía debe ser una lista de textos no vacíos, si no se responde 400 con "Las habilidades deben ser una lista de textos".

## Postman

Importe `postman/Hexagonal.postman_collection.json` (Collection v2.1). La carpeta **Candidates** crea un candidato, guarda su id en `candidateId` y verifica que `skills` se conserve al crear, ver y editar. Pasa completa con `CANDIDATES_ADAPTER=memory` y con `CANDIDATES_ADAPTER=sql`.
