-- ====================================================================
-- SCHEMA SUPABASE POUR LE SITE DE L'ÉCOLE
-- SYNCHRONISATION AUTOMATIQUE DES VIDÉOS YOUTUBE
-- ====================================================================

-- 1. Création de la table videos
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id VARCHAR(32) UNIQUE NOT NULL,
    youtube_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    channel_id VARCHAR(64) NOT NULL,
    playlist_id VARCHAR(64),
    category VARCHAR(64) DEFAULT 'عام',
    duration VARCHAR(32),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNAVAILABLE', 'PRIVATE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index de performance
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON public.videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);

-- 3. Fonction et déclencheur pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_videos_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_videos_updated_at ON public.videos;
CREATE TRIGGER trg_videos_updated_at
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_videos_updated_at_column();

-- 4. Sécurité au niveau des lignes (Row Level Security - RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Les visiteurs peuvent lire uniquement les vidéos actives
DROP POLICY IF EXISTS "Public can view active videos" ON public.videos;
CREATE POLICY "Public can view active videos"
    ON public.videos
    FOR SELECT
    USING (status = 'ACTIVE');

-- Le backend (clé service_role) a un accès complet pour synchroniser et mettre à jour
DROP POLICY IF EXISTS "Service role has full access to videos" ON public.videos;
CREATE POLICY "Service role has full access to videos"
    ON public.videos
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
