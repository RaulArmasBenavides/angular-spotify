# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 21 application that mimics Spotify functionality with a music player interface. It features a modular architecture with lazy-loaded feature modules, session-based authentication, and RxJS-driven state management.

## Development Commands

### Running the Application
```bash
npm start
# or
ng serve
```
Starts the development server at `http://localhost:4200/`. The app automatically reloads on file changes.

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests in CI environment (headless Chrome, no watch)
npm test-ci

# Run a specific test file
ng test --include='**/path/to/file.spec.ts'
```

### Building
```bash
# Production build
npm build
# or
ng build

# Development build with watch mode
npm run watch
```

### Code Generation
Use Angular schematics to generate new code:
```bash
# Component
ng generate component path/to/component-name

# Service
ng generate service path/to/service-name

# Guard
ng generate guard core/guards/guard-name

# Interceptor
ng generate interceptor core/interceptors/interceptor-name

# Pipe
ng generate pipe shared/pipe/pipe-name

# Module
ng generate module modules/feature-name/feature-name
```

## Architecture

### Folder Structure
- **`src/app/core/`** — Guards, interceptors, and domain models. Singleton services and cross-cutting concerns.
  - `guards/` — Route protection (e.g., SessionGuard)
  - `interceptors/` — HTTP request/response handling (e.g., InjectSessionInterceptor)
  - `models/` — Interfaces and types (TrackModel, ArtistModel, PlaylistModel)

- **`src/app/shared/`** — Reusable components, pipes, directives, and utilities shared across modules.
  - `components/` — UI components (card-player, side-bar, media-player, header-user, etc.)
  - `services/` — Shared state and utilities (MultimediaService for audio control)
  - `pipe/` — Custom pipes (order-list.pipe)
  - `directives/` — Custom directives (img-broken.directive)

- **`src/app/modules/`** — Feature modules with lazy loading. Each module has its own routing and encapsulation.
  - `auth/` — Login authentication (public route)
  - `home/` — Main app layout and dashboard (private route)
  - `tracks/` — Track listing and management
  - `favorites/` — Favorites/liked tracks
  - `history/` — Search history

### Key Architectural Patterns

#### Module Organization
Each feature module follows a consistent structure:
- `{feature}-routing.module.ts` — Routes specific to the feature
- `{feature}.module.ts` — Module declaration
- `pages/` — Page-level components
- `components/` — Feature-specific components
- `services/` — Feature-specific services

Feature modules are lazily loaded via `loadChildren()` in the main router:
```typescript
{
  path: 'auth',
  loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
}
```

#### Session & Authentication
- `SessionGuard` prevents access to protected routes if no session token exists in cookies
- `InjectSessionInterceptor` automatically includes session data in HTTP requests
- Session token is stored via `ngx-cookie-service`

#### State Management
- `BehaviorSubject` is used for observable state (e.g., `MultimediaService` manages player state)
- Components subscribe to observables and use the async pipe for template binding

#### Audio/Multimedia Control
`MultimediaService` in `src/app/shared/services/` centralizes audio control:
- Manages play/pause, seek, volume
- Emits time elapsed, remaining time, and player status as observables
- Handles HTML5 audio element events (play, pause, ended, timeupdate)

### Path Aliases
TypeScript paths are configured in `tsconfig.json`:
- `@core/*` → `src/app/core/*`
- `@modules/*` → `src/app/modules/*`
- `@shared/*` → `src/app/shared/*`

Use these aliases to keep imports clean:
```typescript
import { SessionGuard } from '@core/guards/session.guard';
import { MultimediaService } from '@shared/services/multimedia.service';
```

## Configuration

- **TypeScript**: Strict mode enabled (`strict: true`). All type safety checks are required.
- **Angular Build**: Uses esbuild-based build system (Angular 21+)
- **Component Format**: Not using standalone components (all components declared in modules)
- **HTTP Client**: Provided via `provideHttpClient(withInterceptorsFromDi())` in AppModule
- **Forms**: Using Reactive Forms module for form handling

## Testing Notes

- Tests use Karma (test runner) and Jasmine (test framework)
- Each component/service should have a `.spec.ts` file
- Coverage reports can be generated via Karma config in `karma.conf.js`

## Git & Commits

Recent work has been on Angular version upgrades (Angular 19 → 21). When making changes:
- Keep commits focused and descriptive
- Avoid mixing feature work with version upgrades
- Update paths if refactoring the module structure
