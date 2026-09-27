-- AyurEssence Official Seed Data
-- Full Classical Ayurvedic Prakriti Question Bank & Dīrghāyu Lakṣaṇa Assessment

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
    'Charaka Samhita Classical Deha Prakriti & Dīrghāyu Assessment Framework',
    'Official classical Ayurvedic methodology for scoring Vata, Pitta, and Kapha traits plus Dīrghāyu Lakṣaṇa longevity indicators derived from Charaka Samhita Vimanasthana Ch. 8.',
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
    'Ayurvedic Assessment of Deha Prakriti & Dīrghāyu Lakṣaṇa',
    'https://www.carakasamhitaonline.com',
    'Charaka Samhita (Vimanasthana, Chapter 8, Verse 95-100 & Verse 122)',
    'Standard references for anatomical, physiological, psychological characteristics and longevity signs (Dīrghāyu).'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Official Questionnaire
INSERT INTO questionnaires (id, name, description, version, methodology_id, is_active, created_by) VALUES
(
    '33333333-3333-3333-3333-333333333333',
    'Official Ayurvedic Prakriti & Dīrghāyu Full Assessment',
    'Official competition 9-section Prakriti trait assessment with Dīrghāyu Lakṣaṇa pop-out longevity evaluation.',
    '1.0.0',
    '11111111-1111-1111-1111-111111111111',
    true,
    '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

-- SECTION 1: BODY BUILD AND SKIN
-- Q1: Body Size
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440001', '33333333-3333-3333-3333-333333333333', '1.1 Body size & build', 'single', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550101', '44444444-4444-4444-4444-444444440001', 'Thin and lean, low body weight (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550102', '44444444-4444-4444-4444-444444440001', 'Medium build, soft body (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550103', '44444444-4444-4444-4444-444444440001', 'Heavy, strong, well-built body (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- Q2: Skin Type
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440002', '33333333-3333-3333-3333-333333333333', '1.2 Skin type & texture', 'single', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550201', '44444444-4444-4444-4444-444444440002', 'Dry, rough, sometimes cracked (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550202', '44444444-4444-4444-4444-444444440002', 'Soft, warm, prone to moles, freckles, or pimples (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550203', '44444444-4444-4444-4444-444444440002', 'Oily, smooth, and glowing (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- Q3: Joints
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440003', '33333333-3333-3333-3333-333333333333', '1.3 Joints condition & flexibility', 'single', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550301', '44444444-4444-4444-4444-444444440003', 'Joints crack or make sound when moving (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550302', '44444444-4444-4444-4444-444444440003', 'Loose, soft joints and muscles (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550303', '44444444-4444-4444-4444-444444440003', 'Strong, firm, well-bound, and well-lubricated (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- Q4: Body Movement
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440004', '33333333-3333-3333-3333-333333333333', '1.4 Body movement & habits', 'single', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550401', '44444444-4444-4444-4444-444444440004', 'Fast, restless, shaking joints/eyes/jaw/lips/hands (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550402', '44444444-4444-4444-4444-444444440004', 'Sharp and energetic (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550403', '44444444-4444-4444-4444-444444440004', 'Slow, steady, and calm (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 2: HAIR, NAILS, AND COMPLEXION
-- Q5: Hair Quality
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440005', '33333333-3333-3333-3333-333333333333', '2.1 Hair texture & growth', 'single', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550501', '44444444-4444-4444-4444-444444440005', 'Thin, dry, and rough (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550502', '44444444-4444-4444-4444-444444440005', 'Turns grey early, thins or goes bald early (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550503', '44444444-4444-4444-4444-444444440005', 'Thick, oily, wavy, and dark (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- Q6: Complexion
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440006', '33333333-3333-3333-3333-333333333333', '2.2 Skin color & tone', 'single', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550601', '44444444-4444-4444-4444-444444440006', 'Dull, darker tone (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550602', '44444444-4444-4444-4444-444444440006', 'Yellowish or coppery tone (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550603', '44444444-4444-4444-4444-444444440006', 'Fair, cool-toned, glowing skin (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 3: APPETITE, SWEAT, AND BODY TEMPERATURE
-- Q7: Appetite & Digestion (Agni)
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440007', '33333333-3333-3333-3333-333333333333', '3.1 Appetite pattern', 'single', true, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550701', '44444444-4444-4444-4444-444444440007', 'Changes often, sometimes forgets to eat (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550702', '44444444-4444-4444-4444-444444440007', 'Very strong, feels hungry and eats a lot (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550703', '44444444-4444-4444-4444-444444440007', 'Low appetite, can skip meals easily (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- Q8: Weather Preference
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440008', '33333333-3333-3333-3333-333333333333', '3.2 Weather preference & temperature tolerance', 'single', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550801', '44444444-4444-4444-4444-444444440008', 'Dislikes cold weather (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550802', '44444444-4444-4444-4444-444444440008', 'Dislikes hot weather (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550803', '44444444-4444-4444-4444-444444440008', 'Handles both hot and cold weather well (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 4: VOICE AND SPEECH
-- Q9: Voice & Speech Style
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440009', '33333333-3333-3333-3333-333333333333', '4.1 Voice quality & talking style', 'single', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555550901', '44444444-4444-4444-4444-444444440009', 'Dry/hoarse voice, talks a lot & fast (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555550902', '44444444-4444-4444-4444-444444440009', 'Sharp, convincing voice, argues well (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555550903', '44444444-4444-4444-4444-444444440009', 'Deep, pleasant voice, speaks slowly & calmly (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 5: SLEEP
-- Q10: Sleep Pattern
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440010', '33333333-3333-3333-3333-333333333333', '5.1 Sleep pattern & depth', 'single', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555551001', '44444444-4444-4444-4444-444444440010', 'Light sleeper, wakes up easily, sleep disturbed (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555551002', '44444444-4444-4444-4444-444444440010', 'Moderate sleep, awakens refreshed (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555551003', '44444444-4444-4444-4444-444444440010', 'Deep, heavy sleeper, sleeps soundly (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 6: COMMON DREAMS
-- Q11: Common Dreams
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440011', '33333333-3333-3333-3333-333333333333', '6.1 Frequent or memorable dreams', 'single', true, 11) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555551101', '44444444-4444-4444-4444-444444440011', 'Flying in sky, running, falling, out of control (Vata)', 1.0, 0.0, 0.0, 1),
('55555555-5555-5555-5555-555555551102', '44444444-4444-4444-4444-444444440011', 'Fire, lightning, bright lights, golden objects (Pitta)', 0.0, 1.0, 0.0, 2),
('55555555-5555-5555-5555-555555551103', '44444444-4444-4444-4444-444444440011', 'Lakes, ponds, lotus flowers, swans, water scenes (Kapha)', 0.0, 0.0, 1.0, 3) ON CONFLICT (id) DO NOTHING;

