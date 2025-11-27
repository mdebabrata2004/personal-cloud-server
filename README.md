personal-cloud-server
=====================

This is a Vercel-ready serverless backend that uses Supabase for database, auth and storage.

Features:
- Register / Login (JWT)
- Notes CRUD (Postgres via Supabase)
- File upload to Supabase Storage (uploads bucket)
- Chat messages (Postgres via Supabase)

How to use (local):
1. Copy `.env.example` to `.env` and fill values (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET).
2. `npm install`
3. For local testing run `node server-local.js` (this file uses express and simulates endpoints).
   Note: server-local.js is for convenience—Vercel will run the serverless functions in `api/`.

How to deploy:
1. Push this repo to GitHub.
2. Import project into Vercel.
3. Set environment variables in Vercel (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET).
4. Deploy. API base will be `https://<your-vercel-project>.vercel.app/api/`

Security:
- Do NOT commit .env with keys.
- Use Supabase service_role only on server-side (Vercel env).
