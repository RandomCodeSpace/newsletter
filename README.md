# The AI Ledger

An evidence-first, JSON-powered AI newsletter. Responsive, accessible static HTML/CSS/JavaScript; no framework, dependencies, API keys, trackers, or build service required.

## Update content, not the UI

Edit **`data/newsletter.json`**. Its issue metadata and all article content are fetched at runtime. The sections are `news`, `rumors`, and `predictions`. Each story has a stable `id`, `title`, `summary`, `whyItMatters`, `confidence` (`high`/`medium`/`low`), `confidenceReason`, `historicalContext`, and a nonempty `sources` array. Sources include title, HTTPS URL, publisher, publication date (`YYYY-MM-DD`), type (`primary`/`reporting`/`analysis`), and `authenticityReason`. Predictions additionally require `horizon`, `resolutionCriteria`, and `counterarguments`.

The optional `charts` array lives in the same JSON. `timeline` charts use sourced dated points; `bar` charts use numeric values with an explicit zero-based domain and unit, source, publication date, selection criteria, and caveats. Never invent numbers or convert confidence labels into probabilities.

Use the existing JSON as the authoring example. Add or remove stories without editing HTML. An empty rumors section is intentional when nothing meets the evidence threshold. Confidence is an editorial assessment, not a calibrated probability. Date each issue honestly; do not redate old news as a new release. Source authenticity does not establish factual correctness or independence.

## Local preview

```sh
python3 -m http.server 4173
# Open http://localhost:4173
```

Use HTTP, not `file://`, because the UI fetches JSON. Node 20+ is needed only for validation/tests/build:

```sh
npm run validate
npm test
npm run build
# Optional: serve dist/ instead of the repository root
```

Browser checks should cover desktop/mobile, all category filters, search/no-results, expandable evidence, and fetch-error handling. JSON is inserted as text, never as HTML; source URLs must use HTTPS.

## GitHub Pages

This site works under `/newsletter/` because all asset paths are relative. In repository Settings → Pages, select **Deploy from a branch**, **main**, **/ (root)**. `.nojekyll` disables Jekyll. No Actions workflow or package installation is necessary. The expected URL is `https://randomcodespace.github.io/newsletter/`, but it is live only after Pages is enabled and deployment succeeds.

This is an on-demand content template, not an automatic news crawler. Future updates should change the JSON and pass validation before publication. Do not include private messages, credentials, or personal information in this public repository.

## Weekly editions and preserved history

`issueStart` / `issueEnd` define the reporting week; `forecastStart` / `forecastEnd` define the following week. Predictions must use that explicit future horizon. Keep older rumors clearly marked as carry-over rather than fresh news.

Before replacing the latest issue, run `npm run archive`. This writes an immutable-by-default `data/archive/YYYY-MM-DD.json` snapshot and adds it to `data/issues.json`. Existing snapshots are never silently overwritten. Commit both files, then update `data/newsletter.json` for the next week. The edition picker loads archived JSON with the same UI. Do not manufacture earlier issues. To correct a published snapshot, review and explicitly edit it, preserving an editorial correction note.
