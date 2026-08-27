# 🛒 ShoppersStack Automation Framework

Enterprise Playwright automation for **https://www.shoppersstack.com** covering **UI + API** functional tests using advanced Playwright features and TypeScript.

## 🧱 Stack
- Playwright (TS) — `@playwright/test`
- Zod — env & response validation
- pino — structured logging
- @faker-js/faker — random test data
- Allure + HTML + JUnit reporters
- ESLint + Prettier + Husky + lint-staged
- GitHub Actions CI

## 🏗️ Structure
```
config/            Playwright configs + env files
src/
  core/            BasePage, BaseApiClient, constants
  config/          Zod env loader
  ui/
    locators/      Externalized locators w/ {{param}} substitution
    pages/         Page Objects (POM)
    components/    Reusable widgets (Header, Toast)
  api/
    clients/       Auth, Product, Cart, Order, Customer APIs
    models/        DTOs (request + response)
    schemas/       Zod runtime validation
  fixtures/        base / ui / api fixtures
  utils/           Logger, DataGenerator, JsonUtil
auth/
  setup/           customer.auth.setup.ts + api.token.setup.ts
  storage/         .gitignored session/token storage
data/testdata/     ui + api JSON payloads
tests/
  ui/              auth, product, cart, checkout, account, smoke
  api/             auth, product, cart, order, customer, chained
```

## ⚙️ Setup

```powershell
cd shoppersstack-automation
npm install
npx playwright install --with-deps chromium
Copy-Item config\env\.env.example config\env\.env.qa
# edit .env.qa with your credentials
```

## ▶️ Run

```powershell
# Full suite
npm test

# Only smoke
npm run test:smoke

# Only regression
npm run test:regression

# Only UI
npm run test:ui

# Only API
npm run test:api

# Headed / UI mode / Debug
npm run test:headed
npm run test:ui-mode
npm run test:debug

# Codegen
npm run codegen

# Reports
npm run report
npm run report:allure
```

## 🏷️ Tagging Strategy
Tests are tagged in titles:
- `@smoke` — critical happy paths
- `@regression` — full coverage
- `@ui` / `@api` / `@auth` / `@cart` / `@order` etc.

Run filtered:
```powershell
npx playwright test --grep "@smoke"
npx playwright test --grep "@api.*@auth"
```

## 🔐 Environment Variables (config/env/.env.qa)
| Key | Description |
|---|---|
| `BASE_URL` | Web base URL |
| `API_BASE_URL` | API base URL |
| `CUSTOMER_EMAIL` | Test user email |
| `CUSTOMER_PASSWORD` | Test user password |
| `LOG_LEVEL` | pino log level |
| `TEST_ENV` | Env identifier (qa/uat/dev) |

## 🌿 Git Workflow

Branching (Git Flow Lite):
- `main` — protected, releases
- `develop` — integration
- `feature/*` — new features
- `bugfix/*` — bug fixes
- `hotfix/*` — urgent prod fixes

```powershell
git init -b main
git remote add origin https://github.com/<you>/shoppersstack-automation.git
git add .
git commit -m "chore: initial framework scaffold"
git push -u origin main
git checkout -b develop
git push -u origin develop
```

Configure secrets in GitHub → **Settings → Secrets and variables → Actions**:
- `BASE_URL`, `API_BASE_URL`
- `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`

## 🚦 Advanced Playwright Features Used
- Project dependencies (`setup:ui` → `ui`, `setup:api` → `api`)
- Storage state auth (login once, reuse across tests)
- Custom fixtures composition (base → ui/api)
- `APIRequestContext` for native API testing
- Zod schema validation of API responses
- Retries + trace + video + screenshots on failure
- `expect.poll()` for eventually consistent waits
- `test.step()` for Allure sub-steps
- Locator engine abstraction with fallback chain (`_helpers.ts`)
- Test tagging + `--grep` filters
- Sharding via `--shard`

## 📊 Reports
- HTML → `reports/html/index.html`
- Allure results → `reports/allure-results`
- JUnit → `reports/junit/results.xml`

## 📝 Notes
- Endpoint paths in [Endpoints.ts](src/core/constants/Endpoints.ts) are the assumed contract — confirm actual paths via browser DevTools → Network on ShoppersStack.
- API specs use permissive status arrays (`[200, 400, 401, 404]`) since exact contract is unverified — tighten once real responses are captured.
