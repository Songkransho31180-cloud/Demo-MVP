# EdgeLog V2 — Trading Journal

Static trading journal dashboard built with HTML, CSS and vanilla JavaScript. Works on GitHub Pages with no build step.

## V2 features
- Portfolio starting balance + live Balance / Net P&L / Win Rate / Max Drawdown
- New Trade: Entry, SL, TP, Exit, Lot, Risk %, R, P&L, Session, Setup, Tags
- Trade History with search, filters, view, edit and delete
- Dynamic equity curve, performance calendar, setup/session/direction analytics
- Before/After screenshot upload (compressed and stored locally on the device)
- Daily trading journal
- JSON backup export/import
- Mobile responsive + dark/light mode
- Keeps compatibility with V1 `edgelogTrades` localStorage data

## Deploy with GitHub Pages
Upload these files to the repository root:
- `index.html`
- `styles.css`
- `app.js`
- `.nojekyll`

Then open **Settings → Pages → Deploy from a branch → main → /(root)**.

## Update from V1 on mobile
In your existing repository, replace `index.html`, `styles.css`, `app.js` with the V2 files. Keep `.nojekyll` and README if you want. Your browser's existing trade data will remain because V2 uses the same `edgelogTrades` key.

> Data is local to each browser/device. Export a JSON backup regularly if the data matters to you.
