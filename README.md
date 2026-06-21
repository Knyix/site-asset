# baronfear

Static site hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/)
using [Static Assets](https://developers.cloudflare.com/workers/static-assets/),
deployed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

It's an assets-only Worker (no server code): a single static page served from
`public/` (the page lives at `public/index.html`, so it loads at the site root `/`).

## Project layout

```
src/             # readable master — EDIT HERE
  index.html
public/           # build output served by the Worker — GENERATED, do not hand-edit
  index.html      # comment-stripped + obfuscated build of src/index.html
  _headers
build.mjs        # build: strips comments, obfuscates inline JS, minifies
wrangler.toml    # Worker config (name + [assets] directory)
package.json     # scripts + dev dependencies
```

## The build

`src/index.html` is the readable source. `npm run build` runs `build.mjs`, which
strips every comment (HTML/CSS/JS), obfuscates the inline JavaScript
(`javascript-obfuscator`) and minifies the document (`html-minifier-terser`),
writing the opaque result to `public/index.html`. The served page intentionally
reveals nothing about the countdown logic.

> **Always run `npm run build` after editing `src/index.html` and commit the
> regenerated `public/index.html`** — the Worker serves `public/` verbatim, and
> `npm run deploy` rebuilds first (`predeploy`).

## Local preview

```sh
npm install
npm run build      # regenerate public/index.html from src/
npm run dev        # runs `wrangler dev` → http://localhost:8787
```

## Deploy

First authenticate with Cloudflare (one-time):

```sh
npx wrangler login            # interactive OAuth
# — or set a token in CI / non-interactive environments —
export CLOUDFLARE_API_TOKEN=...
```

Then deploy:

```sh
npm run deploy     # runs `wrangler deploy`
```

Wrangler creates a Worker named **`baronfear`** (from `name` in `wrangler.toml`),
uploads the `public/` directory, and returns a `https://baronfear.<your-subdomain>.workers.dev`
URL. The name and assets directory are read from `wrangler.toml`, so no extra flags
are needed.

> If you deploy via Cloudflare's Git integration (Workers Builds), set the deploy
> command to `npx wrangler deploy` — it picks up everything from `wrangler.toml`.
