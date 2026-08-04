# Task List

Ruby on Rails app generated with Rails 8.1.3.1 and PostgreSQL.

## Requirements

- Docker
- Docker Compose

## Run

```bash
docker compose up --build
```

The app will be available at http://localhost:3000.

Swagger UI is available at http://localhost:3000/api-docs.
The generated Swagger document is available at http://localhost:3000/api/v1/swagger_doc.
The health check API is available at http://localhost:3000/api/v1/health.

The `web` service waits for PostgreSQL, runs `bin/rails db:prepare`, and starts
the Rails development server.

## Rails Commands

```bash
docker compose run --rm web ./bin/rails test
docker compose run --rm web ./bin/rails console
docker compose run --rm web ./bin/rails db:migrate
```

## Stop

```bash
docker compose down
```

To remove the PostgreSQL data volume:

```bash
docker compose down -v
```
