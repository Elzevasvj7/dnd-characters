-- CreateEnum for Background names (using TEXT for flexibility)
-- We'll store the background key as a slug

-- CreateTable
CREATE TABLE "backgrounds" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "feature_name" TEXT NOT NULL,
    "feature_description" TEXT NOT NULL,
    "skill_proficiencies" "Skill"[] NOT NULL DEFAULT ARRAY[]::"Skill"[],
    "tool_proficiencies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "languages_count" INTEGER NOT NULL DEFAULT 0,
    "languages_choice" BOOLEAN NOT NULL DEFAULT false,
    "equipment" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "gold" INTEGER NOT NULL DEFAULT 0,
    "variant_of" UUID,
    "variant_name" TEXT,
    "variant_description" TEXT,
    "variant_feature_name" TEXT,
    "variant_feature_description" TEXT,
    "variant_skill_proficiencies" "Skill"[],
    "variant_tool_proficiencies" TEXT[],
    "variant_languages_count" INTEGER,
    "variant_equipment" TEXT[],
    "variant_gold" INTEGER,
    "specialties_table" JSONB,
    "personality_traits" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "ideals" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "bonds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "flaws" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "backgrounds_slug_key" ON "backgrounds"("slug");

-- CreateIndex
CREATE INDEX "backgrounds_variant_of_idx" ON "backgrounds"("variant_of");

-- AddForeignKey
ALTER TABLE "backgrounds" ADD CONSTRAINT "backgrounds_variant_of_fkey" FOREIGN KEY ("variant_of") REFERENCES "backgrounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "backgrounds" ENABLE ROW LEVEL SECURITY;

-- Policy: backgrounds are readable by all authenticated users
DROP POLICY IF EXISTS "backgrounds: readable by all" ON "backgrounds";
CREATE POLICY "backgrounds: readable by all"
    ON "backgrounds" FOR SELECT TO authenticated
    USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS "update_backgrounds_updated_at" ON "backgrounds";
CREATE TRIGGER "update_backgrounds_updated_at"
    BEFORE UPDATE ON "backgrounds"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();