"""
Generate a well-designed Word document (Playwright_Missing_Notes_MNC_Full.docx)
containing the complete missing-topics notes with clean visual design:
  - Cover page with color banner
  - Table of contents style intro
  - Styled headings with color bars
  - Info / Warning / Tip callout boxes (colored shaded tables)
  - Fenced code blocks (Consolas, light-gray shading)
  - Comparison tables with header banding
"""

from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement

# -------- Colors --------
BRAND      = RGBColor(0x1F, 0x49, 0x7D)   # deep blue
ACCENT     = RGBColor(0x2E, 0x75, 0xB6)   # medium blue
SUCCESS    = RGBColor(0x2E, 0x7D, 0x32)   # green
WARN       = RGBColor(0xB7, 0x47, 0x1E)   # orange
DANGER     = RGBColor(0xB0, 0x00, 0x20)   # red
TEXT       = RGBColor(0x22, 0x22, 0x22)
MUTED      = RGBColor(0x55, 0x55, 0x55)
CODE_FG    = RGBColor(0x1B, 0x1F, 0x23)

def shade(cell, hex_color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tc_pr.append(shd)

def set_cell_border(cell, color="BFBFBF", size="6"):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_borders = OxmlElement('w:tcBorders')
    for edge in ('top','left','bottom','right'):
        b = OxmlElement(f'w:{edge}')
        b.set(qn('w:val'), 'single')
        b.set(qn('w:sz'), size)
        b.set(qn('w:color'), color)
        tc_borders.append(b)
    tc_pr.append(tc_borders)

def add_page_break():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

def h1(text, color=BRAND):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(20)
    r.font.color.rgb = color
    # Bottom border via paragraph
    p_pr = p._p.get_or_add_pPr()
    p_bdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '12')
    bottom.set(qn('w:color'), f'{color[0]:02X}{color[1]:02X}{color[2]:02X}')
    p_bdr.append(bottom)
    p_pr.append(p_bdr)
    return p

def h2(text, color=ACCENT):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(15)
    r.font.color.rgb = color
    return p

