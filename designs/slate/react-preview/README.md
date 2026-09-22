# slate — live React preview

This folder renders the **actual** `../components/ui/*.tsx` in a browser, so you can
see and click the real components (open the select, toggle the switch, open the menu)
rather than the static kitchen sink.

It is **not** one of the repo's no-build demos. `../index.html` (the kitchen sink) is
still the canonical, offline, no-network demo — it renders the same classes as static
HTML. This preview is a convenience that trades that guarantee for interactivity:

- **It needs a network connection.** React, ReactDOM and the Radix packages load from
  the [esm.sh](https://esm.sh) CDN; Babel loads from cdnjs.
- **It runs a transform at page load.** `index.html` fetches each `.tsx`, transforms
  the TypeScript + JSX with Babel in the browser, and wires everything together with a
  dynamic import map. There is no bundler and nothing to install, but there *is* a
  runtime compile.
- **Modern browser required** (dynamic import maps).

Because of those dependencies it is kept out of `check.mjs`'s demo rules and out of the
"demos must open with no build step" contract on purpose.

## Running it

Serve the repo over http(s) — same as the kitchen sink — and open this file:

```sh
# from the repo root
python3 -m http.server 8000
# then visit http://localhost:8000/designs/slate/react-preview/
```

Opening it from `file://` will not work (the `.tsx` and `theme.css` fetches are blocked
cross-origin).

## What it proves

The components you'd copy into a real project are exactly these files, and they render
from the design's own `theme.css`. The class strings in them are generated from
`../classes.json` (see `scripts/build-components.mjs`), which `check.mjs` validates
against the kitchen sink — so what you see here is what a consuming app gets.
