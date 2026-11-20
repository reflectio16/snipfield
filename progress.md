# snipfield — Progress

A personal bookmark space for everything worth keeping: notes, screenshots, and links (films, books, videos…) organised into categories you create yourself.

**Why:** screenshots pile up in the phone album, and tabs stay open "for later." snipfield replaces both.

**Cadence:** weekends, ~6 hours of focused work. Work happens at home or at school; the code moves through GitHub.

**Rules for every session**
- Before starting: `git pull`, then `docker compose up -d` from the project root.
- Write down the *one* thing you want to finish this session.
- Never start new work on top of broken work.
- Before stopping: commit, then `git push`. Always — school machines can wipe local files.

---

## v1 scope

**Category** — created by the user (Films, Books, Notes…), unlimited.

**Item** — belongs to one category, has a type:
- **Note** — text, pasted or written, rendered as Markdown
- **Image** — an uploaded screenshot or picture
- **Link** — a URL shown with a preview (title + thumbnail)

**Deliberately not in v1:** playing videos inside the app, special handling for each platform, editing or cropping images, sharing between users.

---

## Done so far

- [x] Dev environment at home (Node 20 via nvm, Docker, Git, VS Code)
- [x] NestJS backend scaffolded in `backend/`
- [x] Postgres running in Docker via `docker-compose.yml`
- [x] Prisma 6 connected, first migration applied (`Snippet` table — will be replaced in step 1)
- [x] First commit pushed

---

## Setup at school (one time)

- [x ] Create an SSH key (`ssh-keygen -t ed25519`) and add it to GitHub
- [ x] Install nvm and Node 20 (`nvm install 20`, `nvm alias default 20`)
- [ x] Clone the repo (into `goinfre` if the home quota is tight)
- [x ] `cd backend && npm install`
- [ x] Create `backend/.env` by hand with `DATABASE_URL`
- [x ] `docker compose up -d`
- [x ] `npx prisma migrate dev` to create the tables

---

## Step 1 — Backend: categories and notes

**Goal:** create categories and add text notes to them, tested with curl.

### Schema
- [ x] Replace the `Snippet` model with `Category` (`id`, `name`, `createdAt`)
- [ x] Add `Item` model: `id`, `type` (enum: NOTE, IMAGE, LINK), `categoryId`, `title` (optional), `content` (optional), `url` (optional), `imagePath` (optional), `createdAt`
- [ x] Run a migration (`npx prisma migrate dev --name categories_and_items`)
- [ x] Read the generated SQL and understand it

### Code
- [x ] `PrismaService` + `PrismaModule` so NestJS can use the database
- [ x] `CategoriesModule`: `POST /categories`, `GET /categories`, `GET /categories/:id` (with its items)
- [ x] `ItemsModule`: `POST /categories/:categoryId/notes` for notes
- [ x] Input validation (`class-validator`): no empty category names, no empty notes
- [ x] Test every endpoint with curl
- [ x] Commit and push

---

## Step 2 — Frontend: the basics

**Goal:** use the app in the browser.

- [ x] Vite + React + TypeScript in `frontend/`
- [ x] React Router
- [ x] Home page: list of categories + "new category" form
- [x ] Category page: list of items + form to add a note
- [x ] CORS configured on the backend
- [x ] Notes rendered as Markdown (`react-markdown`)
- [ x] Paste from a web page converts to Markdown (`turndown`)
- [x ] Test on your phone over Wi-Fi (`npm run dev -- --host`)
- [ x] Commit and push

---

## Step 3 — Image items

**Goal:** upload a screenshot into a category.

- [ x] Backend upload endpoint (NestJS + Multer)
- [ x] Files stored on disk in a Docker volume, path saved in `imagePath`
- [ x] Limits: allowed types (png, jpg, webp) and max file size
- [ x] Endpoint to serve the images
- [x ] Frontend: upload button, image shown in the category feed
- [ ] Delete an item (and its file)
- [ ] Commit and push

---

## Step 4 — Link items

**Goal:** save a URL and see a preview.

- [ ] Backend fetches the page and reads its preview tags (`og:title`, `og:image`)
- [ ] Store title and thumbnail URL on the item
- [ ] Timeouts and errors handled — a link without a preview is still saved
- [ ] Frontend: link card with thumbnail + title, opens the original page
- [ ] Test with YouTube, a book page, a film page
- [ ] Note: X (Twitter) usually blocks previews — use Image items for X content
- [ ] Commit and push

---

### NOTE: images and links will get their own endpoints (/images, /links)

---

## Step 5 — Make it look good (mobile-first)

- [ ] Tailwind
- [ ] Design for the phone screen first, then widen for the laptop
- [ ] Mixed feed that looks good with notes, images and links together
- [ ] Look at apps you like for inspiration — don't invent a UI
- [ ] Screenshots for the README
- [ ] Commit and push

---

## Step 6 — Search and filtering

- [ ] Postgres full-text search on titles and note content
- [ ] Filter by item type (notes / images / links)
- [ ] Search bar on the home page
- [ ] README paragraph: why Postgres search and not Elasticsearch
- [ ] Commit and push

---

## Step 7 — Auth

- [ ] Register + login (password hashed with bcrypt or argon2)
- [ ] JWT access token + refresh token in an httpOnly cookie
- [ ] Every category and item belongs to a user
- [ ] Users can only see their own data and images
- [ ] Login and register pages
- [ ] Commit and push

---

## Step 8 — Deploy

- [ ] Domain name
- [ ] Small VPS (e.g. Hetzner)
- [ ] Production `docker-compose.yml`: Postgres, backend, frontend, image volume
- [ ] Nginx reverse proxy + HTTPS with Let's Encrypt
- [ ] Backups of the database and the image volume
- [ ] README: live URL, screenshots, stack, why you built it
- [ ] Repo public
- [ ] Commit and push

---

## Step 9 — On the phone (PWA)

**Goal:** install snipfield on Android and share into it directly.

- [ ] Web app manifest + icons
- [ ] Installable on the Android home screen
- [ ] Share target: share text, links and **images** from other apps into snipfield
- [ ] Choose the category when something is shared
- [ ] Test the real flow: screenshot on X → Share → snipfield → Films
- [ ] Commit and push

---

## After v1

Use it for a few weeks before choosing what's next. Pick **one**:

- [ ] Tags across categories
- [ ] "Done" status (watched / read) for films and books
- [ ] Browser extension for one-click saving
- [ ] React Native client using the same backend
- [ ] Image storage moved to object storage

---

## Design Notes 

- [ ] The text seems too close to the right side on the phone
- [ ] Title and note creation boxes needs more room initially
- [ ] the buttons needs to be a bit bigger
- [ ] Will look at the colors and layout designs later
- [ ] 


---

## Honest expectations

- This is bigger than the first plan: expect several months of weekends.
- Some weekends will be missed or half-done. That's normal.
- It will never feel "good enough" to show. Ship it anyway.
