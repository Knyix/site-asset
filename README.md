# baronfear

Static site hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/)
using [Static Assets](https://developers.cloudflare.com/workers/static-assets/),
deployed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

It's an assets-only Worker (no server code): a single static page served from
`public/` (the page lives at `public/index.html`, so it loads at the site root `/`).

## Project layout

```
public/          # static assets served by the Worker (the site itself)
  index.html
wrangler.toml    # Worker config (name + [assets] directory)
package.json     # wrangler dev dependency + scripts
```

## Local preview

```sh
npm install
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
