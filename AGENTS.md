# AGENTS.md

## Project Snapshot

- Product: CPF investment platform with public marketing pages, investor cabinet, owner area, and Laravel admin/backoffice.
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Radix UI, shadcn/ui patterns, React Hook Form, TanStack Query, Zod, Lucide.
- Backend: Laravel 12, PHP 8.2, Filament 5, Sanctum, Spatie packages (`activitylog`, `data`, `medialibrary`, `permission`, `query-builder`), YooKassa SDK.
- Infra: Docker Compose on server, host NGINX + Certbot, GitHub as source of truth, remote deploy script in `deploy/scripts/deploy-remote.sh`.

## Source Of Truth

- Always treat `origin/main` on GitHub as the deployable branch unless the task explicitly says otherwise.
- Before deploy, commit local changes, push to GitHub, then run the remote deploy script.
- Do not patch production manually if the change can be shipped through Git + deploy scripts.

## Frontend Architecture

- Keep the current feature-sliced structure:
  - `src/entities` for domain entities and pure domain-level UI/state.
  - `src/features` for user actions and workflows.
  - `src/widgets` for composed sections and shell-level UI.
  - `src/page-views` for page assemblies.
  - `src/shared` for reusable low-level primitives, config, api, and utilities.
- Prefer small components. Split layout, state, and presentation when a file starts carrying more than one responsibility.
- Follow the rule already used in the repo: one entity, one domain; no oversized components/functions.
- Reuse cabinet shell/workspace primitives before inventing page-specific wrappers.

## Backend Architecture

- Backend is domain-oriented, not controller-oriented.
- Primary domain structure lives in `cpf-backend/src/Domains/*` with slices like:
  - `Application`
  - `Domain`
  - `Http`
  - `Filament`
  - `routes`
- Legacy/supporting app-level structure still exists in `cpf-backend/app/*`, including `Modules`, `Filament`, `Http`, `Models`, `Support`.
- New backend work should prefer domain boundaries and explicit use-cases over fat controllers or shared god-services.
- Keep business rules inside domain/application layers, not in Blade/Filament/resource glue.

## Design Direction

### Landing

- The landing should feel premium, calm, and financial, not startup-generic.
- Base palette: cold neutrals and deep blue accents. Avoid random warm tones, purple drift, and noisy rainbow gradients.
- Typography should feel editorial and confident. Strong hierarchy, deliberate spacing, and clear contrast over decorative copy.
- Each section needs one accent only:
  - a highlighted word,
  - an icon/vector,
  - a strong numeric/stat accent,
  - or a compositional accent with whitespace.
- Avoid repetitive card grids with the same treatment everywhere. Alternate density, layout rhythm, and emphasis.
- CTA blocks should be specific and credible. No vague marketing filler.

### Investor Cabinet

- The investor cabinet is stricter than the landing: colder, cleaner, more operational.
- Primary visual system:
  - dark blue + light blue surfaces,
  - high text contrast,
  - reduced rounding,
  - thin borders,
  - restrained shadows,
  - clear status coloring.
- Important information must dominate visually:
  - money,
  - statuses,
  - next actions,
  - verification blockers,
  - portfolio state.
- Card headings and helper text must be concrete and informative. Remove vague phrases like conceptual slogans that do not help the user act.
- Dividers need breathing room. Never leave a separator glued to the next block of content.
- Use vector icons deliberately to improve scanning, not as decoration spam.
- Accent key words or numbers, but keep the page mostly neutral so attention stays on priority blocks.

## Copy Rules

- Write for a real investor or operator, not for a concept presentation.
- Prioritize clarity, status, and next step.
- Prefer active, specific labels:
  - `Пополнить счёт`
  - `Завершить проверку`
  - `Доступно для инвестирования`
- Avoid filler copy like "рабочий контур", "самое важное", "готовность к операциям" unless the phrase maps to a real user action or status.
- Headings/buttons should use concise Title Case where natural; body copy should stay plain and readable.

## shadcn/ui Usage

- `components.json` is configured with:
  - style: `new-york`
  - css variables enabled
  - `app/globals.css` as the theme source
  - `lucide` icons
- Use shadcn as the base primitive layer, not as the final visual identity.
- Allowed:
  - Radix/shadcn primitives for accessibility and interaction,
  - local styling through project tokens and Tailwind classes,
  - composition into project-specific UI in `src/shared/ui` or feature/widget layers.
- Avoid:
  - dumping raw generated shadcn components into pages without adapting them,
  - mixing several visual idioms inside one flow,
  - introducing another component library unless explicitly required.

## Styling Rules

- Theme tokens live in `app/globals.css`. Extend tokens first, then consume them in components.
- Prefer semantic cabinet/site tokens over hardcoded one-off colors.
- Avoid `transition-all`; transition only the properties that actually animate.
- Use `text-balance`/`text-pretty` on headings and constrained descriptions where helpful.
- Keep mobile layouts intentionally redesigned, not just compressed desktop layouts.
- Maintain visible `focus-visible` states and explicit hover/active states.

## UI Quality Checklist

- Is the main action obvious in the first viewport?
- Is the most important number or status visually dominant?
- Does every label explain something real?
- Is there enough spacing after dividers and section headers?
- Are empty states and loading states informative?
- Are icons meaningful and consistent with the current visual language?

## Deployment Workflow

### Standard Flow

1. Review local diff and verify critical checks.
2. Commit changes locally.
3. Push to GitHub `origin/main`.
4. Run:

```bash
bash deploy/scripts/deploy-remote.sh sshtest /opt/cpf/app
```

### What The Deploy Script Does

- Connects to the target server over SSH.
- Ensures the repo exists at `/opt/cpf/app`.
- Backs up a dirty remote worktree into `/opt/cpf/backups`.
- Fetches `origin/main`.
- Resets the remote checkout to the pushed GitHub state.
- Rebuilds and restarts the Docker Compose stack.
- Waits for the backend container.
- Runs Laravel optimize clear, migrations, optimize, and prints `docker compose ps`.

### Important Deploy Notes

- The deploy script resets the remote tree hard to GitHub state. Do not store uncommitted production-only code on the server.
- Production env files must already exist on the server:
  - `/opt/cpf/app/.env.production`
  - `/opt/cpf/app/cpf-backend/.env.production`
- If they do not exist, the script creates templates and stops.
- For direct server-side update, use:

```bash
bash deploy/scripts/update-server.sh /opt/cpf/app main
```

## Working Agreement For Future Tasks

- For new UI work, preserve the cold premium financial language established across the landing and cabinet.
- For cabinet work, prefer strict operational clarity over decorative marketing language.
- For backend work, preserve domain boundaries and keep use-cases explicit.
- For deployment requests, default to: commit, push to GitHub, deploy by script, then report the exact result.
