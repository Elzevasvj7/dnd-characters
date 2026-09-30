-- CreateEnum
CREATE TYPE "Ability" AS ENUM ('STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA');

-- CreateEnum
CREATE TYPE "Skill" AS ENUM ('ACROBATICS', 'ATHLETICS', 'ARCANA', 'DECEPTION', 'HISTORY', 'PERFORMANCE', 'INTIMIDATION', 'INVESTIGATION', 'SLEIGHT_OF_HAND', 'MEDICINE', 'NATURE', 'PERCEPTION', 'INSIGHT', 'PERSUASION', 'RELIGION', 'STEALTH', 'SURVIVAL', 'ANIMAL_HANDLING');

-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "additional_features" TEXT,
ADD COLUMN     "allies_and_organizations" TEXT,
ADD COLUMN     "backstory" TEXT,
ADD COLUMN     "bonds" TEXT,
ADD COLUMN     "copper" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "death_save_failures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "death_save_successes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "electrum" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "experience_points" INTEGER,
ADD COLUMN     "eyes" TEXT,
ADD COLUMN     "features_and_traits" TEXT,
ADD COLUMN     "flaws" TEXT,
ADD COLUMN     "gold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hair" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "hit_dice" TEXT,
ADD COLUMN     "hit_dice_spent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ideals" TEXT,
ADD COLUMN     "initiative_override" INTEGER,
ADD COLUMN     "inspiration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organization_name" TEXT,
ADD COLUMN     "other_proficiencies" TEXT,
ADD COLUMN     "personality_traits" TEXT,
ADD COLUMN     "platinum" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "player_name" TEXT,
ADD COLUMN     "save_proficiencies" "Ability"[] DEFAULT ARRAY[]::"Ability"[],
ADD COLUMN     "silver" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skill_expertise" "Skill"[] DEFAULT ARRAY[]::"Skill"[],
ADD COLUMN     "skill_proficiencies" "Skill"[] DEFAULT ARRAY[]::"Skill"[],
ADD COLUMN     "skin" TEXT,
ADD COLUMN     "spell_attack_bonus_override" INTEGER,
ADD COLUMN     "spell_save_dc_override" INTEGER,
ADD COLUMN     "spellcasting_ability" "Ability",
ADD COLUMN     "spellcasting_class" TEXT,
ADD COLUMN     "temporary_hp" INTEGER,
ADD COLUMN     "treasure" TEXT,
ADD COLUMN     "weight" TEXT;

-- CreateTable
CREATE TABLE "attacks" (
    "id" UUID NOT NULL,
    "character_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "bonus" TEXT,
    "damage" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spell_slots" (
    "id" UUID NOT NULL,
    "character_id" UUID NOT NULL,
    "level" INTEGER NOT NULL,
    "total" INTEGER NOT NULL DEFAULT 0,
    "expended" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "spell_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attacks_character_id_idx" ON "attacks"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "spell_slots_character_id_level_key" ON "spell_slots"("character_id", "level");

-- AddForeignKey
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spell_slots" ADD CONSTRAINT "spell_slots_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
