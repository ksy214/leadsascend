# Leads Ascend

A lightweight static marketing website for lead generation and custom AI integration services. Warm ivory, charcoal and orange; responsive navigation; native FAQs and a growth-brief dialog; motion that respects reduced-motion preferences.

## Preview locally

The website itself needs no framework or build step. Open `dist/index.html` in a browser, or use the optional Vite development server (Node 22.12+):

```sh
npm ci
npm run dev
```

Use the local URL printed by Vite. Run `npm run check` to check navigation targets, local assets, script syntax, duplicate IDs and the static file size budget. Vite is only a development dependency; it is not shipped to visitors.

## Files to edit

- `dist/index.html`: text, navigation, offer and form markup
- `dist/style.css`: colour palette, responsive layouts and animation
- `dist/app.js`: brief creation, copy action and one-time section animations
- `dist/assets/mark.svg`: vector logo and favicon

No external fonts, analytics, animation frameworks, or tracking scripts are loaded by the production page. The system font stack renders immediately. Animation uses opacity/transform and a small IntersectionObserver; there are no continuous animation loops or scroll listeners. All content stays visible with JavaScript disabled, although the brief builder requires JavaScript.

## Add this project to GitHub

The download excludes Git history, credentials and the private Sites identity. Unzip it into a folder named `leads-ascend`.

### GitHub Desktop

1. Install GitHub Desktop and sign in.
2. Choose **File → Add Local Repository** and select the extracted folder. If prompted, choose **Create a Repository** there.
3. Commit the project files and choose **Publish repository**. Keep it private unless you intend to share the source publicly.

### Command line

Create an empty GitHub repository named `leads-ascend`. Do not initialise it with another README or .gitignore. In the extracted project folder:

```sh
git init -b main
git add .
git commit -m "Add Leads Ascend website"
git remote add origin https://github.com/YOUR-USERNAME/leads-ascend.git
git push -u origin main
```

Replace YOUR-USERNAME with your GitHub username. Authenticate through GitHub's normal sign-in process; never put tokens in project files.

GitHub source control and website hosting are separate. Uploading code does not replace the existing Sites website. For optional GitHub Pages hosting, configure a GitHub Actions workflow to publish the `dist` folder. Do not publish the entire repository as website content. Custom-domain DNS setup is a separate step.

Official guidance:
- https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Before collecting real enquiries

The current form generates and copies a brief locally. It does not send submissions, book appointments or store visitor information. Connect your booking calendar or a server-side form handler and supply the appropriate privacy information before launching lead capture. Do not place API keys in client-side JavaScript.

The five-lead pilot does not yet promise free leads, a fixed price or a delivery deadline. Confirm service fees, ad spend, qualification criteria and timing before making that offer public. Custom AI integrations are advertised services; this marketing website does not itself implement a CRM or AI backend.

## Hosting in Sites

The canonical Sites checkout also contains `.openai/hosting.json`. Keep that file and its Site identity when continuing work in Sites. It is intentionally excluded from the portable GitHub download. Hosted files are the existing `dist` directory; no production build is required.

## Logo exports

The `brand` folder contains a transparent 4000px wordmark, a 2048px icon, outlined SVGs and favicon files. The `leadsascend.` lettering in the SVG uses paths and needs no installed font. To regenerate exports on a Linux environment with DejaVu Sans installed, install Python packages `fonttools`, `Pillow` and `cairosvg`, then run `python scripts/export-brand.py`.