-- SECTION 7: DĪRGHĀYU LAKṢAṆA — POP-OUT LONGEVITY EVALUATION SUB-QUESTION
INSERT INTO questions (id, questionnaire_id, question_text, question_type, is_required, order_index) VALUES
('44444444-4444-4444-4444-444444440099', '33333333-3333-3333-3333-333333333333', 'Dīrghāyu Lakṣaṇa — Pop-out Longevity Signs (Count Present signs: >=8 Present = Dīrghāyu PRESENT / Longer Lifespan)', 'single', false, 12) ON CONFLICT (id) DO NOTHING;
INSERT INTO question_options (id, question_id, option_text, vata_score, pitta_score, kapha_score, order_index) VALUES
('55555555-5555-5555-5555-555555559901', '44444444-4444-4444-4444-444444440099', 'Dīrghāyu Lakṣaṇa PRESENT (8 or more longevity signs present -> Longer Lifespan)', 0.0, 0.0, 1.0, 1),
('55555555-5555-5555-5555-555555559902', '44444444-4444-4444-4444-444444440099', 'Dīrghāyu Lakṣaṇa ABSENT (Fewer than 8 longevity signs present -> Medium/Shorter Lifespan)', 0.5, 0.5, 0.0, 2) ON CONFLICT (id) DO NOTHING;
