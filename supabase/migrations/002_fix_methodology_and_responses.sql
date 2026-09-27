-- AyurEssence Schema Migration 002
-- Fixes Methodology Redundancy, Multi-Choice Responses & Score Snapshots

-- 1. Update PATIENTS: Add primary_methodology_id and baseline_dominant_dosha
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS primary_methodology_id UUID REFERENCES methodologies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS baseline_dominant_dosha VARCHAR(30);

-- 2. Update ASSESSMENTS: Remove redundant methodology_id (derived via questionnaires)
ALTER TABLE assessments 
DROP COLUMN IF EXISTS methodology_id;

-- 3. Update RESPONSES: Remove single-question unique constraint & add score snapshots
ALTER TABLE responses 
DROP CONSTRAINT IF EXISTS unique_assessment_question;

ALTER TABLE responses 
ADD COLUMN IF NOT EXISTS recorded_vata_score NUMERIC(6,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS recorded_pitta_score NUMERIC(6,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS recorded_kapha_score NUMERIC(6,2) DEFAULT 0;

-- 4. Create Index on responses for multi-choice lookups
CREATE INDEX IF NOT EXISTS idx_responses_assessment_question ON responses(assessment_id, question_id);
