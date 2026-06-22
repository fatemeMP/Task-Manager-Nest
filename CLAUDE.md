# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start          # Start the server
yarn start:dev      # Start with hot-reload (watch mode)

# Build
yarn build          # Compile TypeScript via NestJS CLI

# Testing
yarn test           # Run all unit tests (src/**/*.spec.ts)
yarn test:watch     # Run tests in watch mode
yarn test:cov       # Run tests with coverage
yarn test:e2e       # Run e2e tests (test/**/*.e2e-spec.ts)
yarn test -- <file> # Run a single spec file (e.g., yarn test -- src/tasks/tasks.service.spec.ts)

# Linting & Formatting
yarn lint           # ESLint with auto-fix
yarn format         # Prettier
```

## Architecture

This is a **NestJS 11** REST API with **TypeORM 0.3** and **PostgreSQL**. The app manages tasks with full CRUD.

### Module structure

- **`AppModule`** ([src/app.module.ts](src/app.module.ts)) — Root module. Configures `TypeOrmModule.forRoot()` with PostgreSQL connection (host `localhost`, database `task_manager`, credentials hardcoded). Imports `TasksModule`.
- **`TasksModule`** ([src/tasks/tasks.module.ts](src/tasks/tasks.module.ts)) — Feature module registering the `Task` entity via `TypeOrmModule.forFeature([Task])`.

### Layer roles

- **Controller** ([src/tasks/tasks.controller.ts](src/tasks/tasks.controller.ts)) — Route handlers under `POST/GET/PUT/DELETE /tasks`. Delegates to `TasksService`, passing validated DTOs.
- **Service** ([src/tasks/tasks.service.ts](src/tasks/tasks.service.ts)) — Business logic using TypeORM `Repository<Task>`. `findAll` returns paginated results (`{ data, total, page, lastPage }`). Throws `NotFoundException` on missing records.
- **Entity** ([src/tasks/task.entity.ts](src/tasks/task.entity.ts)) — `Task` has `id` (auto-generated PK), `title`, and `completed` (default `false`). **No `status` column** — see note below.
- **DTOs** use `class-validator` decorators. A global `ValidationPipe` with `whitelist: true` strips unknown properties.

### Known quirks / work-in-progress

1. **`status` filter mismatch**: `GetTasksQueryDto` accepts a `status` param from `TaskStatus` enum ([src/models/task.model.ts](src/models/task.model.ts): `TODO | IN_PROGRESS | DONE`), and the service queries `task.status` — but the `Task` entity has no `status` column, only a `completed` boolean. This will silently fail at runtime. The entity needs a `status` column, or the filter should use `completed`.

2. **Pipe registration order**: `ValidationPipe` is applied **after** `app.listen()` in [src/main.ts](src/main.ts). In NestJS, global pipes should be registered before `listen()` to take effect. Swap the order.

3. **Database credentials are hardcoded** in `AppModule`. Move to environment variables before production use.

4. **`delete` method** in the service doesn't actually delete — it just checks existence and returns a success message. The `taskRepository.delete()` call is missing.

### Testing patterns

- Unit tests use `@nestjs/testing`'s `Test.createTestingModule()`. Current tests are minimal (only `should be defined` checks). When adding real tests, mock the TypeORM repository with `getRepositoryToken(Task)`.
- E2E tests use `supertest` against a full `INestApplication` created from `AppModule`. Config is in [test/jest-e2e.json](test/jest-e2e.json).
