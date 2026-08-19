# vendor/

Third-party code, committed deliberately.

## `tailwind-browser-4.3.3.js`

The Tailwind CSS v4 browser build — the compiler that turns the utility classes
in every demo into real CSS at page load. Published as
[`@tailwindcss/browser`](https://www.npmjs.com/package/@tailwindcss/browser).

It is vendored rather than loaded from a CDN because this repo's demos are
reference material. A floating `@4` tag means the same commit renders
differently depending on when you open it, and a regression in the compiler
would break every kitchen sink and wireframe here with nothing in the git
history to point at. Vendoring makes the rendering a property of the commit.

The version is in the filename so that an upgrade is a visible, reviewable diff
across every page rather than something that happens silently. `check.mjs`
fails if the pages disagree about which build they load.

### Provenance

| | |
|---|---|
| Version | 4.3.3 |
| Source | `npm pack @tailwindcss/browser@4.3.3` → `package/dist/index.global.js` |
| sha1 (tarball) | `7ede3e3142e291018b5dde6d3bce930f7b54f587` |
| sha512 (tarball) | `sha512-fFaqX18SiyiukLoEI7/cVc0B65mkTslDNo2TxazSDZ9rKs5umOEoujmEkpy8z6GrMdoVzBDbWD8j5DTKLyAWWw==` |

Both digests match `npm view @tailwindcss/browser@4.3.3 dist.shasum dist.integrity`.
The build also states its own version internally, as `var pr="4.3.3"` near the
start of the file.

### Updating

```sh
npm pack @tailwindcss/browser@<version>
npm view @tailwindcss/browser@<version> dist.shasum dist.integrity   # compare
tar xzf tailwindcss-browser-<version>.tgz
cp package/dist/index.global.js vendor/tailwind-browser-<version>.js
git rm vendor/tailwind-browser-<old>.js
```

Then repoint every page and update the table above:

```sh
grep -rl 'tailwind-browser-<old>.js' --include=index.html . \
  | xargs sed -i 's/tailwind-browser-<old>.js/tailwind-browser-<version>.js/g'
node scripts/check.mjs
```

Re-open a kitchen sink and a wireframe afterwards. The compiler is the one
dependency that can change how every page in the repo looks.

---

## Webfonts — vendored into each `theme.css`

Kitchen sinks used to pull their typefaces from `fonts.googleapis.com` with a
`<link>`. That carried the same problem this file already describes for a
floating CDN build of Tailwind — the same commit renders differently depending
on when you open it — plus one the compiler does not have: a design whose
typeface arrives over the network is a design that silently degrades to the
system sans on any device that cannot reach Google. The laptop that has already
cached the font looks correct while the phone does not, which makes it a
frustrating thing to notice and an easy thing to misread as a caching bug.

The fonts now live inside each design's `theme.css` as base64 `woff2`, generated
by `scripts/vendor-fonts.mjs`. They are not separate files in this directory
because `theme.css` is the only local file a kitchen sink may load (see
`CLAUDE.md`) and because it is written to be pasted verbatim into a consuming
project — a relative `url()` would break both properties at once.

| Design | Families | Licence |
|---|---|---|
| `slate` | Inter, JetBrains Mono | SIL OFL 1.1 |
| `warm-paper` | Crimson Pro, Inter, JetBrains Mono | SIL OFL 1.1 |
| `material-design` | Roboto, Roboto Mono | Apache 2.0 |
| `playful` | DM Sans, Fredoka | SIL OFL 1.1 |
| `learn` | *none — see below* | |

Each is requested as a variable axis (`wght@400..700`) rather than as separate
static weights, so one file per family covers the whole range and is smaller
than the statics it replaces. Subsets are `latin` and `latin-ext` only: Google's
`<link>` offered every subset and let the browser fetch what the page touched,
whereas vendoring forces the choice up front. Adding a subset roughly doubles
the block it lands in.

The cost is size — these `theme.css` files run 125–352KB rather than ~10KB. A
consuming project that would rather serve the files itself can delete the
`@font-face` block; the tokens below it only name the families.

`learn` is the exception. Its stack is Duolingo Sans, Arial Rounded MT Bold and
Trebuchet MS — all proprietary, none redistributable — so there is nothing to
vendor, and its `@font-face` is `local()`-only by necessity. `designs/learn/DESIGN.md`
records what that costs a phone and what to substitute.

### Updating

```sh
node scripts/vendor-fonts.mjs                # every design
node scripts/vendor-fonts.mjs playful        # just one
node scripts/check.mjs
```

The generated block is delimited by `/* === vendored fonts: begin … */` and
`/* === vendored fonts: end === */` and is replaced wholesale, so re-running is
idempotent and an upgrade is a reviewable diff. Re-open a kitchen sink
afterwards with the network throttled or offline — that is the case this exists
for.
