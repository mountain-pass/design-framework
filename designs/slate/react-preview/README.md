# slate — live React preview

This folder renders the **actual** `../components/ui/*.tsx` so you can see and click the
real components (open the select, toggle the switch, open the menu) rather than the
static kitchen sink.

Unlike the kitchen sink (`../index.html`, static HTML that opens with no build), this
page is **compiled**: `scripts/build-preview.mjs` bundles `app.tsx` and the design's
components (with React + Radix) into `app.bundle.js`. The page then loads that bundle
plus the design's own `theme.css` and the vendored Tailwind compiler — so it is
self-contained: it opens on any static host, online or offline, with no CDN and no
runtime transform.

## Why compiled, not transformed-in-the-browser

An earlier version fetched each `.tsx` and transformed it in the browser. That broke on
hosts that don't serve `.ts`/`.tsx` as static files (they return a 404 page, which then
fails to parse). Compiling ahead of time removes that dependency entirely — and, more
importantly, **surfaces build errors at build time**: if a generated component doesn't
compile, `build-preview.mjs` fails.

## Building

Requires `npm install` once at the repo root, then:

```sh
npm run build:preview        # writes designs/slate/react-preview/app.bundle.js
# or, to compile without writing (a CI gate that a component still builds):
npm run verify
```

Rebuild after changing a component (regenerate the component first with
`npm run build:components`, then `npm run build:preview`).

## Running it

Serve the repo over http(s) and open this folder:

```sh
python3 -m http.server 8000      # from the repo root
# then visit http://localhost:8000/designs/slate/react-preview/
```

Opening from `file://` won't work — the `theme.css` fetch is blocked cross-origin.

## What it proves

The components you'd copy into a real project are exactly these files, they **compile**,
and they render from the design's own `theme.css`. Their class strings are generated
from `../classes.json` (`scripts/build-components.mjs`), which `check.mjs` validates
against the kitchen sink — so what you see here is what a consuming app gets.
