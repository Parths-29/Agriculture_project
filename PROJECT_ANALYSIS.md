# DesiCane — Project Analysis

**Repository:** `Parths-29/Agriculture_project`  
**Product:** DesiCane, a sugarcane-farming advisory and farm-management demonstration  
**Audience/context:** Farmers in Northern Karnataka; college project associated with KIAAR and Godavari Biorefineries Ltd.

This document describes the implementation present in the repository. It distinguishes working integrations from sample values and simulations so the interface is not mistaken for a production agronomy or IoT system.

## 1. Project at a glance

DesiCane is a single-page web application built with React, TypeScript, and Vite. It combines public landing and account pages with a protected farmer workspace. The workspace contains a dashboard, agricultural news, crop/yield analysis, weather, inventory, a simulated sensor monitor, and downloadable seasonal reports.

The frontend calls an Express API for registration, login, and AI-generated news. The API uses MongoDB for users and Google Gemini for news generation. Other data-heavy pages currently use local constants, browser storage, or generated sample readings. The repository does not contain a deployed sensor ingestion service or an agronomic machine-learning model.

## 2. Technology and runtime layout

| Area | Implementation |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 5, React Router 7 |
| Styling and motion | Tailwind CSS 3, custom CSS, Framer Motion |
| Charts | Recharts and Visx wrappers under `src/components/charts` and `src/components/ui` |
| Icons and maps | Lucide React, React Leaflet, Leaflet, OpenStreetMap tiles |
| API | Node.js ES modules, Express 5, Mongoose, Axios |
| API middleware | Helmet, CORS, JSON parsing, dotenv |
| Automated tests | Vitest, StrykerJS + Vitest runner, Playwright |
| Frontend deployment config | `vercel.json` SPA rewrite; backend remains a separate Node service |

The root `dev` script starts the Vite frontend via `dev.js` and the API server in `backend/`. Vite proxies `/api` to `http://localhost:5000`. `VITE_API_URL` can override the same-origin API base used by the frontend. The Express server serves `dist/` when that directory exists, including a client-side route fallback. Vercel configuration only rewrites routes to the frontend `index.html`; it does not deploy the Express API.

## 3. Application routes

`src/App.tsx` wraps the router in `LanguageProvider` and `AuthProvider` and defines these routes:

| Path | Page | Access |
|---|---|---|
| `/` | `Landing` | Public |
| `/signup` | `SignUp` | Public |
| `/login` | `Login` | Public |
| `/home` | `Home` | Protected |
| `/news` | `News` | Protected |
| `/article/:id` | `ArticleDetail` | Protected |
| `/analysis` | `Analysis` | Protected |
| `/weather` | `Weather` | Protected |
| `/inventory` | `Inventory` | Protected |
| `/iot` | `IoT` | Protected |
| `/reports` | `Reports` | Protected |
| Any unmatched path | Redirect to `/` | — |

`ProtectedRoute` checks whether `currentUser` exists in `AuthContext`; otherwise it redirects to `/login`. This is a client-side navigation guard, not a server-side authorization boundary. The API endpoints themselves do not require a session or token.

## 4. Shared application behavior

### Authentication state

`src/context/AuthContext.tsx` initializes the current user from the `currentUser` localStorage entry. Login and signup POST JSON to `/api/auth/login` and `/api/auth/signup`; a successful login stores the returned user in state and localStorage. Logout clears both. A static `users` array is also exposed from context, but authentication calls the API rather than checking that array.

The saved user is parsed from localStorage without a recovery guard. There is no access token, cookie session, server-side authorization middleware, or cross-tab synchronization in this implementation.

### Language and theme

`src/lib/translations.ts` contains UI strings for English, Kannada, Hindi, Tamil, Telugu, and Marathi. `LanguageContext` starts in English and translates by active language, then falls back to English and finally the key. Language selection is global for the mounted app, but the current language is not persisted across reloads. `LanguageToggle` exposes all six choices.

`Navbar` owns the dark-mode toggle. It reads/writes the `theme` localStorage key and otherwise follows the browser's dark-mode preference. It provides the workspace navigation links and logout action. `Footer`, shared input/button primitives, animated backgrounds, and chart wrappers provide repeated layout and presentation.

## 5. Page-by-page implementation

### Landing, sign-up, and login

