# v1 Build Plan — Note Clipping Tool

A weekend-paced plan to ship v1 in roughly 8 weekends of focused work (3-4 months calendar time). Check items off as you go.

**Cadence:** weekends only, ~6 hours of focused work per weekend.
**Rule for every weekend:** before you start Saturday, write down the *one* thing you want to finish. One. Hit it Sunday and stop, or roll over to next weekend if needed. Never start new work on top of broken work.

---

## Weekend 1 — "Hello, snippet"

**Goal:** by Sunday evening, you can run the app locally, type something into a textarea, hit save, and see it appear in a list below. Persisted in a real database. No styling, no auth, no topics.

### Saturday — Backend (3-4 hours)

- [X] Create the GitHub repo (private OK to start)
- [X] Clone locally, add a Node `.gitignore`
- [X] Set up Postgres locally via `docker-compose.yml` (Postgres only)
- [ ] Initialise NestJS (recommended) or Fastify project in `backend/`
- [ ] Create `snippets` table: `id`, `content`, `created_at`
- [ ] Endpoint: `POST /snippets` — accepts `{ content: string }`, saves to DB
- [ ] Endpoint: `GET /snippets` — returns all snippets
- [ ] Test both endpoints with `curl` or Postman
- [ ] Commit. Push.

### Sunday — Frontend (3-4 hours)

- [ ] Initialise Vite + React + TypeScript project in `frontend/`
- [ ] One page: textarea + "save" button + list of saved snippets below
- [ ] Use plain `fetch` (no TanStack Query yet)
- [ ] Get CORS working between frontend and backend
- [ ] Verify end-to-end: type, save, see it in the list, refresh, still there
- [ ] Commit. Push.

**Reality check:** if you finish Saturday's work by 1pm, *stop*. Don't push into Sunday's work.

---

## Weekend 2 — "Topics"

**Goal:** Snippets belong to topics. Create topics, view a topic's page, add snippets to it.

### Saturday — Backend

- [ ] Set up Prisma (or TypeORM) for migrations
- [ ] New table: `topics` (`id`, `name`, `created_at`)
- [ ] Add `topic_id` foreign key to `snippets`
- [ ] Endpoint: `POST /topics`
- [ ] Endpoint: `GET /topics`
- [ ] Endpoint: `GET /topics/:id` (returns topic + its snippets)
- [ ] Endpoint: `POST /topics/:id/snippets`

### Sunday — Frontend

- [ ] Install React Router
- [ ] Homepage: list of topics + "create topic" form
- [ ] Topic page (`/topics/:id`): list of snippets + textarea to add new ones
- [ ] Still no styling — just functional

**End of weekend 2:** working two-page app with real data hierarchy.

---

## Weekend 3 — "Markdown rendering"

**Goal:** Snippets render as Markdown. Pasting from a webpage or AI chat preserves formatting.

### Saturday — Markdown rendering

- [ ] Install `react-markdown`
- [ ] Install a syntax highlighter (`rehype-highlight` or similar)
- [ ] Replace plain text display with rendered Markdown
- [ ] Test by pasting a code-heavy block from a Claude/ChatGPT conversation

### Sunday — Paste-to-Markdown

- [ ] Install `turndown`
- [ ] Intercept paste events on the textarea
- [ ] If clipboard has HTML → convert to Markdown via Turndown before inserting
- [ ] If plain text → insert as-is
- [ ] Test with: Wikipedia article, blog post, AI conversation

**End of weekend 3:** the app starts feeling genuinely useful. Use it yourself the following week. Note what's annoying.

---

## Weekend 4 — "Sources and tags"

**Goal:** Each snippet has a source and tags. Filter by tag.

### Saturday — Backend

- [ ] Add `source` field to snippets (string — URL or free text)
- [ ] New table: `tags` (`id`, `name`)
- [ ] New table: `snippet_tags` (many-to-many join)
- [ ] Endpoints to add/remove tags on snippets
- [ ] Endpoint to list all tags
- [ ] Endpoint to filter snippets by tag

### Sunday — Frontend

- [ ] Source input next to the snippet textarea
- [ ] Tag input with autocomplete from existing tags
- [ ] Tag filter on the topic page

---

## Weekend 5 — "Make it look like something"

**Goal:** Stop being ugly.

- [ ] Install Tailwind
- [ ] Look at Bear, Obsidian, GitHub Issues for layout inspiration — *don't invent a UI*
- [ ] Pick: clean readable typography, generous spacing, one accent colour
- [ ] Style the homepage
- [ ] Style the topic page
- [ ] Style the snippet rendering (especially code blocks — they should look pleasant)
- [ ] Take screenshots — these are for your README later

**End of weekend 5:** the project now presents well in screenshots.

---

## Weekend 6 — "Search"

**Goal:** Search across all snippets.

- [ ] Set up Postgres full-text search (`tsvector` column on snippets)
- [ ] Add GIN index on the tsvector
- [ ] Set up trigger or migration logic to keep tsvector in sync with content
- [ ] Backend endpoint: `GET /search?q=...` using `ts_rank` for relevance
- [ ] Search bar on the homepage
- [ ] Results: snippet preview + topic + tags + highlighted matched terms
- [ ] Write a paragraph in your README explaining *why* you chose Postgres FTS over Elasticsearch (this is interview gold)

---

## Weekend 7 — "Auth"

**Goal:** Login required. Each user sees only their own data.

- [ ] Email + password registration endpoint (hash with bcrypt or argon2)
- [ ] Login endpoint returning JWT (access token) + refresh token
- [ ] Refresh token in httpOnly cookie, access token in memory on the frontend
- [ ] Refresh endpoint
- [ ] Logout endpoint
- [ ] Protect all snippet/topic/tag endpoints with auth middleware
- [ ] All data scoped to the logged-in user (add `user_id` to topics, cascade through)
- [ ] Login + register pages on the frontend
- [ ] Auth context / route guards on the frontend

---

## Weekend 8 — "Ship it"

**Goal:** Real URL, HTTPS, real users (well, you).

- [ ] Buy a domain (Namecheap, OVH, Porkbun — ~€10/year)
- [ ] Rent a VPS (Hetzner CX11 ~€4/month)
- [ ] Production `docker-compose.yml` with Postgres, backend, frontend
- [ ] Nginx reverse proxy in the stack
- [ ] Let's Encrypt for HTTPS (Certbot or a containerised solution)
- [ ] Set up DNS A record → VPS IP
- [ ] Deploy. Test. Verify HTTPS works.
- [ ] Update README with: live URL, screenshots, what it does, tech stack, why you built it
- [ ] **Flip the repo to public if it isn't already**
- [ ] Add the live URL to the GitHub repo description

**End of weekend 8:** real deployed app, real URL. Add it to your CV.

---

## After v1

- Use the app yourself for 2-3 months before deciding what v2 is.
- Real usage tells you what's missing better than any planning.

### v2 candidates (pick *one*, not all)

- [ ] Spaced repetition: app resurfaces old notes on a schedule
- [ ] AI source: paste a Claude/ChatGPT conversation, extract key points as draft snippets
- [ ] Export to Markdown / PDF
- [ ] Browser extension for one-click capture from any webpage
- [ ] Mobile-friendly responsive overhaul

---

## Honest expectations

- **Calendar time:** 3-4 months from start to deployed v1. Weekends will be missed. Some weekends will be half-done. That's normal.
- **First weekend will feel painful** — fighting tooling, not writing features. This is universal. Push through.
- **The project will never feel "good enough."** That's not a signal to delay. That's the signal to ship anyway.
