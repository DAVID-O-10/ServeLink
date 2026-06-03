# ServeLink

Local business marketplace for Nigeria — find, connect, and get it done.

## Features

- Landing page with hero, about stats, testimonials, and contact form
- **Marketplace** — search, filter, sort, grid/list view, map view
- **Business profiles** — gallery, reviews, quote requests, share, report
- **Accounts** — register/sign in (local or Supabase)
- **Owner dashboard** — analytics and quote requests
- **Favorites** — save businesses
- **Dark mode**, PWA install, scroll spy navbar, page transitions

## Run locally

```bash
npm install
npm run dev
```

## Optional Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `.env.example` to `.env` and add your URL and anon key

Without Supabase, all data is stored in the browser (localStorage) and works offline after first load.

## Build

```bash
npm run build
npm run preview
```
