# baronfear

Static site hosted on [Cloudflare Pages](https://developers.cloudflare.com/pages/)
and deployed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

The site is a single static page served from `public/` (the page lives at
`public/index.html`, so it loads at the site root `/`).

## Project layout

```
public/          # deployed static assets (the site itself)
  index.html
wrangler.toml    # Cloudflare Pages config (project name + output dir)
package.json     # wrangler dev dependency + scripts
```

## Local preview

```sh
npm install
npm run dev        # runs `wrangler pages dev public` → http://localhost:8788
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
npm run deploy     # runs `wrangler pages deploy`
```

On the first deploy Wrangler creates a Pages project named **`baronfear`**
(from `name` in `wrangler.toml`) and returns a `https://baronfear.pages.dev` URL.
The project name and output directory (`public`) are read from `wrangler.toml`,
so no extra flags are needed.