def h3(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(12)
    r.font.color.rgb = BRAND
    return p

def para(text, bold=False, italic=False, color=TEXT, size=11):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.color.rgb = color
    r.font.size = Pt(size)
    return p

def bullets(items):
    for it in items:
        p = doc.add_paragraph(style='List Bullet')
        r = p.runs[0] if p.runs else p.add_run()
        p.text = ''
        r = p.add_run(it)
        r.font.size = Pt(11)
        r.font.color.rgb = TEXT

def code(text, lang=None):
    # Single-cell shaded table for a code block
    t = doc.add_table(rows=1, cols=1)
    t.autofit = True
    c = t.cell(0, 0)
    shade(c, 'F5F7FA')
    set_cell_border(c, color='D0D7DE')
    c.text = ''
    p = c.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    if lang:
        rlang = p.add_run(f'{lang}\n')
        rlang.italic = True
        rlang.font.size = Pt(8)
        rlang.font.color.rgb = MUTED
    r = p.add_run(text)
    r.font.name = 'Consolas'
    r.font.size = Pt(10)
    r.font.color.rgb = CODE_FG
    doc.add_paragraph()  # spacing

def callout(kind, title, body):
    palette = {
        'info':    ('E7F1FB', ACCENT,  'ℹ  '),
        'tip':     ('E9F7EF', SUCCESS, '✓  '),
        'warn':    ('FFF4E5', WARN,    '⚠  '),
        'danger':  ('FDECEA', DANGER,  '✕  '),
    }
    fill, color, icon = palette[kind]
    t = doc.add_table(rows=1, cols=1)
    c = t.cell(0, 0)
    shade(c, fill)
    set_cell_border(c, color='D0D7DE')
    c.text = ''
    p1 = c.paragraphs[0]
    r = p1.add_run(f'{icon}{title}')
    r.bold = True
    r.font.size = Pt(11)
    r.font.color.rgb = color
    p2 = c.add_paragraph()
    r2 = p2.add_run(body)
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = TEXT
    doc.add_paragraph()

def styled_table(headers, rows, header_fill='1F497D', header_color=RGBColor(0xFF,0xFF,0xFF)):
    t = doc.add_table(rows=1+len(rows), cols=len(headers))
    t.style = 'Light Grid Accent 1'
    hdr = t.rows[0].cells
    for i, h in enumerate(headers):
        shade(hdr[i], header_fill)
        hdr[i].text = ''
        p = hdr[i].paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.color.rgb = header_color
        r.font.size = Pt(11)
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            cell = t.rows[ri+1].cells[ci]
            fill = 'FFFFFF' if ri % 2 == 0 else 'F5F7FA'
            shade(cell, fill)
            cell.text = ''
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.size = Pt(10.5)
            r.font.color.rgb = TEXT
    doc.add_paragraph()

# ================= DOC =================
doc = Document()
# Base style
base = doc.styles['Normal']
base.font.name = 'Calibri'
base.font.size = Pt(11)

# Page margins
for section in doc.sections:
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin = Cm(1.8)
    section.right_margin = Cm(1.8)

# -------- COVER --------
# Big color banner
cover_tbl = doc.add_table(rows=1, cols=1)
cover_cell = cover_tbl.cell(0, 0)
shade(cover_cell, '1F497D')
cover_cell.text = ''
p = cover_cell.paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(60)
p.paragraph_format.space_after = Pt(20)
r = p.add_run('PLAYWRIGHT')
r.bold = True
r.font.size = Pt(40)
r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

p2 = cover_cell.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = p2.add_run('Missing Topics for Real-time MNC Projects')
r2.bold = True
r2.font.size = Pt(18)
r2.font.color.rgb = RGBColor(0xE8, 0xEE, 0xF6)

p3 = cover_cell.add_paragraph()
p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
p3.paragraph_format.space_before = Pt(40)
p3.paragraph_format.space_after = Pt(60)
r3 = p3.add_run('UI  •  API  •  Framework  •  CI/CD  •  Interview Radar')
r3.italic = True
r3.font.size = Pt(12)
r3.font.color.rgb = RGBColor(0xCC, 0xDA, 0xEC)

doc.add_paragraph()
para('A structured gap-analysis of standard Playwright learning notes vs what top MNC enterprise automation projects expect. Every section includes explanation + copy-paste ready snippets and commands.', italic=True, color=MUTED)

# TOC
h2('Contents', color=BRAND)
toc_items = [
    '1.  UI — Core Concepts Missing',
    '2.  UI — Framework & Real-World',
    '3.  API — Missing Concepts',
    '4.  TypeScript & Framework Hygiene',
    '5.  CLI Commands / Flags You Missed',
    '6.  Frequently Asked in MNC Interviews',
    '7.  Suggested Practice Tasks',
]
bullets(toc_items)

add_page_break()

# ================= 1. UI CORE =================
h1('1. UI — Core Concepts Missing')

# 1.1
h2('1.1 Auto-waiting & Actionability Checks')
para('Before every action Playwright automatically waits for the element to satisfy these conditions:')
styled_table(
    ['Check', 'Meaning'],
    [
        ['Attached',        'Element is in the DOM'],
        ['Visible',         'Non-empty bounding box, not display:none / visibility:hidden'],
        ['Stable',          'Not animating (no transform change)'],
        ['Receives events', 'Not covered by another element'],
        ['Enabled',         'Not disabled'],
        ['Editable',        'For fill() / type() — not readonly'],
    ]
)
callout('tip', 'Best practice',
        'click(), fill(), check(), selectOption() auto-wait. page.$ and elementHandle DO NOT auto-wait — avoid them.')

# 1.2
h2('1.2 Advanced Locators (big gap)')
code("""// Chaining
page.locator('.card').locator('button');

// Filter — narrow by text or child
page.getByRole('row').filter({ hasText: 'John' })
                     .filter({ has: page.getByRole('button', { name: 'Edit' }) });

// Positional
page.locator('.item').first();
page.locator('.item').last();
page.locator('.item').nth(2);

// Collection
const rows = await page.locator('tr').all();          // Locator[]
const count = await page.locator('.item').count();

// AND / OR
btn.and(page.locator('[data-active=true]'));           // same element, both conditions
page.getByText('OK').or(page.getByText('Yes'));        // either appears

// Layout locators
page.locator('input:right-of(:text("Email"))');
page.locator('button:near(.title, 50)');""", lang='typescript')
callout('info', 'Shadow DOM',
        'Playwright pierces Shadow DOM automatically — no special API required.')

# 1.3
h2('1.3 Assertions You Missed')
code("""await expect(locator).toBeInViewport();
await expect(locator).toBeAttached();
await expect(response).toBeOK();                       // for APIResponse

// Custom timeout instance
const myExpect = expect.configure({ timeout: 30_000 });
await myExpect(locator).toBeVisible();

// Promise matchers
await expect(promise).rejects.toThrow('Not found');
await expect(promise).resolves.toBe(true);

// Custom matcher
expect.extend({
  toBeEven(n) { return { pass: n % 2 === 0, message: () => 'not even' }; }
});""", lang='typescript')

h3('Visual assertion extras')
code("""await expect(page).toHaveScreenshot('home.png', {
  animations: 'disabled',
  caret: 'hide',
  mask: [page.locator('.timestamp')],
  maxDiffPixelRatio: 0.02,
});""", lang='typescript')

# 1.4
h2('1.4 Browser Context / Emulation')
code("""const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  isMobile: false,
  hasTouch: false,
  locale: 'en-IN',
  timezoneId: 'Asia/Kolkata',
  geolocation: { latitude: 13.08, longitude: 80.27 },
  permissions: ['geolocation', 'notifications'],
  colorScheme: 'dark',
  offline: false,
  httpCredentials: { username: 'admin', password: 'admin' },
  proxy: { server: 'http://myproxy:8080' },
  userAgent: 'MyBot/1.0',
  storageState: 'auth/customer.json',
  recordVideo: { dir: 'videos/' },
  recordHar: { path: 'network.har' },
  ...devices['iPhone 13'],           // mobile emulation
});""", lang='typescript')

# 1.5
h2('1.5 Network Interception & Mocking')
callout('danger', 'CRITICAL topic',
        'Interception / mocking is asked in nearly every MNC interview and used constantly in real projects to stabilize UI tests.')
code("""// Mock full response
await page.route('**/api/users', route => route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({ users: [] }),
}));

// Modify request
await page.route('**/api/**', async route => {
  const headers = { ...route.request().headers(), 'x-trace': '1' };
  await route.continue({ headers });
});

// Block ads / analytics
await page.route(/googletagmanager|doubleclick/, r => r.abort());

// Remove route
await page.unroute('**/api/users');

// Replay recorded traffic (offline / stable tests)
await page.routeFromHAR('recorded.har', { update: false });

// Wait for a specific network call
const resp = await page.waitForResponse(r =>
  r.url().includes('/checkout') && r.status() === 200);
expect((await resp.json()).orderId).toBeDefined();

// Global listeners
page.on('request',       r => console.log('>>', r.method(), r.url()));
page.on('response',      r => console.log('<<', r.status(), r.url()));
page.on('requestfailed', r => console.log('X',  r.url(), r.failure()?.errorText));""",
     lang='typescript')

# 1.6
h2('1.6 Downloads')
code("""const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download Invoice' }).click(),
]);
console.log(download.suggestedFilename());
await download.saveAs(`./downloads/${download.suggestedFilename()}`);""",
     lang='typescript')

# 1.7
h2('1.7 Storage / Cookies / Init Scripts')
code("""await context.addCookies([{
  name: 'session', value: 'abc', domain: 'app.com', path: '/'
}]);
const cookies = await context.cookies();
await context.clearCookies();
await context.storageState({ path: 'auth/state.json' });

// Runs BEFORE any script on every page — inject tokens/flags
await context.addInitScript(() => localStorage.setItem('theme', 'dark'));

// Run JS in browser context
const title = await page.evaluate(() => document.title);

// Expose Node function to the page
await page.exposeFunction('nodeHash', s =>
  require('crypto').createHash('md5').update(s).digest('hex'));""",
     lang='typescript')

# 1.8
h2('1.8 Waits (Beyond auto-wait)')
code("""await page.waitForURL('**/dashboard');
await page.waitForLoadState('networkidle');   // load | domcontentloaded | networkidle
await page.waitForFunction(() => (window as any).appReady === true);
await locator.waitFor({ state: 'visible' });  // visible | attached | hidden | detached""",
     lang='typescript')
callout('warn', 'Avoid',
        'page.waitForTimeout(ms) is a hard sleep and causes flakiness. Use only as a last resort.')

# 1.9
h2('1.9 test.step — Structured Reporting')
code("""await test.step('Login as customer', async () => {
  await loginPage.login(user, pass);
});
await test.step('Add product to cart', async () => {
  await homePage.addToCart('Backpack');
});""", lang='typescript')
para('Steps appear as collapsible groups in HTML/Allure — expected in enterprise frameworks.', italic=True, color=MUTED)

# 1.10
h2('1.10 test.info() Runtime API')
code("""test('demo', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'issue', description: 'JIRA-123' });
  await testInfo.attach('page-screenshot', {
    body: await page.screenshot(), contentType: 'image/png',
  });
  console.log(testInfo.retry, testInfo.outputPath('log.txt'));
});""", lang='typescript')

# 1.11
h2('1.11 Advanced Config')
code("""// Serial group (shares state, stops on first fail)
test.describe.configure({ mode: 'serial', retries: 2, timeout: 90_000 });

// Multi-project matrix
projects: [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox',  use: devices['Desktop Firefox'] },
  { name: 'mobile',   use: devices['iPhone 13'] },
]

// globalSetup + globalTeardown functions
export default defineConfig({
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
});""", lang='typescript')
callout('info', 'Multi-role auth',
        'Store multiple storageState files (auth/customer.json, auth/merchant.json, auth/admin.json) and pick per project.')

add_page_break()

# ================= 2. UI FRAMEWORK / REAL WORLD =================
h1('2. UI — Framework & Real-World Missing')

h2('2.1 Debugging Toolkit')
code("""$env:PWDEBUG=1; npx playwright test           # opens Inspector
npx playwright test --debug                   # step-through debugger
npx playwright test --ui                      # UI Mode: watch, timeline, filters
npx playwright show-report                    # open last HTML report
npx playwright show-trace trace.zip           # open a trace
$env:DEBUG="pw:api"; npx playwright test      # protocol-level logs""",
     lang='powershell')
para('Insert await page.pause(); in your code to pause & open Inspector in headed mode.')
h3('Codegen with custom test-id attribute')
code('npx playwright codegen --test-id-attribute=data-qa https://site.com', lang='powershell')

h2('2.2 Component Object / Base Page Pattern')
bullets([
    'BasePage class → common: goto, waitForReady, screenshot, logger.',
    'Component objects (Header, Modal, Cart) composed inside pages.',
    'Path aliases in tsconfig.json.',
])
code("""// tsconfig.json
"paths": {
  "@pages/*":    ["src/ui/pages/*"],
  "@fixtures/*": ["src/fixtures/*"],
  "@utils/*":    ["src/utils/*"]
}""", lang='json')

h2('2.3 Data-Driven Beyond JSON / CSV')
code("""// Excel
import * as XLSX from 'xlsx';
const wb = XLSX.readFile('data.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Users']);

// YAML
import yaml from 'js-yaml';
const cfg = yaml.load(fs.readFileSync('cfg.yaml', 'utf8'));

// Faker
import { faker } from '@faker-js/faker';
const user = { email: faker.internet.email(), name: faker.person.fullName() };

// DB
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DB_URL });
const { rows: dbUser } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);""",
     lang='typescript')

h2('2.4 Reporting Extras')
code("""import { allure } from 'allure-playwright';
allure.severity('critical');
allure.owner('Nithish');
allure.issue('JIRA-123', 'https://jira/browse/JIRA-123');
allure.tms('TC-45');
allure.tag('smoke');""", lang='typescript')
bullets([
    'Slack / Teams webhook via custom reporter or GitHub Action step.',
    'Custom Reporter class implementing onBegin, onTestEnd, onEnd.',
])

h2('2.5 CI/CD & DevOps')
h3('GitHub Actions — sharded matrix')
code("""strategy:
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with: { node-version: 20, cache: npm }
  - run: npm ci
  - run: npx playwright install --with-deps
  - run: npx playwright test --shard=${{ matrix.shard }}
  - uses: actions/upload-artifact@v4
    if: always()
    with: { name: report-${{ matrix.shard }}, path: reports/ }""", lang='yaml')

h3('Docker')
code("""FROM mcr.microsoft.com/playwright:v1.47.0-jammy
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npx","playwright","test"]""", lang='dockerfile')

callout('warn', 'Secrets',
        'Use GitHub Secrets / Azure Key Vault / AWS Secrets Manager. Never commit .env files with real credentials.')

h2('2.6 Accessibility (a11y)')
code("""import AxeBuilder from '@axe-core/playwright';
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a','wcag2aa'])
  .analyze();
expect(results.violations).toEqual([]);""", lang='typescript')

h2('2.7 Performance / Lighthouse')
code("""import { playAudit } from 'playwright-lighthouse';
await playAudit({
  page,
  thresholds: { performance: 80, accessibility: 90 },
  port: 9222,
});

// Navigation timing
const nav = await page.evaluate(() =>
  JSON.stringify(performance.getEntriesByType('navigation')));""",
     lang='typescript')

h2('2.8 Visual Testing Enhancements')
bullets([
    "Options: animations:'disabled', caret:'hide', stylePath:'mask.css', clip:{...}.",
    'Baseline folders per OS/browser (Playwright does this automatically).',
    'Cloud tools: Percy, Applitools, Chromatic.',
])

h2('2.9 Special UI Elements')
styled_table(
    ['Element', 'Approach'],
    [
        ['Date picker', 'Prefer typing into input; fallback to clicking cells'],
        ['Slider',      "locator.evaluate(el => { el.value = 50; el.dispatchEvent(new Event('input')); })"],
        ['Canvas',      'Coordinate-based page.mouse.click(x, y)'],
        ['PDF',         'Download → parse with pdf-parse and assert text'],
        ['OTP email',   'Read via Mailinator API, MailSlurp, or IMAP'],
        ['TOTP / 2FA',  'authenticator.generate(secret) from otplib'],
        ['Captcha',     'Test-mode backdoor code, or 2captcha service'],
    ]
)

h2('2.10 Session Reuse UI ↔ API')
code("""// Get token via API, inject into localStorage before UI navigation
const token = await api.login(user, pass);
await context.addInitScript(t => localStorage.setItem('accessToken', t), token);
await page.goto('/dashboard');       // already authenticated""", lang='typescript')

add_page_break()

# ================= 3. API =================
h1('3. API — Missing Concepts')

h2('3.1 HTTP Methods You Missed')
code("""await request.patch('/users/1', { data: { name: 'X' } });   // partial update
await request.head('/status');                              // headers only
await request.fetch('/x', { method: 'OPTIONS' });           // CORS preflight""",
     lang='typescript')

h2('3.2 Authentication Types')
code("""// Bearer
extraHTTPHeaders: { Authorization: `Bearer ${token}` }

// OAuth2 client-credentials
const t = await request.post('https://auth/token', {
  form: { grant_type: 'client_credentials', client_id, client_secret }
});
const { access_token } = await t.json();

// API Key
extraHTTPHeaders: { 'x-api-key': process.env.API_KEY! }

// Basic
extraHTTPHeaders: {
  Authorization: 'Basic ' + Buffer.from('u:p').toString('base64')
}""", lang='typescript')
h3('Worker-scoped token fixture (login once per worker)')
code("""authToken: [async ({}, use) => {
  const t = await loginApi();
  await use(t);
}, { scope: 'worker' }]""", lang='typescript')

h2('3.3 Request Body Variants')
code("""// multipart / file upload
await request.post('/upload', {
  multipart: { file: fs.createReadStream('doc.pdf'), userId: '123' }
});

// urlencoded form
await request.post('/token', {
  form: { grant_type: 'password', username, password }
});

// Binary
await request.post('/raw', { data: Buffer.from([0x00, 0x01]) });

// GraphQL
await request.post('/graphql', {
  data: {
    query: `query($id:ID!){ user(id:$id){ email } }`,
    variables: { id: '1' }
  }
});""", lang='typescript')

h2('3.4 Schema Validation')
callout('danger', 'CRITICAL for API testing',
        'Interviewers ask this constantly. Every API response should be schema-validated so drift is caught early.')
code("""import { z } from 'zod';
const UserSchema = z.object({ id: z.number(), email: z.string().email() });
UserSchema.parse(await response.json());        // throws if invalid""",
     lang='typescript')
para('Alternatives: AJV (JSON Schema), Joi, openapi-response-validator (for Swagger/OpenAPI contracts).')

h2('3.5 Response Inspection')
code("""resp.status(); resp.statusText(); resp.ok(); resp.url();
resp.headers(); resp.headersArray();
await resp.body();           // Buffer
await resp.text();
await resp.json();
resp.dispose();              // free memory in large loops

// Timing
const t0 = Date.now();
const r = await request.get('/x');
expect(Date.now() - t0).toBeLessThan(2000);""", lang='typescript')

h2('3.6 Chained API Tests')
para('Real projects chain Auth → Create → Read → Update → Delete. Share IDs via fixtures. Prefer a fixture that yields the created resource and cleans it up in the after block.')

h2('3.7 API Mocking / Contract Testing')
bullets([
    'MSW — mocks for UI-facing calls.',
    'WireMock / Prism — external mock servers.',
    'Pact — consumer-driven contract testing.',
])

h2('3.8 Retry & Resilience')
code("""async function withRetry<T>(fn: () => Promise<T>, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 2 ** i * 500));
    }
  }
  throw new Error('unreachable');
}""", lang='typescript')
para('Per-request options: timeout, maxRedirects, ignoreHTTPSErrors.')

h2('3.9 GraphQL / WebSocket / SSE')
code("""// WebSocket
page.on('websocket', ws => {
  ws.on('framesent',    f => console.log('→', f.payload));
  ws.on('framereceived', f => console.log('←', f.payload));
});""", lang='typescript')

h2('3.10 File Download via API')
code("""const r = await request.get('/invoice/123/pdf');
fs.writeFileSync('invoice.pdf', await r.body());""", lang='typescript')

h2('3.11 API + DB Cross-Validation')
code("""await request.post('/orders', { data: order });
const { rows } = await db.query(
  'SELECT status FROM orders WHERE id=$1', [order.id]);
expect(rows[0].status).toBe('CREATED');""", lang='typescript')

h2('3.12 API Test Data Cleanup')
callout('warn', 'Always cleanup',
        'DELETE created entities in afterEach / afterAll. Shared QA environments get polluted otherwise.')

add_page_break()

# ================= 4. TS & HYGIENE =================
h1('4. TypeScript & Framework Hygiene')
bullets([
    'tsconfig strict mode + path aliases.',
    'ESLint + Prettier + Husky pre-commit hooks.',
    'Logger (winston / pino) instead of console.log.',
    'Custom error classes for meaningful failures.',
    'Secrets in Azure Key Vault / AWS Secrets Manager / HashiCorp Vault.',
    'Semantic versioning + CHANGELOG for the framework.',
    'Tag matrix: @smoke @regression @p1 @jira-XYZ @ui @api.',
    'Parallel-safe fixtures (worker-scoped tokens / DB pools).',
    'Distinguish RETRY (auto flakiness handling) vs FLAKE TRACKING (reporting unstable tests).',
])

# ================= 5. CLI =================
h1('5. CLI Commands / Flags You Missed')
code("""npx playwright test --shard=1/4                       # split across CI runners
npx playwright test --repeat-each=5 --workers=1       # flake hunting
npx playwright test --last-failed                     # rerun failed only
npx playwright test --only-changed=main               # tests affected by git diff
npx playwright test --grep-invert @flaky
npx playwright test --list                            # list tests without running
npx playwright test --max-failures=3
npx playwright test --ui                              # UI Mode
npx playwright test --trace on                        # force trace
npx playwright test --update-snapshots                # refresh visual baselines
npx playwright show-report
npx playwright show-trace trace.zip
npx playwright codegen --target=javascript --output=test.js https://site
npx playwright codegen --load-storage=auth.json https://site
npx playwright install --with-deps chromium
npx playwright install-deps
$env:PWDEBUG=1; npx playwright test                   # Inspector
$env:DEBUG="pw:api"; npx playwright test              # protocol logs""",
     lang='powershell')

add_page_break()

# ================= 6. INTERVIEW =================
h1('6. Frequently Asked in MNC Interviews')
styled_table(
    ['#', 'Question'],
    [
        ['1',  'Difference between Locator and ElementHandle'],
        ['2',  "List Playwright's actionability checks"],
        ['3',  'Explain BrowserContext isolation'],
        ['4',  '3 ways to share auth state (storageState / globalSetup / setup project)'],
        ['5',  'Worker-scoped vs test-scoped fixtures — when to use'],
        ['6',  'How to mock an API in UI tests (page.route)'],
        ['7',  'How to shard tests in CI (--shard)'],
        ['8',  'Handling flaky tests (retries, deterministic locators, --repeat-each)'],
        ['9',  'Debugging tools: Inspector, UI Mode, Trace Viewer, page.pause()'],
        ['10', 'Multi-role authentication strategy'],
        ['11', 'File upload / download handling'],
        ['12', 'Intercept & modify request / response'],
        ['13', 'test.step vs test.describe'],
        ['14', 'Soft assertion vs normal assertion'],
        ['15', 'Project dependencies vs globalSetup'],
        ['16', 'Running subsets in CI (tags, --grep, --project)'],
        ['17', 'Selenium → Playwright migration points'],
        ['18', 'Explain your framework architecture (POM + Fixtures + Data + Config + Utils + Reports + CI)'],
    ]
)

# ================= 7. PRACTICE =================
h1('7. Suggested Practice Tasks')
bullets([
    'Mock a REST endpoint with page.route and assert UI reflects it.',
    'Create a worker-scoped fixture that logs in via API once and reuses the token.',
    'Create multi-role storageState files and switch via Playwright projects.',
    'Add @axe-core/playwright a11y checks to one page.',
    'Shard your suite in GitHub Actions across 3 runners.',
    'HAR record + replay to simulate offline / slow APIs.',
    "Visual regression with mask + animations:'disabled'.",
    'Zod schema validation on a real API response.',
])

# Closing callout
callout('tip', 'Focus first on the highest-ROI items',
        'Network mocking (1.5), Config & sharding (1.11), CI/CD (2.5), Auth (3.2), Schema validation (3.4). '
        'These are the most-asked interview + on-the-job topics.')

output = r'c:\Users\NithishkumarPandian\pw-workspace\shoppersstack-automation\Playwright_Missing_Notes_MNC_Full.docx'
doc.save(output)
print(f'Saved: {output}')