- **Landing (`src/pages/Landing.tsx`):** Public product introduction with links into account creation/sign-in and app feature messaging.
- **Sign-up (`src/pages/SignUp.tsx`):** Collects name, phone, password, confirmation, and optional village. It calls the pure `validateSignUp` function before the API request, maps validation keys to translated inline errors, and displays API errors/success feedback.
- **Login (`src/pages/Login.tsx`):** Checks required fields with `validateLogin`, displays request loading/error states, calls the API through `AuthContext`, and navigates to `/home` after success. It counts failed attempts in page state and shows the help prompt after repeated failures.
- **Shared form controls:** `InputField` translates labels and error keys. `Button` supports variants and a loading indicator.

The validation functions are implemented in `src/lib/validation.ts`. Sign-up requires a non-whitespace name, a non-whitespace phone consisting only of digits and exactly ten characters, a non-empty password of at least six characters, and a non-empty confirmation matching the password. Village is optional. Login currently validates only that phone and password are non-empty; it does not enforce phone formatting or password length.

### Farmer dashboard (`/home`)

`Home` greets the saved user, presents headline farm/adoption statistics and exploration cards, and rotates a set of hero images on a timer. The values and imagery are sample presentation data; this page is not backed by a farm account or analytics API.

### News and article details (`/news`, `/article/:id`)

`News` starts with eight bundled articles in `src/lib/mockData.ts`. On mount it attempts `GET /api/news`; a successful response replaces the article set and reuses bundled thumbnails. A request failure leaves the sample articles available. Search filters title, excerpt, and author locally; a separate action asks the API to generate topic-specific articles. “Load more” also asks the API for another batch. The page shows four items initially and includes loading and empty-result states.

`ArticleDetail` reads an article passed in router state or falls back to a bundled article with the route ID. Unknown IDs render a not-found message and a back-to-news action. Article bodies are split into paragraphs and formatted from simple markdown-like lines; this is not a general Markdown renderer. Generated AI articles may be available through navigation state but are not persisted for a later direct URL visit.

### Crop and farm analysis (`/analysis`)

`Analysis` offers interactive inputs for plot area, sugarcane variety, soil, irrigation approach, planting season, Brix, and Pol. `useMemo` derives yield, sugar, and cost estimates from local factor tables and constants. Charts show sample yield trends, monthly water values, cost categories, and calculation outputs. The calculations are client-side estimates, not predictions from a trained model or a server-side agronomy service.

### Weather (`/weather`)

`Weather` lets a user select a district from a fixed North Karnataka coordinate list and fetches current, hourly, and seven-day forecast data from Open-Meteo. It displays current conditions, a forecast, a map, charts, and rule-based advisories derived from forecast thresholds (rain, minimum temperature, and wind). It needs network access to Open-Meteo and displays loading/error UI when the request cannot be completed. The advisories are simple thresholds, not crop-specific AI recommendations.

### Inventory (`/inventory`)

`Inventory` is a browser-local inventory manager with seven initial sample items and categories for fertilizers, machinery, seeds, pesticides, and fuel. Users can add, edit, delete, search, filter by category, and view low/out-of-stock and maintenance alerts. The `DesiCane-inventory` localStorage key persists changes in the current browser. There is no inventory API or synchronization between users/devices.

### IoT monitor (`/iot`)

`IoT` creates a fixed set of sample sensors for moisture, temperature, humidity, pH, conductivity, water flow, light, and wind. It generates history arrays using random values, then updates online readings on a five-second interval. The page provides grid/list views, plot filters, sensor details, charts, battery/status information, and generated/acknowledgeable alerts. All readings are simulated in browser memory; there is no hardware connection, telemetry API, or durable sensor history.

### Reports (`/reports`)

`Reports` renders overview/comparison tabs with fixed current/previous season values, KPIs, expense/water breakdowns, and charts. The download action creates a plain-text `.txt` summary using those constants. It is not a generated PDF, and its figures are not loaded from user-specific farm records.

## 6. Backend/API behavior

### Server setup (`backend/server.js`)

The Express server uses Helmet, permissive default CORS, and JSON request parsing, then mounts `/api/auth` and `/api/news`. It reads environment variables from the repository root `.env` when present and also loads the backend environment. `PORT` defaults to 5000. On MongoDB connection it upserts two demonstration users directly into the `users` collection. If `dist/` exists, it serves that directory and provides a frontend fallback route.

### User model and auth routes

`backend/models/User.js` defines required name, phone, password, and language fields, optional village, a unique phone index, and Mongoose timestamps.

