/*
# Create portfolio tables: projects, contact_messages, guestbook

1. Overview
   This migration creates three tables for the DevPeu retro arcade portfolio:
   - `projects`: stores portfolio projects (editable without code changes)
   - `contact_messages`: stores messages submitted via the contact form
   - `guestbook`: stores short visitor messages (retro arcade guestbook)

2. New Tables

   `projects`
   - id (uuid, primary key, auto-generated)
   - title (text, not null) — project name
   - description (text) — project description
   - category (text) — e.g. "Site Institucional", "E-commerce", "Landing Page"
   - url (text, not null) — live project URL
   - cover_image_url (text) — optional cover image
   - rating (int, default 5) — star rating (1-5)
   - featured (boolean, default true) — whether to show in the grid
   - order_index (int, default 0) — display order
   - created_at (timestamptz, default now())

   `contact_messages`
   - id (uuid, primary key, auto-generated)
   - name (text, not null) — sender name
   - email (text, not null) — sender email
   - whatsapp (text) — optional WhatsApp number
   - message (text, not null) — the message body
   - created_at (timestamptz, default now())
   - read (boolean, default false) — whether the owner has read it

   `guestbook`
   - id (uuid, primary key, auto-generated)
   - visitor_name (text, not null) — visitor name
   - message (text, not null) — short message (max 200 chars, enforced by CHECK)
   - created_at (timestamptz, default now())

3. Security (RLS)

   `projects`:
   - RLS enabled.
   - SELECT: public (anon + authenticated) — anyone can view projects.
   - No INSERT/UPDATE/DELETE for anon — only authenticated (owner) can modify.

   `contact_messages`:
   - RLS enabled.
   - INSERT: public (anon + authenticated) — anyone can submit a contact form.
   - SELECT: authenticated only — only the owner can read messages (no anon read).
   - No UPDATE/DELETE for anon.

   `guestbook`:
   - RLS enabled.
   - SELECT: public (anon + authenticated) — anyone can read the guestbook.
   - INSERT: public (anon + authenticated) — anyone can sign the guestbook.
   - CHECK constraint: message length <= 200 characters.
   - No UPDATE/DELETE for anon.

4. Seed Data
   - Inserts 7 real portfolio projects into `projects` with ON CONFLICT DO NOTHING
     so the level-select screen has data immediately.

5. Important Notes
   - This is a no-auth (single-tenant) app: no sign-in screen, no user_id columns.
   - All public-facing policies use `TO anon, authenticated` so the anon-key
     frontend client can read/write its own data.
   - `contact_messages` SELECT is restricted to `authenticated` only, as the
     owner will read messages via the Supabase dashboard (not the frontend).
   - The guestbook `message` column has a CHECK constraint enforcing max 200
     characters, validated both client-side and in the database.
*/

-- ============================================================
-- Table: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  url text NOT NULL,
  cover_image_url text,
  rating int DEFAULT 5,
  featured boolean DEFAULT true,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_projects" ON projects;
CREATE POLICY "public_select_projects" ON projects
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Table: contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  whatsapp text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Table: guestbook
-- ============================================================
CREATE TABLE IF NOT EXISTS guestbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  message text NOT NULL CHECK (length(message) <= 200),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_guestbook" ON guestbook;
CREATE POLICY "public_select_guestbook" ON guestbook
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_guestbook" ON guestbook;
CREATE POLICY "public_insert_guestbook" ON guestbook
  FOR INSERT TO anon, authenticated WITH CHECK (length(message) <= 200);

-- ============================================================
-- Seed: 7 real portfolio projects
-- ============================================================
INSERT INTO projects (title, description, category, url, rating, featured, order_index)
VALUES
  ('Agência Marketing Peu', 'Site institucional para agência de marketing digital.', 'Site Institucional', 'https://agenciamarketingpeu.netlify.app', 5, true, 1),
  ('Auto Store', 'Loja virtual de autopeças com sistema de gestão de produtos.', 'E-commerce', 'https://autostoree.netlify.app', 5, true, 2),
  ('Oficina (v2)', 'Site institucional para oficina mecânica.', 'Site Institucional', 'https://oficina2.netlify.app', 5, true, 3),
  ('Bella Vita Studio', 'Landing page para estúdio de beleza e estética.', 'Landing Page', 'https://bellavitastudio.netlify.app', 5, true, 4),
  ('Oficina São Geraldo', 'Site institucional para oficina mecânica automotiva.', 'Site Institucional', 'https://oficinasaogeraldo.netlify.app', 5, true, 5),
  ('Instituto Dom Silva', 'Site institucional para instituto educacional.', 'Site Institucional', 'https://institutodomsilva.netlify.app', 5, true, 6),
  ('Auto Store (A Melhor)', 'E-commerce de autopeças com catálogo completo e checkout.', 'E-commerce', 'https://autostoreamelhor.netlify.app', 5, true, 7)
ON CONFLICT DO NOTHING;
