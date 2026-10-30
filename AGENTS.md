# Take One POS Web — Agent Guidelines

## Overview
Point of Sale SPA. React 19 + TypeScript (strict) + Vite 8 + MUI v9 + React Router v7 + Day.js.
All data comes from an external REST API via `fetchWithAuth`; there is no local state store.

## Commands
| Purpose | Command |
|---|---|
| Dev server | `npm run dev` |
| Typecheck / build | `npm run build` (`tsc && vite build`) |
| Typecheck only | `npx tsc --noEmit` |
| Preview build | `npm run preview` |

`tsconfig` has `noUnusedLocals` and `noUnusedParameters` — dead variables fail the build.

## Environment
- `VITE_API_URL` — API base URL, default `''` (relative). Read in `src/constants/Url.ts`.
- `VITE_BASE_PATH` — app base path, default `/`. Used by `vite.config.ts` (`base`), `BrowserRouter basename`, and `import.meta.env.BASE_URL` for public assets.

## Directory Structure
- `src/constants` — `Type.ts` (API interfaces + `Column`/`ColumnOption`), `Url.ts` (endpoints), `RoutePath.ts`, `ColumnType.ts`
- `src/commons` — shared components (`src/common` and `src/util` in older docs do not exist; use `src/commons` and `src/utils`)
- `src/hooks` — custom hooks (`useDebounce`)
- `src/utils` — `fetchWithAuth`, `formatToCurrency`
- `src/table-columns` — one column definition per table
- `src/pages/<feature>/` — `XPage` (list), `XFormPage` (create), `XDetailPage`, `XEditPage`
- `src/pages/UserPage.tsx`, `UserDetailPage.tsx` sit at the pages root (no folder)
- `src/App.tsx` — all routes; `src/commons/Layout.tsx` + `Sidebar.tsx` shell

## Conventions
- Function components, no classes. `export default` at file end.
- `function Name(): JSX.Element`-style arrow-free components; explicit prop interfaces per component.
- Handlers named `handle<Action>` (`handleSubmit`, `handleDelete`, `handleChange`).
- Booleans as `is<Thing>` / `show<Thing>`; state setters paired.
- No comments anywhere, in code or JSX.
- Prettier config: single quotes, semicolons, 2-space, trailing commas, 100 cols.

## API Layer
- Always use `fetchWithAuth` (adds `Bearer` token; 401 clears storage and redirects to login).
- Endpoints are composed from `BASE_API_URL` in `src/constants/Url.ts`; add new ones there as `API_<ENTITY>`.
- List responses are `{ code, message, <key>: [...], pagination: { page, limit, total, totalPages } }`. The collection key varies (`items`, `sales`, `salesItem`, `categories`, `paymentChannels`, `salesPayments`, `images`, `auditTrails`) — pass it as `responseKey` to `TableData`.
- Detail responses are wrapped (`data.item`, `data.sales`, `data.stockPurchase`, `data.category`, `data.paymentChannel`); unwrap with a fallback (`data.category ?? data`) and redirect to the list on 404.
- Any PUT must send the loaded `rowversion`.
- Errors surface through `DialogModal` (`errorModal` state); success through a second `DialogModal` (`successModal`).
- Dates are sent as ISO strings (`dayjs.toISOString()`), rendered in tables as `DD/MM/YYYY`.

## TableData (core list component)
Props: `url`, `columns`, `dataKey`, `responseKey`, plus optional `onDetail`, `onEdit`, `onDelete`, `onChecklist`, `auditTrailUrl`, `disabled`, `refreshKey`.
- Server-driven: sends `?page=N&limit=10` (constant `PAGE_SIZE`) and `&searchParam=` (debounced 500ms, resets page to 1). Renders MUI `Pagination` from `pagination.totalPages`.
- `refreshKey` is a counter — bump it (`setRefreshKey((prev) => prev + 1)`) to refetch after mutations.
- `disabled` overlays a spinner.
- Column types (`src/constants/ColumnType.ts`): `TEXT`, `CURRENCY`, `DATE`, `IMAGE`, `CHECKLIST`, `ACTION`.
- `Column`: `columName` (camelCase API key, snake_case tolerated), `label`, `columnType`, `alignment` (`'Left' | 'Right' | 'Center'`), `flex` (width weight), `parentKey` (read from nested object, e.g. `category`), `option`.
- `option` is either a static object or a function receiving the row, used to conditionally show action buttons:
  ```ts
  option: (sale) => ({ detail: true, edit: sale.status === 'CREATED', delete: false })
  ```
  Use the function form when the row itself carries `status`; use a parameterized factory (`getXItemColumns(status)`) when only the parent record carries it.
