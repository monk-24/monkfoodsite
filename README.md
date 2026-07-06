# Monk Food — Website

Modern, monochrome marketing site for **Monk Food** — online ordering, EPOS and QR code
ordering for restaurants, takeaways and bars. We don't just provide the technology, we
bring the sales. Static site (HTML/CSS/JS) with a contact form that writes leads straight
into a Google Sheet.

## Pages

| File | Clean URL | Page |
|------|-----------|------|
| `index.html` | `/` | Home |
| `services.html` | `/services` | Services (Online Ordering, EPOS, QR, Sales & Marketing) |
| `about.html` | `/about` | About |
| `blog/index.html` | `/blog/` | Blog listing (auto-renders from `blog/posts.json`) |
| `blog/<slug>.html` | `/blog/<slug>` | Individual blog posts (created by the admin) |
| `contact.html` | `/contact` | Contact Sales (Google Sheets form) |
| `admin.html` | `/admin` | Blog admin panel (noindex — private) |

There is no pricing page by design — pricing is handled through **Contact Sales**.

Shared styling lives in `assets/styles.css`, scripts in `assets/main.js`, logo in `assets/logo.png`.

### Clean URLs (no `.html`)

All internal links are extensionless (e.g. `/about`, `/services`). This works out of the
box on **GitHub Pages** (it serves `about.html` at `/about`) and on the local Node server
(`server.js` resolves extensionless paths). No extra config needed.

---

## Run locally (Node.js)

```bash
npm install
npm run dev
# open http://localhost:3000
```

`server.js` is a tiny Express static server just for previewing. The production site is
static, so no server is needed once it's on GitHub Pages.

---

## Connect the contact form to Google Sheets

The site is hosted as static files, so the form talks to a **Google Apps Script** web app
(no backend server to maintain). Do this once:

1. **Create a Google Sheet** (sheets.new). Leave the first tab named `Sheet1`.
2. In that sheet: **Extensions → Apps Script**.
3. Delete the placeholder code, then paste everything from **`google-apps-script.gs`**
   (in this repo). Save.
   - Optional: change `NOTIFY_EMAIL` if you want lead alerts sent somewhere other than
     `monkfoodanalystic@gmail.com` (or set it to `""` to turn emails off).
4. **Deploy → New deployment**. Click the gear → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Deploy, authorise the permissions, and **copy the Web app URL**.
5. Open **`assets/main.js`** and paste that URL into:
   ```js
   const SHEETS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
6. Commit and push. Submissions now append a row (Timestamp, Name, Business, Email, Phone,
   Type, Interest, Message) to your sheet.

> Until you paste a URL, the form runs in **demo mode**: it shows the success message but
> doesn't store anything. So it's safe to deploy before wiring the sheet up.

If you later re-edit the Apps Script, use **Deploy → Manage deployments → Edit → New
version** so the same URL keeps working.

---

## Host on GitHub Pages

**Option A — deploy from a branch (simplest):**

1. Create a repo and push these files.
   ```bash
   git init
   git add .
   git commit -m "Monk Food website"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Repo **Settings → Pages** → *Build and deployment* → **Deploy from a branch** →
   Branch `main`, folder `/ (root)` → Save.
3. Your site goes live at `https://<you>.github.io/<repo>/` in a minute or two.

**Option B — GitHub Actions (already included):** the workflow at
`.github/workflows/deploy.yml` auto-publishes on every push to `main`. To use it, set
**Settings → Pages → Source → GitHub Actions**.

The `.nojekyll` file is included so GitHub serves the `assets/` folder as-is.

---

## Blog + admin panel

You can write blog posts (with images) from a private admin page on your live site. Each
post becomes a **static HTML page** with full SEO tags and structured data — exactly what
Google and AI assistants crawl and cite.

### One-time setup

1. **Create a GitHub access token.** GitHub → *Settings → Developer settings → Fine-grained
   personal access tokens → Generate new token*. Give it access to **only this repository**
   with **Repository permissions → Contents → Read and write**. Copy the token.
2. Go to `https://<your-site>/admin`.
3. Fill in:
   - **Site URL** — your live domain (e.g. `https://monkfood.com` or
     `https://<you>.github.io/<repo>`). Used for canonical URLs and the sitemap.
   - **Branch** — usually `main`.
   - **GitHub username / owner** and **Repository name**.
   - **Access token** — the token from step 1.
4. Click **Save & connect**. Details are stored only in your browser (localStorage).

### Writing a post

1. On `/admin`, use the **Write post** tab: add a title, meta description, tags, a cover
   image, and write the body in the rich-text editor (headings, bold, lists, links, and
   drag/insert images).
2. Click **Publish post**. The admin commits, via the GitHub API:
   - `blog/<slug>.html` (the post page, with Open Graph + JSON-LD Article schema)
   - any images to `blog/images/`
   - an updated `blog/posts.json` (drives the `/blog/` listing)
   - a regenerated `sitemap.xml`
3. GitHub Pages rebuilds in ~1 minute and the post is live at `/blog/<slug>`.

The **Manage posts** tab lists everything and lets you delete a post.

> **Security note:** the token lives only in your browser. Use a fine-grained token scoped
> to this one repo so it can never touch anything else. Click **Lock** on the admin to
> clear it from the browser. The admin page is `noindex` and blocked in `robots.txt`.

### After your first deploy

Edit `robots.txt` and replace `REPLACE-WITH-YOUR-DOMAIN` with your real domain so the
`Sitemap:` line is correct. (Publishing any post also rewrites `sitemap.xml` with the Site
URL you entered in the admin.)

---

## SEO & AI crawlers

- Every page has descriptive `<title>`/meta tags; the home page and each blog post include
  **Open Graph**, **Twitter Card** and **JSON-LD** structured data (`Organization` /
  `Article`).
- `sitemap.xml` lists all pages and posts; `robots.txt` points to it and **explicitly
  welcomes AI crawlers** (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended, CCBot, etc.) so your content can surface in AI chat answers.
- Blog posts are pre-rendered static HTML (not JavaScript-only), which is the most reliable
  format for both search engines and AI assistants to read.

---

## Customising

- **Contact email / brand copy:** search-and-replace `monkfoodanalystic@gmail.com` and the
  footer text.
- **Colours & fonts:** the theme is driven by CSS variables at the top of
  `assets/styles.css` (monochrome, matched to the logo).
