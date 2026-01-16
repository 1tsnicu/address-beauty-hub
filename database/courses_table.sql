-- Tabel pentru cursuri
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  short_description TEXT NOT NULL,
  short_description_ru TEXT NOT NULL,
  duration TEXT NOT NULL,
  duration_ru TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EUR',
  price_alt TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  available BOOLEAN NOT NULL DEFAULT true,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  features_ru JSONB NOT NULL DEFAULT '[]'::jsonb,
  detailed_description TEXT,
  detailed_description_ru TEXT,
  what_you_learn JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_you_learn_ru JSONB NOT NULL DEFAULT '[]'::jsonb,
  effects JSONB NOT NULL DEFAULT '[]'::jsonb,
  effects_ru JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_you_get JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_you_get_ru JSONB NOT NULL DEFAULT '[]'::jsonb,
  practice_models INTEGER NOT NULL DEFAULT 0,
  support_days INTEGER NOT NULL DEFAULT 0,
  includes_branding BOOLEAN NOT NULL DEFAULT false,
  includes_career_strategy BOOLEAN NOT NULL DEFAULT false,
  includes_portfolio BOOLEAN NOT NULL DEFAULT false,
  diploma TEXT NOT NULL CHECK (diploma IN ('participation', 'completion', 'professional')) DEFAULT 'participation',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pentru performanță
CREATE INDEX IF NOT EXISTS idx_courses_available ON courses(available);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON courses(display_order);

-- Trigger pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_courses_updated_at();

-- Comentarii pentru documentație
COMMENT ON TABLE courses IS 'Tabel pentru gestionarea cursurilor de extensii de gene';
COMMENT ON COLUMN courses.display_order IS 'Ordinea de afișare a cursurilor (mai mic = mai sus)';
