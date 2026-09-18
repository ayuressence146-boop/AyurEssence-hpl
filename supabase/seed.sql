-- AyurEssence Seed Data for Evaluation 2
-- Includes Methodology, Questionnaire, Questions, Options, and Initial Profiles

-- Seed Profiles
INSERT INTO profiles (id, full_name, role, phone, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Dr. Ananya Sharma', 'doctor', '+91-9876543210', true),
('00000000-0000-0000-0000-000000000002', 'Rahul Verma (Ayurveda Intern)', 'student', '+91-9876543211', true),
('00000000-0000-0000-0000-000000000003', 'Sujal Kumar', 'patient', '+91-9876543212', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Methodology
INSERT INTO methodologies (id, name, description, version, source, is_active) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Charaka Samhita Classical Deha Prakriti Assessment Framework',
    'Standard classical Ayurvedic methodology for scoring Vata, Pitta, and Kapha anatomical and physiological traits derived from Charaka Samhita Vimanasthana Chapter 8.',
    '1.0.0',
    'Charaka Samhita, Vimana Sthana 8/95-100',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Methodology Reference
INSERT INTO methodology_references (id, methodology_id, title, reference_url, citation, description) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Ayurvedic Assessment of Deha Prakriti',
    'https://www.carakasamhitaonline.com',
    'Charaka Samhita (Vimanasthana, Chapter 8, Verse 95-100)',
    'Standard references for physical and psychological characteristics used in identifying innate constitution (Prakriti).'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Questionnaire
INSERT INTO questionnaires (id, name, description, version, methodology_id, is_active, created_by) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'Standard Ayurvedic Physical & Mental Prakriti Questionnaire',
    'Comprehensive 6-category Prakriti assessment questionnaire covering body frame, skin, digestion, sleep, mood, and voice.',
    '1.0.0',
    '11111111-1111-1111-1111-111111111111',
    true,
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

-- Question 1: Body Frame
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440001', '33333333-3333-3333-3333-333333333333', 'What best describes your body frame and physical structure?', 'single', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550101', '44444444-4444-4444-4444-444444440001', 'Slim, thin, light frame, prominent joints', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550102', '44444444-4444-4444-4444-444444440001', 'Medium build, symmetrical, good muscle tone', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550103', '44444444-4444-4444-4444-444444440001', 'Broad, sturdy, well-developed, heavy frame', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;

-- Question 2: Skin Texture & Temperature
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440002', '33333333-3333-3333-3333-333333333333', 'What best describes your skin quality and temperature?', 'single', true, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550201', '44444444-4444-4444-4444-444444440002', 'Dry, rough, cool to touch, tends to crack easily', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550202', '44444444-4444-4444-4444-444444440002', 'Warm, reddish/rosy tone, prone to rashes or acne', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550203', '44444444-4444-4444-4444-444444440002', 'Smooth, moist, thick, pale or fair complexion', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;

-- Question 3: Appetite & Digestion (Agni)
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440003', '33333333-3333-3333-3333-333333333333', 'How would you describe your appetite and digestion pattern?', 'single', true, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550301', '44444444-4444-4444-4444-444444440003', 'Irregular, variable appetite, prone to bloating or gas (Vishamagni)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550302', '44444444-4444-4444-4444-444444440003', 'Strong, intense hunger, irritable if meal is delayed (Tikshnagni)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550303', '44444444-4444-4444-4444-444444440003', 'Constant but slow digestion, can skip meals easily (Mandagni)', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;

-- Question 4: Sleep Patterns
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440004', '33333333-3333-3333-3333-333333333333', 'How do you usually sleep at night?', 'single', true, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550401', '44444444-4444-4444-4444-444444440004', 'Light, interrupted sleep, active dreams, difficulty falling asleep', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550402', '44444444-4444-4444-4444-444444440004', 'Moderate sleep, passionate/fiery dreams, awaken refreshed', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550403', '44444444-4444-4444-4444-444444440004', 'Deep, heavy, long sleep, reluctant to wake up in morning', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;

-- Question 5: Mental & Emotional Response
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440005', '33333333-3333-3333-3333-333333333333', 'How do you react to stress or challenging situations?', 'single', true, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550501', '44444444-4444-4444-4444-444444440005', 'Anxious, fearful, quick to worry, restless mind', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550502', '44444444-4444-4444-4444-444444440005', 'Impatient, aggressive, sharp tongue, goal-driven', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550503', '44444444-4444-4444-4444-444444440005', 'Calm, patient, steady, tolerant, avoids conflict', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;

-- Question 6: Speech & Voice
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440006', '33333333-3333-3333-3333-333333333333', 'What best characterizes your speech and tone of voice?', 'single', true, 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550601', '44444444-4444-4444-4444-444444440006', 'Fast, talkative, high-pitched, variable volume', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550602', '44444444-4444-4444-4444-444444440006', 'Sharp, clear, precise, authoritative, convincing', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550603', '44444444-4444-4444-4444-444444440006', 'Slow, deep, pleasant, melodious, low tone', 0.0, 0.0, 1.0, 3)
ON CONFLICT (id) DO NOTHING;
