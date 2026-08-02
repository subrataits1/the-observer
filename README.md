# The Observer

A personal website that reads like a kept notebook — photography, travel stories, and slow writing. Pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no backend. Deploys directly to GitHub Pages.

---

## 1. Folder structure

```
/
├── index.html              Homepage
├── 404.html                 Custom "not found" page
├── favicon.svg               Site icon
├── manifest.json              PWA-style manifest (name, theme color, icon)
├── robots.txt                  Search engine crawl rules
├── sitemap.xml                  Search engine page list
│
├── /pages                        Every inner page lives here
│   ├── about.html
│   ├── photography.html
│   ├── travel.html
│   ├── thoughts.html               Index of all writing
│   ├── thought.html                 Template that renders ONE entry (?slug=...)
│   ├── timeline.html
│   ├── gallery.html                  Masonry view of every photo
│   ├── contact.html
│   └── guestbook.html
│
├── /css
│   ├── variables.css              Design tokens: color, type, space, motion
│   ├── base.css                    Reset + global typography
│   ├── layout.css                   Nav, footer, loading screen, page scaffolding
│   ├── components.css                Cards, Polaroids, timeline, guestbook, cursor
│   ├── animations.css                 Page transitions, text reveals, glass effect
│   └── pages.css                       Home hero, article/prose styling, 404
│
├── /js
│   ├── main.js                    Nav behaviour, loader, cursor, scroll reveals
│   ├── content-loader.js           Fetches JSON/Markdown and renders it into the page
│   ├── markdown.js                  A small, dependency-free Markdown → HTML converter
│   ├── lightbox.js                   Full-screen photo viewer with EXIF details
│   └── guestbook.js                   Static guestbook (localStorage-backed)
│
├── /content                     ALL editable text lives here — no HTML editing required
│   ├── about/about.md               The About page copy
│   ├── photos/photos.json            Every photograph in the Photography diary
│   ├── travel/travel.json             Every journey in the Travel Diary
│   ├── quotes/quotes.json              The quote pool (homepage + "quote of the day")
│   ├── thoughts/index.json             The list that powers the Thoughts index page
│   ├── thoughts/*.md                    One Markdown file per journal entry
│   ├── timeline.json                     Vertical timeline entries
│   ├── guestbook-seed.json                Guestbook entries visible to every visitor
│   └── /blog                                Reserved for longer-form posts, same pattern as /thoughts
│
└── /assets
    ├── /images/photography         Photographs used in photos.json (SVG placeholders included)
    ├── /images/travel                Cover + gallery images used in travel.json
    ├── /icons                          Reserved for any custom icon assets
    └── /fonts                           Reserved if you switch off Google Fonts to self-hosted fonts
```

**Why this shape?** Every page under `/pages` is a static shell — headings, structure, and empty containers with `data-*` hooks. `content-loader.js` fetches the matching file from `/content` at page-load and fills those hooks in. That means editing a sentence never means touching a single `<div>`.

---

## 2. Editing content (no HTML required)

### Add a new photograph
Open `content/photos/photos.json` and add a new object to the array:
```json
{
  "id": "p7",
  "title": "Your title",
  "caption": "A short caption under the Polaroid",
  "story": "A few sentences for the full-screen view",
  "date": "2026-08-01",
  "location": "City, Country",
  "camera": "Camera name",
  "lens": "Lens name",
  "exif": "1/250s · f/4 · ISO 200",
  "mood": "One word",
  "image": "../assets/images/photography/your-photo.jpg",
  "featured": false
}
```
Drop the actual image file into `assets/images/photography/`. Set `"featured": true` on at most one photo to control what shows on the homepage.

### Add a new travel story
Add an object to `content/travel/travel.json` — copy an existing entry as a template. `facts` accepts any key/value pairs; they render automatically as a two-column list. `gallery` accepts as many image paths as you like.

### Add a new thought / journal entry / essay
1. Create a Markdown file in `content/thoughts/`, e.g. `content/thoughts/my-new-entry.md`:
   ```markdown
   ---
   title: My New Entry
   date: 2026-08-01
   category: Journal
   ---
   Your writing starts here. Standard Markdown works: **bold**, *italics*,
   > blockquotes, [links](https://example.com), and lists.
   ```
2. Add a matching entry to `content/thoughts/index.json` so it appears in the list:
   ```json
   { "slug": "my-new-entry", "title": "My New Entry", "date": "2026-08-01", "category": "Journal", "excerpt": "One sentence teaser." }
   ```
   The `slug` must match the filename (without `.md`).

Reading time and the reading-progress bar are calculated automatically — nothing to configure.

### Add a new quote
Add an object to `content/quotes/quotes.json`: `{ "id": "q6", "text": "...", "author": "..." }`. It joins the random pool used on the homepage and the daily "quote of the day."

### Add a new timeline moment
Add an object to `content/timeline.json`: `{ "year": "2027", "title": "...", "text": "..." }`. Entries render in the order they appear in the file.

### The guestbook
`content/guestbook-seed.json` holds the entries every visitor sees. Messages typed into the live form are saved to that visitor's own browser only (GitHub Pages has no database) — this is explained on the guestbook page itself. To make submissions visible to everyone, connect the form to a service like Formspree or Getform and adjust the `submit` handler in `js/guestbook.js`.

---

## 3. Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Push this entire folder to the repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: The Observer"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Choose the `main` branch and the `/ (root)` folder, then save.
4. Your site will publish at `https://YOUR-USERNAME.github.io/YOUR-REPO/` within a minute or two.
5. Update the placeholder URLs in `robots.txt`, `sitemap.xml`, and the Open Graph tags (`og:url`) in each page's `<head>` to match your real GitHub Pages URL.
6. Optional: add a `CNAME` file at the project root containing your custom domain if you're using one.

No build step, no `npm install`, nothing to compile. What you push is exactly what's served.

---

## 4. Replacing the placeholder photography

Every image referenced in `photos.json` and `travel.json` currently points to a generated SVG placeholder (warm gradients with a title, so the layout is easy to preview). To use real photographs:
1. Add your image files to `assets/images/photography/` or `assets/images/travel/`.
2. Update the `"image"` (or `"gallery"` / `"cover"`) paths in the matching JSON file.
3. Keep images reasonably sized (long edge ~2000px, compressed) — `loading="lazy"` is already applied everywhere, but large source files will still hurt load time.

---

## 5. Notes on the build

- **No frameworks.** Every interaction (nav, reveals, lightbox, cursor, guestbook, markdown rendering) is hand-written vanilla JS in `/js`.
- **Accessibility.** Semantic landmarks, a skip link, visible focus states, `aria-current` on nav links, keyboard-operable photo cards, and full `prefers-reduced-motion` support (animations and transitions are disabled site-wide when a visitor has that OS setting on).
- **Performance.** Images are lazy-loaded, layout uses `aspect-ratio` to avoid layout shift, and there are no external JS dependencies to download.
- **SEO.** Each page has its own title, description, Open Graph, and Twitter Card tags. `sitemap.xml` and `robots.txt` are included and just need your real domain swapped in.
