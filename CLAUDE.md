# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory reading order before any work

The project enforces a documentation-first workflow. Read these in order, fully:

1. [RULES.md](RULES.md) — consolidated hard rules (code, CSS, Git, confirmation workflow)
2. [CONTEXT.md](CONTEXT.md) — project overview and current status
3. [system_design.md](system_design.md) — BA doc: roles, business flows, design system
4. [.agents/skills/gia-lai-dashboard/SKILL.md](.agents/skills/gia-lai-dashboard/SKILL.md) — accumulated project rules
5. `pages/<page>/SPECS.md` for the page being worked on
6. Reference [pages/dashboard](pages/dashboard) as the finished sample screen

If these documents conflict, stop and ask the user to decide — do not pick one yourself.

## Confirmation workflow (RULES.md §2)

Before **any** file/state-changing action (create, edit, rename, move, delete, formatters, dependency changes, all Git write operations): present the goal, the plan, the files affected, and the risks; then ask and wait for explicit approval (`OK`, `làm đi`, `đồng ý`, …). A task description is not itself approval. If scope must change materially, stop and re-confirm.

Read-only operations need no confirmation, but still require the reading order above.

Additional standing rules from the skill files:
- Only modify existing files; do not create new files unless asked.
- Do only what was directly requested — no extra features, UI, or logic.
- When editing a feature, update every related file in sync (HTML + CSS + JS + that page's `SPECS.md`).
- Reply concisely, in Vietnamese, results only (`.agents/AGENTS.md`, scoped to `pages/Quản trị/`).
- `Save = Populate`: after saving data, verify the UI actually renders it.

## Git

- Never push to `main`. Push only to the working branch; merging to `main` is the user's job via PR.
- Confirm before pull/push/commit/merge/rebase/branch operations; after any Git operation, report branch, commit, sync state, and conflicts.
- After a `pull`, check whether `CONTEXT.md`, `system_design.md`, or the skill files changed. If they did, propose a `RULES.md` update and wait for confirmation — do not write `RULES.md` automatically.

## Build / run

No package manager, build step, linter, or test suite exists. This is a static HTML/CSS/vanilla-JS prototype with no backend.

Regenerate the home router's page list after adding or renaming a folder in `pages/`:

```bash
node tools/generate-routes.js
```

That script scans `pages/*` (skipping `home`), picks each folder's root HTML (`index.html` → `admin.html` → first `*.html`), and overwrites `shared/js/routes.js` — which is auto-generated and must not be hand-edited.

Serving: any static file server rooted at the repo. `nginx/gialai.conf` is the deploy config (`/` → 302 → `/pages/home/`, `try_files` only — deliberately no SPA fallback); see [nginx/README.md](nginx/README.md).

## Architecture

Multi-page app with real navigation (no SPA framework, no bundler). Entry `index.html` redirects to `pages/home/`, which renders a left navbar from `window.GIALAI_ROUTES` and loads the selected page into an `<iframe>`.

### Two independent design systems

This is the most important structural fact:

| | Dashboard | Admin / IAM |
|---|---|---|
| Look | pink/magenta | blue |
| Tokens & base | `shared/css/tokens.css`, `shared/css/base.css` | `pages/Quản trị/shared/admin-base.css` (own `:root`) |
| Pages | `pages/dashboard` | `pages/Quản trị/*`, `pages/IAM` |

Admin/IAM pages must **not** import the dashboard's `tokens.css`/`base.css`. Note `tokens.css` also declares `--admin-*` variables, but admin pages get theirs from `admin-base.css` — when changing an admin token, edit `admin-base.css`.

### Page layout convention

Every page is a self-contained folder:

```
pages/<page>/
├── index.html | admin.html   # structure only — no inline <style>/<script>
├── style.css
├── SPECS.md
└── js/{state,ui,charts,map}.js
```

Dashboard JS load order is significant: `state.js` → `ui.js` → `charts.js` → `map.js` (`ui.js` reads globals defined by `state.js`; `charts.js` and `map.js` are independent).

### Admin shell

`pages/Quản trị/shared/admin-shared.js` is the single source of truth for the admin sidebar: `ADMIN_SIDEBAR_HTML` is injected into `.app` by `loadSharedLayout(activeNavId, pageTitle)`, called at the end of each admin module's `<body>`. It also provides `showNotice()` and `showCustomConfirm()`, and persists sidebar collapse state. Admin module HTML files therefore contain no sidebar markup. `pages/Quản trị/admin.html` redirects to `quy-trinh-dong/index.html`.

### Data layer

No API. Mock data lives in JS and state persists to `localStorage`:

| Key | Owner |
|---|---|
| `gialai_directives` | `pages/dashboard/js/state.js` (`STORAGE_KEY`) |
| `gialai_directives_version` | same — compared against `DATA_VERSION`; a mismatch wipes and re-seeds mock directives |
| `gialai_directives_creators` | `pages/Quản trị/quy-trinh-dong/js/ui.js` |
| `gialai_processes` | `pages/Quản trị/xu-ly-chi-dao/js/data.js` |
| `gialai_admin_sidebar_collapsed`, `gialai_home_sidebar_collapsed` | sidebar UI state |

Bumping `DATA_VERSION` in `state.js` is the intentional mechanism for invalidating stored prototype data.

Vendored via CDN in HTML `<head>`: Chart.js 4.5.0, Flatpickr, Font Awesome 6.5.1, Google Fonts Roboto; Leaflet 1.9.4 on the IAM page.

The Gia Lai ward GeoJSON is inlined as the `geo` const in `pages/dashboard/js/map.js`, which renders the choropleth as SVG. The root `gia_lai_wards.json` is not loaded by any page.

`ioc/` is a nested Git repository recorded as a gitlink — an older copy of this project. Do not edit it.

## Business domain — directives (chỉ đạo)

Data source: C06 (Cục Cảnh sát QLHC về TTXH). Roles: **Lãnh đạo** (leadership) creates directives, **Chuyên viên** (specialist) processes them.

- A directive attaches to a `.metric-block` (a KPI card), identified by `metricId` — never to a data row or a chart point.
- Creation flow: Drawer / Event Panel → pick metric → enter content → set deadline → save.
- Processing: Admin Panel overlay, opened from a button in the Drawer.
- Statuses: `Chưa xử lý` → `Đang xử lý` → `Đã hoàn thành`; badges use `fa-flag` (orange/blue) or `fa-flag-checkered` (green).
- `--status-pending-*`, `--status-processing-*`, `--status-completed-*` tokens carry the status colors.

## Code rules

- No hardcoded color, font-size, or spacing — always tokens.
- Font sizes only via `--fs-2xs`…`--fs-4xl`; font via `--font-family`.
- Dashboard color roles: `--pink` (card border, primary button, header gradient), `--magenta` (emphasis/key figures), `--blue` (male figures), `--salmon` (female figures), `--text-dark`/`--text-muted`.
- Spacing: card padding max `10px` or `5px 10px`; no self-added `margin-top`/`margin-bottom` over `10px`; gaps `6px` / `10px` / `14px`.
- To change appearance, **edit the original selector** — never stack override rules. One selector, one responsible rule; no near-duplicate selectors that override each other.
- Flex layouts use ratios (`flex: 2` / `flex: 1`), not hardcoded widths. Avoid `align-self: flex-end` and `margin-bottom` in flex layouts without a clear reason.
- Dashboard stage is `1920 × 929px`; cards are `position: absolute` via `.abs`. Do **not** add `position: relative` to `.metric-block` — it breaks the layout. Header `85px` fixed top, tabbar `49px` fixed bottom.
- `input[type=number]` must always hide spin arrows in CSS.
- Datepickers: Flatpickr only.
- Never branch `if/else` across multiple sources for one field — name the single data source.
- Keep spacing, typography, and color consistent across screens; DRY — shared logic in `shared/js/`, shared CSS in `shared/css/`.
