-- AyurEssence Schema Migration 003
-- Advanced Clinical (Recommendations, Reminders, Share Tokens) & Educational Features (Mentor Feedback)

-- 1. RECOMMENDATIONS TABLE (Human-in-the-loop Doctor Approval)
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    draft_text TEXT NOT NULL,
    approved_text TEXT,
    recommended_followup_weeks INTEGER DEFAULT 4,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'modified')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOLLOWUP REMINDERS TABLE
CREATE TABLE IF NOT EXISTS followup_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'sms', 'whatsapp')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REPORT SHARE TOKENS TABLE (Secure Expiring Links)
CREATE TABLE IF NOT EXISTS report_share_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    token VARCHAR(100) UNIQUE NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms')),
    recipient VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_accessed BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MENTOR FEEDBACK TABLE (Student Educational Module)
CREATE TABLE IF NOT EXISTS mentor_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    feedback_type VARCHAR(20) DEFAULT 'tip' CHECK (feedback_type IN ('positive', 'warning', 'tip', 'correction')),
    notes TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_recommendations_assessment ON recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_followup_reminders_patient ON followup_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_report_share_tokens_token ON report_share_tokens(token);
CREATE INDEX IF NOT EXISTS idx_mentor_feedback_student ON mentor_feedback(student_id);
