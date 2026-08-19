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
