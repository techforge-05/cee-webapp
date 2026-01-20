-- Create dynamic_content table for school-managed content
CREATE TABLE IF NOT EXISTS dynamic_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL, -- e.g., 'school.name', 'home.hero.title'
  locale TEXT NOT NULL, -- 'es' or 'en'
  value TEXT NOT NULL, -- The actual content
  category TEXT, -- e.g., 'school_info', 'homepage', 'about'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, locale)
);

-- Create media table for dynamic images
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE, -- e.g., 'school.logo', 'home.hero.image'
  url TEXT NOT NULL, -- Supabase Storage URL or external URL
  alt_text_es TEXT,
  alt_text_en TEXT,
  category TEXT, -- e.g., 'logos', 'banners', 'gallery'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_dynamic_content_locale ON dynamic_content(locale);
CREATE INDEX idx_dynamic_content_category ON dynamic_content(category);
CREATE INDEX idx_media_category ON media(category);

-- Enable Row Level Security (RLS)
ALTER TABLE dynamic_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view content)
CREATE POLICY "Allow public read access to dynamic_content"
  ON dynamic_content FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to media"
  ON media FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete (school personnel)
CREATE POLICY "Allow authenticated users to manage dynamic_content"
  ON dynamic_content FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage media"
  ON media FOR ALL
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_dynamic_content_updated_at
  BEFORE UPDATE ON dynamic_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some example data
INSERT INTO dynamic_content (key, locale, value, category) VALUES
  ('school.name', 'es', 'Centro Educativo Ejemplo', 'school_info'),
  ('school.name', 'en', 'Example Educational Center', 'school_info'),
  ('school.description', 'es', 'Bienvenidos a nuestro centro educativo', 'school_info'),
  ('school.description', 'en', 'Welcome to our educational center', 'school_info'),
  ('home.hero.title', 'es', 'Educación de Calidad', 'homepage'),
  ('home.hero.title', 'en', 'Quality Education', 'homepage'),
  ('home.hero.subtitle', 'es', 'Formando el futuro de nuestros estudiantes', 'homepage'),
  ('home.hero.subtitle', 'en', 'Shaping the future of our students', 'homepage');

INSERT INTO media (key, url, alt_text_es, alt_text_en, category) VALUES
  ('school.logo', '/images/logo.png', 'Logo de la escuela', 'School logo', 'logos'),
  ('home.hero.image', '/images/hero.jpg', 'Imagen principal', 'Hero image', 'banners');
