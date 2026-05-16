# Companies Module — Mpumelelo Sithole (230526934)

## Files in this push

| File | Description |
|------|-------------|
| `src/sections/Companies.tsx` | Full Companies UI — card grid, Add/Edit modal, search, delete |
| `src/services/localApi.ts` | All service API functions including `companiesAPI` (getAll, create, update, delete) |
| `src/types/index.ts` | TypeScript types including the `Company` interface |
| `server/routes/companies.ts` | Express REST API routes for Companies (GET, POST, PUT, DELETE) |

## What companiesAPI does

- **getAll** — fetches all companies scoped to the logged-in user, enriches each with `applicationCount`
- **create** — adds a new company with a UUID and links it to the current user via `userId`
- **update** — merges updated fields into the existing company record
- **delete** — removes the company by ID after user confirms the warning

## How to push

```bash
git add src/sections/Companies.tsx
git add src/services/localApi.ts
git add src/types/index.ts
git add server/routes/companies.ts
git commit -m "feat: add Companies module - backend service, UI, types and server routes"
git push
```
