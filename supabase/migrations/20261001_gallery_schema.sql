-- ==============================================================================
-- SCHEMA & POLITIQUES RLS SUPABASE : GESTION DE LA GALERIE PHOTO (A.J.M.C — KANDI)
-- ==============================================================================

-- 1. Table des albums de la galerie
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_fr TEXT NOT NULL,
  title_ar TEXT,
  description_fr TEXT,
  description_ar TEXT,
  cover_url TEXT,
  event_date DATE,
  category TEXT DEFAULT 'Activités culturelles',
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des photos d'albums
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  storage_path TEXT,
  public_url TEXT NOT NULL,
  title_fr TEXT,
  title_ar TEXT,
  caption_fr TEXT,
  caption_ar TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexation pour requêtes rapides et tri fluide
CREATE INDEX IF NOT EXISTS idx_gallery_albums_published_sort
  ON public.gallery_albums (is_published, sort_order ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_album_sort
  ON public.gallery_photos (album_id, sort_order ASC, created_at ASC);

-- 4. Activation de Row Level Security (RLS)
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- 5. Politiques RLS de lecture publique (Albums & photos publiés uniquement)
CREATE POLICY "Public read published albums"
  ON public.gallery_albums FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Public read published photos"
  ON public.gallery_photos FOR SELECT
  TO public
  USING (is_published = true);

-- 6. Politiques RLS Administrateur (Création, modification, publication, suppression)
-- Vérifie que l'utilisateur est authentifié et possède le rôle admin dans ses métadonnées
CREATE POLICY "Admin full access albums"
  ON public.gallery_albums FOR ALL
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin full access photos"
  ON public.gallery_photos FOR ALL
  TO authenticated
  USING (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- 7. Configuration du bucket Supabase Storage 'gallery'
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8. Politiques Storage pour le bucket 'gallery'
CREATE POLICY "Public read gallery objects"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'gallery');

CREATE POLICY "Admin upload gallery objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery' AND
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin update gallery objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'gallery' AND
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admin delete gallery objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gallery' AND
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
