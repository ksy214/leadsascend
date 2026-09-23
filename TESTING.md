# Verification — 10 September 2026

## Passed

- Local static validation: navigation anchors resolve, referenced local assets exist, HTML IDs are unique, JavaScript syntax is valid.
- Production page uses no external fonts or animation libraries.
- Desktop Chrome at a 1363px viewport: no horizontal overflow; all logo images loaded; hero layout visually reviewed.
- Mobile layouts rendered in 390px and 320px browser frames: document scroll width equals client width; no horizontal overflow.
- Mobile menu opens, exposes section links, closes after selection, and stays within the narrow viewport.
- Mobile brief dialog opens and fits within the 390px frame.
- Five-lead CTA preselects the pilot; custom AI CTA preselects custom AI integration.
- Whitespace-only goals keep the visitor on the form; a valid goal produces the expected brief.
- Copy button copied the generated brief in the browser test.
- Edit returns to the form; Escape closes the dialog and restores focus to the opening button.
- FAQ disclosure expands and makes pricing information visible.
- A JavaScript-disabled frame still displays page content.
- Reduced-motion CSS and the JavaScript preference branch are present. No infinite animation loops or scroll listeners are used.

## Limits

These checks used Chrome desktop and mobile-width frames, not physical phones or a cross-browser device lab. Reduced-motion behavior was checked in source, not through an OS preference toggle. No Lighthouse, real-user Core Web Vitals or throttled-network performance score is claimed. The gzip figures printed by `npm run check` are estimates; delivery size depends on host compression.

The brief builder is local-only. Booking, server-side submissions, email delivery, CRM integration and custom-domain DNS are not connected and were not tested. Clipboard denial is handled with manual selection; that denial branch was reviewed in source.

## Repeat local checks

Run `npm run check`. For browser testing, run `npm ci` then `npm run dev`, open the printed URL, and exercise the actions above.
