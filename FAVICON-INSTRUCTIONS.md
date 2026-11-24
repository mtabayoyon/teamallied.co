# Adding the Favicon to teamallied.co (GitHub)

The Allied "A" star mark, on navy — reads clearly from full size down to a browser tab.

## STEP 1 — Upload the icon files to the repo ROOT

Upload these 8 files to the TOP LEVEL of your `teamallied.co` repo (same place as `index.html` and `CNAME`), NOT in a subfolder:

- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- favicon-48x48.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- site.webmanifest

## STEP 2 — Add the tags to every page's <head>

Paste this block inside the `<head>` of each page (right after the <title> line is ideal). It must go on every page that should show the icon — at minimum the homepage; ideally all of them.

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

## STEP 3 — Commit, then hard-refresh

Commit the changes. GitHub Pages rebuilds in 1-2 minutes.
Favicons cache aggressively — after it's live, hard-refresh with Ctrl+Shift+R, or open the tab in a private window, to see the new icon.

Tip: if the old blank icon lingers, visit https://teamallied.co/favicon.ico directly once — that forces the browser to fetch the new one.
