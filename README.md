# Tennis Academy Mobile (Expo + TypeScript)

Mobile app for `STUDENT`, `COACH/TRAINER`, and `ADMIN`, aligned with the backlog in this meta-repo.

## Mobile backlog checklist used for implementation

### STUDENT MVP
- [x] Login (`POST /auth/login` + `GET /me`)
- [x] Home with upcoming sessions
- [x] Home membership status card placeholder with explicit TODO (endpoint gap)
- [x] My Schedule (week) via `GET /my/schedule/week?start=YYYY-MM-DD`
- [x] History with pagination via `GET /my/history?limit&offset`
- [x] Show only student-visible notes (`studentNotes`)
- [x] Settings: language switch (RO/EN) + logout

### COACH/TRAINER MVP
- [x] Today list of sessions (filtered to current coach/trainer)
- [x] Week schedule (basic view)
- [x] Session details with assigned students
- [x] Session completion flow
  - [x] attendance (`PRESENT`/`LATE`/`ABSENT`)
  - [x] duration
  - [x] RPE
  - [x] internal notes + student-visible notes
  - [x] `GET /sessions/{id}/metrics`
  - [x] `POST /sessions/{id}/complete`

### ADMIN MVP
- [x] Billing month overview `GET /billing/month?year&month`
- [x] Billing overdue list `GET /billing/overdue?year&month`
- [x] Billing status updates (`PAID`/`DUE`/`WAIVED`) with `PATCH /billing/students/{id}/month?year&month`
- [x] Students list/search
- [x] Student details
- [x] Create student account with one-time temp password display

### Shared hard requirements
- [x] Expo + TypeScript
- [x] React Navigation with role-based root navigator
- [x] React Native Paper (Material 3)
- [x] i18n RO + EN (RO default), all UI strings via keys
- [x] Timezone handling in `Europe/Bucharest`
- [x] JWT storage in `expo-secure-store`
- [x] Global 401 handling -> logout
- [x] Typed API DTOs + centralized fetch wrapper
- [x] Env API URL + in-app dev override (long-press on version)
- [x] ESLint + Prettier + typecheck scripts

## Stack

- Expo SDK 54
- React Native + TypeScript
- React Navigation (native stack + bottom tabs)
- React Native Paper (MD3)
- `expo-secure-store` for JWT
- Luxon for timezone-safe week/date logic

## Project structure

```text
src/
  components/
  i18n/
  navigation/
  screens/
	auth/
	student/
	coach/
	admin/
	common/
  lib/
	api/
	auth/
	config/
	utils/
  theme/
```

## Environment and API URL

Create `.env` from `.env.example`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Notes:
- iOS simulator can use `http://localhost:8080`
- Android emulator usually needs `http://10.0.2.2:8080`

### In-app developer override (no rebuild required)

1. Open **Settings** tab
2. Long-press on the **Version** label
3. Enter API URL override and save
4. App logs out to force a clean re-auth against the new backend URL

## Setup

```bash
npm install
cp .env.example .env
npm run typecheck
npm run lint
npm run start
```

## Run

```bash
npm run android
npm run ios
```

## Demo scripts by role

### STUDENT
1. Login with a student account
2. Open **Home** -> verify upcoming sessions
3. Open **Schedule** -> switch week prev/next/today
4. Open **History** -> load more, verify only student notes are visible
5. Open **Settings** -> switch language RO/EN, logout

### COACH / TRAINER
1. Login with coach/trainer account
2. Open **Today** -> open one session
3. Check **Session details** student list
4. Open **Complete session**
5. Set attendance, duration, RPE, internal notes, student notes
6. Save and verify success
7. Open **Week** -> browse another week and open details

### ADMIN
1. Login with admin account
2. Open **Billing** month tab, inspect rows
3. Switch to **Overdue**, inspect rows
4. Update a status (paid/due/waived)
5. Open **Students** -> search and open student details
6. Create account and confirm temporary password dialog

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run typecheck
npm run format
npm run format:check
```

## Current TODOs (intentional)

- Student membership status endpoint is not available for student portal contract yet; a TODO card is shown in student home while app remains functional.
