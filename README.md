# Leads Ascend

A lightweight static marketing website for a lead-generation service. Warm ivory and orange; a clear guarantee (**appointments booked, or you don't pay**); an animated lead → instant-reply → booked simulation; an interactive ROI calculator with animated results; a GoHighLevel booking section; mobile-friendly layouts; and motion that respects reduced-motion preferences.

No frameworks ship to visitors. No external fonts, analytics, tracking, or animation libraries. The whole site is three small files plus a logo.

## Preview locally

The site needs no build step. Open `dist/index.html` in a browser, or use the optional Vite dev server (Node 22.12+):

```sh
npm ci
npm run dev
```

Open the local URL Vite prints (usually http://localhost:5173/). Run `npm run check` to validate navigation targets, local assets, script syntax, duplicate IDs and the static file-size budget. Vite is a dev dependency only; it is not shipped to visitors.

## Files to edit

- `dist/index.html` — text, navigation, the guarantee, sections and the booking area
- `dist/style.css` — colour palette, responsive layouts and animation
- `dist/app.js` — mobile nav, scroll reveals, the ROI calculator and the hero simulation
- `dist/assets/mark.svg` — vector logo and favicon
- `dist/CNAME` — the custom domain (`leadsascend.com`); leave as-is unless the domain changes

All content stays visible with JavaScript disabled. Animation uses opacity/transform and small IntersectionObservers; there are no scroll listeners.

## Connect the booking calendar (GoHighLevel)

The booking area (`#book` in `dist/index.html`) shows a placeholder until you paste your GoHighLevel (GHL) calendar embed:

1. In **GHL**, go to **Calendars**, open your calendar, and from the **"..." menu** choose **Embed Code** (or, from a Sites/Funnels calendar element, **Copy embed code**).
2. GHL gives you an `<iframe …>` plus a `<script … form_embed.js>` line.
3. In `dist/index.html`, find the `<div class="book-embed" id="book-embed">` block and **replace the entire div** with GHL's `<iframe>`. Keep GHL's `<script>` line right after the iframe — it auto-resizes the widget so there's no inner scrollbar. Add `style="width:100%;min-height:700px;border:0"` to the iframe so it fills the panel. A typical result:

   ```html
   <iframe src="https://api.leadconnectorhq.com/widget/booking/XXXXXXXX"
           class="book-embed" style="width:100%;min-height:700px;border:0"
           scrolling="no" id="XXXXXXXX"></iframe>
   <script src="https://link.msgsndr.com/js/form_embed.js"></script>
   ```

4. Save, run `npm run check`, then commit and push (see below).

Prefer a plain link instead of an embed? Delete the `.book-embed` div and set the `href` on the **Book a call** buttons to your GHL scheduling link.

The embed loads GHL's script from `link.msgsndr.com` and the widget from `api.leadconnectorhq.com`. GitHub Pages adds no Content-Security-Policy, so both load normally on the live site.

## Deploy: edit, push, done

Hosting is **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`). Every push to `main` publishes the `dist/` folder to the live site automatically.

One-time setup:

1. In the repo on GitHub: **Settings ▸ Pages ▸ Build and deployment ▸ Source → GitHub Actions**.
2. Point the domain's DNS at GitHub Pages (see below).
3. Push to `main`. The **Deploy website to GitHub Pages** workflow runs; when it's green, the site is live.

Everyday edits:

```sh
# edit files in dist/ …
npm run check          # optional but recommended
git add -A
git commit -m "Update copy"
git push               # auto-deploys in ~1 minute
```

### DNS for leadsascend.com (GoDaddy)

In GoDaddy ▸ **Domain ▸ DNS ▸ Manage DNS**, set:

| Type  | Name | Value                | Notes                    |
|-------|------|----------------------|--------------------------|
| A     | @    | 185.199.108.153      | GitHub Pages apex        |
| A     | @    | 185.199.109.153      | GitHub Pages apex        |
| A     | @    | 185.199.110.153      | GitHub Pages apex        |
| A     | @    | 185.199.111.153      | GitHub Pages apex        |
| CNAME | www  | ksy214.github.io.    | www → your Pages site    |

Remove any conflicting "parked"/forwarding A or CNAME records GoDaddy added for `@`/`www`. After DNS propagates, enable **Enforce HTTPS** in Settings ▸ Pages. HTTPS certificates are issued automatically and can take up to a few hours the first time.

Official references:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Before collecting real enquiries

The booking placeholder does not book anything until you paste your GoHighLevel calendar embed (above). Keep advertising-spend, pricing and the guarantee terms accurate and agreed before making the offer public. Never place API keys or tokens in client-side JavaScript or in project files.

## Logo exports

The `brand` folder contains a transparent 4000px wordmark, a 2048px icon, outlined SVGs and favicon files. The `leadsascend.` lettering uses paths and needs no installed font. To regenerate exports on Linux with DejaVu Sans installed, install Python packages `fonttools`, `Pillow` and `cairosvg`, then run `python scripts/export-brand.py`.
