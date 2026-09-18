-- AyurEssence Initial Database Schema
-- HPL 2026 Evaluation 2 Migration File

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'student', 'patient')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PATIENTS
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(30),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- METHODOLOGIES
CREATE TABLE IF NOT EXISTS methodologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    version VARCHAR(30) NOT NULL,
    source TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- METHODOLOGY REFERENCES
CREATE TABLE IF NOT EXISTS methodology_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    methodology_id UUID REFERENCES methodologies(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    reference_url TEXT,
    citation TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUESTIONNAIRES
CREATE TABLE IF NOT EXISTS questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    version VARCHAR(30) NOT NULL,
    methodology_id UUID REFERENCES methodologies(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'single',
    is_required BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    vata_score NUMERIC(6,2) DEFAULT 0,
    pitta_score NUMERIC(6,2) DEFAULT 0,
    kapha_score NUMERIC(6,2) DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    conducted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE RESTRICT,
    methodology_id UUID REFERENCES methodologies(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted', 'reviewed', 'finalized')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    finalized_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESPONSES
CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE RESTRICT,
    selected_option_id UUID REFERENCES question_options(id) ON DELETE RESTRICT,
    text_answer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_assessment_question UNIQUE(assessment_id, question_id)
);

-- OBSERVATIONS
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENT RESULTS
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    vata_percentage NUMERIC(5,2) NOT NULL,
    pitta_percentage NUMERIC(5,2) NOT NULL,
    kapha_percentage NUMERIC(5,2) NOT NULL,
    dominant_dosha VARCHAR(20) NOT NULL,
    calculation_version VARCHAR(30) NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    report_type VARCHAR(20) NOT NULL,
    report_data JSONB DEFAULT '{}',
    generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_conducted_by ON assessments(conducted_by);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_questions_questionnaire_id ON questions(questionnaire_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_observations_assessment_id ON observations(assessment_id);