- `POST /api/auth/signup`: checks for an existing phone, creates a user, and returns 201. Duplicate phone returns 400; unexpected errors return 500.
- `POST /api/auth/login`: looks up the phone and compares the submitted password with the stored value. Missing account and wrong password return distinct 401 messages; success returns the user.
- `backend/seed.js`: connects to MongoDB, deletes the two sample phone records, re-inserts those demo accounts, and disconnects.

**Security status:** Passwords are stored and compared as plain text. Login error messages distinguish missing accounts from incorrect passwords. The auth routes do not issue or validate a session/token, do not enforce authorization, and there is no request schema/rate-limit layer. These are acceptable only as demonstration shortcuts and need replacing before production use. The API also returns the Mongoose user document, which includes the password field unless transformed elsewhere.

### AI news route (`backend/routes/news.js`)

`GET /api/news` optionally accepts `q`. The route builds a prompt for four current-year farming news objects, sends it to Google's Gemini API via Axios using `GEMINI_API_KEY`, requests JSON output, parses the first candidate, and returns `{ articles }`. Errors return 500. The frontend supplies fallback articles when the API is unavailable. This endpoint requires a valid server-side API key and network access; the key must never be placed in client code or committed.

## 7. Tests and verification assets

| Asset/command | Scope |
|---|---|
| `npm run test:unit` | Vitest suite for pure validation functions in `src/lib/__tests__/validation.test.ts` |
| `npm run test:mutation` | StrykerJS + Vitest runner; `stryker.conf.json` mutates only `src/lib/validation.ts`; HTML output is configured at `reports/mutation/mutation.html` |
| `npm run test:e2e` | Playwright Chromium browser flows in `e2e/` for sign-up, login, and route guards/logout |
| `test_case_table.md` | Manual test case catalogue for the wider UI |
| `TESTING.md` | Test commands and recorded results |

At the preceding verification run, the unit suite passed **15/15** and Stryker killed **84/84** mutants (100% mutation score, 0 survivors, 0 equivalent mutants identified). These results cover the validation module and do not constitute full application or backend coverage. Playwright specs exist, but the Playwright config expects a separately started server at `http://localhost:5173`; it does not start it automatically.

## 8. Configuration and important files

| Path | Responsibility |
|---|---|
| `src/main.tsx` | Browser entry point; mounts the React application |
| `src/App.tsx` | Context wrappers and route table |
| `src/index.css`, `tailwind.config.js`, `postcss.config.js` | Global styles and CSS build setup |
| `vite.config.ts` | React plugin, `@` alias, `/api` development proxy, Vitest settings |
| `backend/server.js` | API middleware, route mounting, database startup, optional static frontend serving |
| `backend/routes/` | Authentication and generated-news API handlers |
| `backend/models/User.js` | MongoDB user schema |
| `dev.js` | Bootstraps Vite with the Node crypto compatibility shim |
| `vercel.json` | Frontend SPA rewrite configuration |
| `.env` | Local-only runtime secrets/configuration; ignored by Git |

## 9. Current limitations and practical follow-ups

1. **Demo data:** Dashboard metrics, analysis inputs/factors, report figures, inventory seeds, and IoT sensors are local sample data. They should not be presented as measured farm results.
2. **Security:** Add password hashing, non-enumerating login responses, authentication/session tokens, authorization checks, request validation, rate limits, and omit password fields from API responses before handling real farmer accounts.
3. **Storage:** Inventory, language choice, and authentication state use browser storage/state; there is no per-user farm data API or multi-device sync.
4. **Weather/network dependency:** The weather page calls Open-Meteo directly. Error states depend on connectivity and API availability.
5. **AI news dependency:** Gemini key/configuration and upstream availability are required for generated news. Validate and bound user query input and validate the returned JSON before using it.
6. **Deployment split:** Vercel rewrites frontend paths only. Configure/deploy the Express API separately and set `VITE_API_URL` to that API origin in production.
7. **Test coverage:** Automated unit tests cover only validation logic; E2E coverage is limited to the named journeys. Backend routes, weather, inventory, analysis, and simulated IoT logic have no test suite listed in the repository.

## 10. Repository hygiene

Keep credentials in local environment files or deployment secrets. `.env`, `.env.*`, Stryker work directories, and Playwright output folders are ignored by Git. Commit source/configuration and intentional deliverables such as `PROJECT_ANALYSIS.md`, `TESTING.md`, and the requested mutation report, not copied Stryker sandboxes or secret-bearing environment files.