- When `auditTrailUrl` is provided, an Audit Trail icon appears in the action cell and opens `AuditTrailTable` in a dialog.
- Action cell order: detail, edit, delete, audit trail.

## Detail Page Pattern (Sales / Stock Purchase / Item)
- Header fields rendered above the tabs, then MUI `Tabs`.
- Tabs: Sales = Items, Payment, Audit Trail; Stock Purchase = Items, Audit Trail; Item = Price History, Images, Audit Trail.
- Each tab body is `{tabValue === n && (...)}`.
- Inline sub-detail views inside a tab use a `Back to List` button rather than a route.
- Sub-item tables get `url=.../<entity>/${id}/...` and a dedicated column file (often a factory keyed on the parent `status`).
- Status gating: when `status !== 'CREATED'`, hide New Item and disable edit/delete — both the button and the column options must be gated.
- Audit trail endpoint: `<resource>/${id}/audit-trail` (Resource casing differs per entity: `/items`, `/sales`, `/category`, `/stock-purchase`, `/payment-channel`, `/user`).
- Operations come from `<resource>/${id}/operation` (`operations[]` with `operationName` / `operationDisplayName`); clicking opens a confirmation dialog. Special operations collect `additionalInformation`:
  - `pay` → `referenceNo`, `paymentDate`, `paymentChannel`, `paymentChannelId`, `accountNumber`, `accountHolderName`
  - `deliver` → `deliveryDate`
- POST `<resource>/${id}/operation` with `{ rowversion, operationName, additionalInformation? }`.

## Form / Edit Page Pattern
- `Title` → padded `Box` → inputs stacked with `sx={{ mb: 2 }}` → green `Save` button.
- Create uses `loading` + absolute overlay `CircularProgress`; edit uses `loading` (skeleton or spinner) and `submitting` for the overlay, both disabling inputs.
- On success navigate to the detail page (create may navigate to the list or to the new detail).
- Option lists (categories, items, payment channels) load with `fetchWithAuth` in a `useEffect`, `responseKey ?? data` fallback, and are rendered with `Autocomplete`.

## Shared Components
- `DatePickerField` — wraps MUI X `DatePicker`: opens on field click, closes on outside click/Esc/selection. Always use it instead of raw `DatePicker`; pass `format="DD/MM/YYYY"`.
- `AuditTrailTable` — takes `url`, expects `auditTrails`.
- `DialogModal` — `open`/`onClose`/`title`/`message`.
- `ImagePreview` — thumbnail that opens a `Dialog`.
- `TimeInformation` — Created At / Updated At block; append at the end of detail pages.
- `TableRow*` — per-type cells used by `TableData`.
- `Title` — page heading bar.

## Styling
- Use CSS variables from `src/index.css`: `--color-primary`, `--color-primary-hover`, `--color-secondary`, `--color-neutral-muted`, `--color-bg-warm`, `--color-white`, `--font-heading`, `--font-body`.
- Prefer MUI `sx`; no separate CSS modules. `theme.ts` only sets the Inter font family.
- Primary buttons use `variant="contained"` with `bgcolor: 'green'` for create/save actions; operations use the brand primary.
- Labels use `Typography variant="caption"` in `grey.500`; values `variant="body1"`.
- Pages fill available height: `display: flex`, `flexDirection: 'column'`, `height: '100%'`.

## Adding a New Menu (checklist)
1. Interface in `src/constants/Type.ts` and endpoint in `src/constants/Url.ts`.
2. Routes in `src/constants/RoutePath.ts` (`X`, `X_NEW`, `X_DETAIL(id)`, `X_EDIT(id)`) and in `src/App.tsx` (inside the `Layout` route).
3. Column file in `src/table-columns/XColumns.tsx`.
4. Four pages under `src/pages/<folder>/`.
5. Entry in `menuSections` in `src/commons/Sidebar.tsx` under the right section (sections currently: Master, Inventory, Sales, Administration).

## Rules
- **DO** keep changes minimal and mirror the existing feature you are copying.
- **DO** name functions, parameters and variables fully and meaningfully — no abbreviations.
- **DO** keep pages responsive and PWA-friendly.
- **DO** run `npx tsc --noEmit` after changes; it must pass clean.
- **DON'T** write comments.
- **DON'T** add new dependencies for what MUI, the standard library, or an existing util already covers.
- **DON'T** introduce state libraries, CSS frameworks, or abstraction layers that do not already exist here.
