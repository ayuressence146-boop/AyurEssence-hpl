/* ==========================================================================
   AYURESSENCE CLINICAL PRAKRITI ENGINE (v4.2 CCRAS)
   Dynamic Interactive Application Engine
   ========================================================================== */

// --- APPLICATION STATE ---
const state = {
    activeRole: 'doctor', // 'doctor' | 'student'
    currentScreen: 'screen-1',
    activeAssessmentId: 'AE-2026-00142',

    // Clinicians
    clinicians: {
        doctor: { name: 'Dr. Ananya Rao, MD (Ayu)', reg: 'Registration ID: AY-8842' },
        student: { name: 'Rahul Verma (Ayurveda Intern)', reg: 'Student Reg ID: ST-4402' }
    },

    // Patients List
    patients: [
        { id: 'PAT-2026-001', full_name: 'Rajesh Sharma', age: 42, gender: 'male', phone: '+91-9876543210', baseline_history: 'Tikshnagni with sleep disruption and prominent joint movements.' },
        { id: 'PAT-2026-002', full_name: 'Priya Nair', age: 34, gender: 'female', phone: '+91-9876543220', baseline_history: 'Acidity, warm skin tone, goal-driven competitive lifestyle.' },
        { id: 'PAT-2026-003', full_name: 'Sujal Kumar', age: 28, gender: 'male', phone: '+91-9876543212', baseline_history: 'Light sleep, high work stress, fast talkative speech.' },
        { id: 'PAT-2026-004', full_name: 'Ramesh Patel', age: 52, gender: 'male', phone: '+91-9876543233', baseline_history: 'Heavy frame, slow digestion (Mandagni), deep long sleep.' }
    ],

    // Assessments List & Lifecycle
    assessments: [
        {
            id: 'AE-2026-00142',
            patient_id: 'PAT-2026-001',
            patient_name: 'Rajesh Sharma (M/42)',
            practitioner_name: 'Dr. Ananya Rao, MD (Ayu)',
            practitioner_role: 'doctor',
            status: 'REVIEWED', // DRAFT | IN_PROGRESS | SUBMITTED | REVIEWED | FINALIZED
            is_locked: false,
            responses: { q1: 'opt1', q2: 'opt2', q3: 'opt2', q4: 'opt1', q5: 'opt2', q6: 'opt1' },
            scores: { vata: 48.0, pitta: 38.8, kapha: 27.4, total: 114.2 },
            percentages: { vata: 42.0, pitta: 34.0, kapha: 24.0 },
            dominant_prakriti: 'Vāta-Pitta Prakriti (Dvandvaja)',
            pariksha: { nadi: 'pitta', jivha: 'pitta', sparsha: 'pitta', drik: 'pitta' },
            notes: 'Patient exhibits strong Pitta digestion (Tikshnagni) with secondary Vata sleep disruption and prominent joint cracking. Nadi shows Mundukagati bouncing pulse rhythm under stress.'
        },
        {
            id: 'AE-2026-00143',
            patient_id: 'PAT-2026-002',
            patient_name: 'Priya Nair (F/34)',
            practitioner_name: 'Rahul Verma (Intern)',
            practitioner_role: 'student',
            status: 'SUBMITTED',
            is_locked: false,
            responses: { q1: 'opt2', q2: 'opt2', q3: 'opt2', q4: 'opt2', q5: 'opt2', q6: 'opt2' },
            scores: { vata: 20.0, pitta: 70.0, kapha: 10.0, total: 100.0 },
            percentages: { vata: 20.0, pitta: 70.0, kapha: 10.0 },
            dominant_prakriti: 'Pitta Prakriti (Ekadoshaja)',
            pariksha: { nadi: 'pitta', jivha: 'pitta', sparsha: 'pitta', drik: 'pitta' },
            notes: 'Acute Pitta aggravation.'
        }
    ],

    // Questions Catalog (Charaka Samhita Vimanasthana Ch. 8)
    questions: [
        {
            id: 'q1',
            text: '1. What best describes your body frame and physical structure?',
            options: [
                { id: 'opt1', text: 'Slim, thin, light frame, prominent joints (Vāta +12.0, Pitta +4.0, Kapha +2.0)', vata: 12.0, pitta: 4.0, kapha: 2.0 },
                { id: 'opt2', text: 'Medium build, symmetrical, good muscle tone (Vāta +4.0, Pitta +14.0, Kapha +2.0)', vata: 4.0, pitta: 14.0, kapha: 2.0 },
                { id: 'opt3', text: 'Broad, sturdy, heavy frame (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        },
        {
            id: 'q2',
            text: '2. What best describes your skin quality and temperature?',
            options: [
                { id: 'opt1', text: 'Dry, rough, cool to touch (Vāta +14.0, Pitta +4.0, Kapha +2.0)', vata: 14.0, pitta: 4.0, kapha: 2.0 },
                { id: 'opt2', text: 'Warm, reddish tone, prone to acne/sweat (Vāta +6.0, Pitta +12.8, Kapha +4.0)', vata: 6.0, pitta: 12.8, kapha: 4.0 },
                { id: 'opt3', text: 'Smooth, moist, pale/fair skin (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        },
        {
            id: 'q3',
            text: '3. How would you describe your digestive fire (Agni) and appetite?',
            options: [
                { id: 'opt1', text: 'Vishamagni - Irregular hunger/bloating (Vāta +12.0, Pitta +4.0, Kapha +2.0)', vata: 12.0, pitta: 4.0, kapha: 2.0 },
                { id: 'opt2', text: 'Tikshnagni - Intense hunger & fast metabolism (Vāta +10.0, Pitta +14.0, Kapha +1.4)', vata: 10.0, pitta: 14.0, kapha: 1.4 },
                { id: 'opt3', text: 'Mandagni - Slow, constant digestion (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        },
        {
            id: 'q4',
            text: '4. How do you usually sleep at night?',
            options: [
                { id: 'opt1', text: 'Light, interrupted sleep, active dreams (Vāta +14.0, Pitta +4.0, Kapha +6.0)', vata: 14.0, pitta: 4.0, kapha: 6.0 },
                { id: 'opt2', text: 'Moderate sleep, passionate dreams (Vāta +4.0, Pitta +14.0, Kapha +4.0)', vata: 4.0, pitta: 14.0, kapha: 4.0 },
                { id: 'opt3', text: 'Deep, heavy, long sleep (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        },
        {
            id: 'q5',
            text: '5. How do you react to stress or challenging situations?',
            options: [
                { id: 'opt1', text: 'Anxious, fearful, quick to worry (Vāta +14.0, Pitta +4.0, Kapha +2.0)', vata: 14.0, pitta: 4.0, kapha: 2.0 },
                { id: 'opt2', text: 'Impatient, aggressive, sharp tongue (Vāta +4.0, Pitta +14.0, Kapha +2.0)', vata: 4.0, pitta: 14.0, kapha: 2.0 },
                { id: 'opt3', text: 'Calm, patient, steady, tolerant (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        },
        {
            id: 'q6',
            text: '6. What best characterizes your speech and tone of voice?',
            options: [
                { id: 'opt1', text: 'Fast, talkative, high-pitched (Vāta +6.0, Pitta +4.0, Kapha +14.0)', vata: 6.0, pitta: 4.0, kapha: 14.0 },
                { id: 'opt2', text: 'Sharp, clear, precise, authoritative (Vāta +4.0, Pitta +14.0, Kapha +4.0)', vata: 4.0, pitta: 14.0, kapha: 4.0 },
                { id: 'opt3', text: 'Slow, deep, pleasant, melodious (Vāta +2.0, Pitta +4.0, Kapha +14.0)', vata: 2.0, pitta: 4.0, kapha: 14.0 }
            ]
        }
    ]
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderPatientsTable();
    renderRecentAssessments();
    renderQuestionnaireList();
    updateCalculatedBreakdownScreen();
    renderReportView();
});

// --- NAVIGATION & SCREEN SWITCHING ---
function switchScreen(screenId) {
    state.currentScreen = screenId;
    
    // Hide all views & remove sidebar active state
    document.querySelectorAll('.screen-view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(screenId).classList.add('active');
    const navBtn = document.querySelector(`[data-screen="${screenId}"]`);
    if (navBtn) navBtn.classList.add('active');

    // Update Topbar Code & Title
    const codeTag = document.getElementById('screenCodeTag');
    const titleHeading = document.getElementById('screenTitleHeading');
    const stickyFooter = document.getElementById('ccrasStickyFooter');

    if (screenId === 'screen-1') {
        codeTag.innerText = 'SCREEN_1_PATIENT_DASHBOARD';
        titleHeading.innerText = 'Patient Directory & Clinical Dashboard';
        stickyFooter.style.display = 'none';
        renderPatientsTable();
        renderRecentAssessments();
    } else if (screenId === 'screen-2') {
        codeTag.innerText = 'SCREEN_2_PRAKRITI_BREAKDOWN';
        titleHeading.innerText = 'Deterministic Prakriti Scoring & Algorithmic Breakdown';
        stickyFooter.style.display = 'flex';
        updateCalculatedBreakdownScreen();
    } else if (screenId === 'screen-3') {
        codeTag.innerText = 'SCREEN_3_QUESTIONNAIRE_INTERFACE';
        titleHeading.innerText = 'Charaka Samhitā Classical Prakriti Questionnaire';
        stickyFooter.style.display = 'none';
        renderQuestionnaireList();
    } else if (screenId === 'screen-4') {
        codeTag.innerText = 'SCREEN_4_CLINICAL_OBSERVATIONS';
        titleHeading.innerText = 'Astavidha & Dashavidha Clinical Pariksha';
        stickyFooter.style.display = 'none';
    } else if (screenId === 'screen-5') {
        codeTag.innerText = 'SCREEN_5_FINALIZED_REPORT';
        titleHeading.innerText = 'Clinical Assessment Report & Immutability Ledger';
        stickyFooter.style.display = 'none';
        renderReportView();
    }
}

function switchRole(role) {
    state.activeRole = role;
    const info = state.clinicians[role];
    document.getElementById('clinicianNameText').innerText = info.name;
    document.getElementById('clinicianRegText').innerText = info.reg;
    renderReportView();
}

// --- RENDER PATIENTS & ASSESSMENTS ---
function renderPatientsTable() {
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = state.patients.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.full_name}</td>
            <td>${p.age} / ${p.gender.toUpperCase()}</td>
            <td>${p.phone}</td>
            <td>${p.baseline_history}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="initiateAssessmentForPatient('${p.id}')">
                    <i class="fa-solid fa-stethoscope"></i> Start Assessment
                </button>
            </td>
        </tr>
    `).join('');
}

function filterPatientsTable() {
    const gender = document.getElementById('genderFilter').value;
    const filtered = gender ? state.patients.filter(p => p.gender === gender) : state.patients;
    
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.full_name}</td>
            <td>${p.age} / ${p.gender.toUpperCase()}</td>
            <td>${p.phone}</td>
            <td>${p.baseline_history}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="initiateAssessmentForPatient('${p.id}')">
                    <i class="fa-solid fa-stethoscope"></i> Start Assessment
                </button>
            </td>
        </tr>
    `).join('');
}

function renderRecentAssessments() {
    const tbody = document.getElementById('recentAssessmentsBody');
    tbody.innerHTML = state.assessments.map(asm => `
        <tr>
            <td><strong>${asm.id}</strong></td>
            <td>${asm.patient_name}</td>
            <td>${asm.practitioner_name}</td>
            <td><span class="badge badge-${asm.status.toLowerCase()}">${asm.status}</span></td>
            <td><strong style="color: var(--color-tertiary-accent)">${asm.dominant_prakriti}</strong></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="loadAssessment('${asm.id}')">
                    <i class="fa-solid fa-folder-open"></i> Open
                </button>
            </td>
        </tr>
    `).join('');
}

// --- QUESTIONNAIRE RENDER & LOGIC ---
function renderQuestionnaireList() {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId) || state.assessments[0];
    
    document.getElementById('qPatName').innerText = asm.patient_name;
    document.getElementById('qAsmId').innerText = asm.id;
    document.getElementById('qStatusBadge').innerText = asm.status;
    document.getElementById('qStatusBadge').className = `badge badge-${asm.status.toLowerCase()}`;

    const container = document.getElementById('questionnaireListContainer');
    container.innerHTML = state.questions.map((q, idx) => {
        const selectedOpt = asm.responses[q.id];
        return `
            <div class="question-item-card">
                <div class="q-title">
                    <span class="q-badge">${idx + 1}</span>
                    <span>${q.text}</span>
                </div>
                <div class="q-options-group">
                    ${q.options.map(opt => `
                        <label class="q-opt-label ${selectedOpt === opt.id ? 'selected' : ''}">
                            <input type="radio" name="${q.id}" value="${opt.id}" 
                                ${selectedOpt === opt.id ? 'checked' : ''} 
                                ${asm.is_locked ? 'disabled' : ''}
                                onchange="recordQuestionResponse('${q.id}', '${opt.id}')">
                            <span>${opt.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    const answeredCount = Object.keys(asm.responses).length;
    const totalCount = state.questions.length;
    const pct = Math.round((answeredCount / totalCount) * 100);

    document.getElementById('qCountText').innerText = `Question ${answeredCount} of ${totalCount} Answered`;
    document.getElementById('qPercentText').innerText = `${pct}% Complete`;
    document.getElementById('qProgressFill').style.width = `${pct}%`;
}

function recordQuestionResponse(qId, optId) {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId);
    if (asm.is_locked) {
        alert("409 Conflict: Assessment is FINALIZED and read-only.");
        return;
    }

    asm.responses[qId] = optId;
    if (asm.status === 'DRAFT') asm.status = 'IN_PROGRESS';
    
    recalculateScores(asm);
    renderQuestionnaireList();
}

// --- DETERMINISTIC SCORING ENGINE ---
function recalculateScores(asm) {
    let vataSum = 0;
    let pittaSum = 0;
    let kaphaSum = 0;

    state.questions.forEach(q => {
        const selectedOptId = asm.responses[q.id];
        if (selectedOptId) {
            const opt = q.options.find(o => o.id === selectedOptId);
            if (opt) {
                vataSum += opt.vata;
                pittaSum += opt.pitta;
                kaphaSum += opt.kapha;
            }
        }
    });

    const grandTotal = vataSum + pittaSum + kaphaSum || 100.0;
    const vPct = parseFloat(((vataSum / grandTotal) * 100).toFixed(1));
    const pPct = parseFloat(((pittaSum / grandTotal) * 100).toFixed(1));
    const kPct = parseFloat(((kaphaSum / grandTotal) * 100).toFixed(1));

    let dominant = 'Vāta-Pitta Prakriti (Dvandvaja)';
    if (vPct >= pPct && vPct >= kPct) {
        dominant = pPct > 25 ? 'Vāta-Pitta Prakriti (Dvandvaja)' : 'Vāta Prakriti (Ekadoshaja)';
    } else if (pPct >= vPct && pPct >= kPct) {
        dominant = kPct > 25 ? 'Pitta-Kapha Prakriti (Dvandvaja)' : 'Pitta Prakriti (Ekadoshaja)';
    } else {
        dominant = vPct > 25 ? 'Kapha-Vāta Prakriti (Dvandvaja)' : 'Kapha Prakriti (Ekadoshaja)';
    }

    asm.scores = { vata: vataSum, pitta: pittaSum, kapha: kaphaSum, total: grandTotal };
    asm.percentages = { vata: vPct, pitta: pPct, kapha: kPct };
    asm.dominant_prakriti = dominant;
}

function updateCalculatedBreakdownScreen() {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId) || state.assessments[0];
    
    document.getElementById('activeAsmIdText').innerText = asm.id;
    document.getElementById('activePatNameText').innerText = asm.patient_name;

    // Scores
    document.getElementById('vataPtsVal').innerText = asm.scores.vata.toFixed(1);
    document.getElementById('pittaPtsVal').innerText = asm.scores.pitta.toFixed(1);
    document.getElementById('kaphaPtsVal').innerText = asm.scores.kapha.toFixed(1);

    // Percentages & Gauges
    document.getElementById('vataPercentDisp').innerText = `${asm.percentages.vata}%`;
    document.getElementById('pittaPercentDisp').innerText = `${asm.percentages.pitta}%`;
    document.getElementById('kaphaPercentDisp').innerText = `${asm.percentages.kapha}%`;

    // SVG Gauge Offsets (Circumference: 408.4)
    document.getElementById('vataGaugeCircle').style.strokeDashoffset = 408.4 - (408.4 * (asm.percentages.vata / 100));
    document.getElementById('pittaGaugeCircle').style.strokeDashoffset = 408.4 - (408.4 * (asm.percentages.pitta / 100));
    document.getElementById('kaphaGaugeCircle').style.strokeDashoffset = 408.4 - (408.4 * (asm.percentages.kapha / 100));

    // Verdict
    document.getElementById('verdictPrakritiText').innerText = asm.dominant_prakriti;

    // Proportion Bar
    document.getElementById('vataSegBar').style.width = `${asm.percentages.vata}%`;
    document.getElementById('vataSegText').innerText = `Vāta ${asm.percentages.vata}%`;

    document.getElementById('pittaSegBar').style.width = `${asm.percentages.pitta}%`;
    document.getElementById('pittaSegText').innerText = `Pitta ${asm.percentages.pitta}%`;

    document.getElementById('kaphaSegBar').style.width = `${asm.percentages.kapha}%`;
    document.getElementById('kaphaSegText').innerText = `Kapha ${asm.percentages.kapha}%`;

    // Formulas
    document.getElementById('vataMathForm').innerHTML = `\\text{Vata \\%} = \\frac{${asm.scores.vata.toFixed(1)}}{${asm.scores.total.toFixed(1)}} \\times 100 = \\mathbf{${asm.percentages.vata}\\%}`;
    document.getElementById('pittaMathForm').innerHTML = `\\text{Pitta \\%} = \\frac{${asm.scores.pitta.toFixed(1)}}{${asm.scores.total.toFixed(1)}} \\times 100 = \\mathbf{${asm.percentages.pitta}\\%}`;
    document.getElementById('kaphaMathForm').innerHTML = `\\text{Kapha \\%} = \\frac{${asm.scores.kapha.toFixed(1)}}{${asm.scores.total.toFixed(1)}} \\times 100 = \\mathbf{${asm.percentages.kapha}\\%}`;
}

function recalculateAndProceedToBreakdown() {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId);
    asm.notes = document.getElementById('parikshaNotes').value;
    recalculateScores(asm);
    switchScreen('screen-2');
}

// --- REPORT VIEW & IMMUTABILITY STEPPER ---
function renderReportView() {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId) || state.assessments[0];
    
    document.getElementById('reportStateBadge').className = `badge badge-${asm.status.toLowerCase()}`;
    document.getElementById('reportStateBadge').innerText = `State: ${asm.status}`;

    document.getElementById('repReportId').innerText = asm.id;
    document.getElementById('repPatName').innerText = asm.patient_name;
    document.getElementById('repDocName').innerText = state.clinicians[state.activeRole].name;
    document.getElementById('repDocRole').innerText = state.activeRole.toUpperCase();

    document.getElementById('repVataPct').innerText = `${asm.percentages.vata}%`;
    document.getElementById('repPittaPct').innerText = `${asm.percentages.pitta}%`;
    document.getElementById('repKaphaPct').innerText = `${asm.percentages.kapha}%`;
    document.getElementById('repVerdictText').innerText = asm.dominant_prakriti;
    document.getElementById('repNotesParagraph').innerText = asm.notes;

    if (asm.is_locked) {
        document.getElementById('repLockBadge').className = 'badge badge-locked';
        document.getElementById('repLockBadge').innerText = 'FINALIZED & IMMUTABLE';
    } else {
        document.getElementById('repLockBadge').className = 'badge badge-unlocked';
        document.getElementById('repLockBadge').innerText = 'EDITABLE';
    }

    updateStateNodes(asm.status);
    renderStepperActions(asm);
}

function updateStateNodes(status) {
    const states = ['DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'REVIEWED', 'FINALIZED'];
    const idx = states.indexOf(status);

    document.getElementById('nodeDraft').className = idx >= 0 ? 'step-node active' : 'step-node';
    document.getElementById('nodeInProgress').className = idx >= 1 ? 'step-node active' : 'step-node';
    document.getElementById('nodeSubmitted').className = idx >= 2 ? 'step-node active' : 'step-node';
    document.getElementById('nodeReviewed').className = idx >= 3 ? 'step-node active' : 'step-node';
    document.getElementById('nodeFinalized').className = idx >= 4 ? 'step-node active' : 'step-node';
}

function renderStepperActions(asm) {
    const container = document.getElementById('stepperActionsContainer');
    container.innerHTML = '';

    if (asm.is_locked) {
        container.innerHTML = `<span class="badge badge-locked"><i class="fa-solid fa-lock"></i> Report Finalized & Locked. Re-evaluation requires initiating a new assessment version.</span>`;
        return;
    }

    if (asm.status === 'DRAFT' || asm.status === 'IN_PROGRESS') {
        container.innerHTML += `<button class="btn btn-primary" onclick="transitionState('SUBMITTED')"><i class="fa-solid fa-paper-plane"></i> Submit Assessment</button>`;
    }

    if (asm.status === 'SUBMITTED') {
        container.innerHTML += `<button class="btn btn-secondary" onclick="transitionState('REVIEWED')"><i class="fa-solid fa-user-check"></i> Review Assessment</button>`;
    }

    if (asm.status === 'REVIEWED' || asm.status === 'SUBMITTED') {
        if (state.activeRole === 'doctor') {
            container.innerHTML += `<button class="btn btn-primary" style="background: var(--color-primary-container)" onclick="transitionState('FINALIZED')"><i class="fa-solid fa-shield-check"></i> Finalize Report (Immutable Lock)</button>`;
        } else {
            container.innerHTML += `<span class="text-muted"><i class="fa-solid fa-circle-info"></i> Only Doctor roles can Finalize this assessment report.</span>`;
        }
    }
}

function transitionState(nextState) {
    const asm = state.assessments.find(a => a.id === state.activeAssessmentId);
    if (nextState === 'FINALIZED') {
        if (state.activeRole !== 'doctor') {
            alert('403 Forbidden: Student roles cannot finalize assessments.');
            return;
        }
        asm.is_locked = true;
    }
    asm.status = nextState;
    renderReportView();
    alert(`Assessment ${asm.id} transitioned to state: ${nextState}!`);
}

// --- HELPER FUNCTIONS ---
function loadAssessment(asmId) {
    state.activeAssessmentId = asmId;
    switchScreen('screen-2');
}

function initiateAssessmentForPatient(patientId) {
    const pat = state.patients.find(p => p.id === patientId);
    const newAsm = {
        id: `AE-2026-00${state.assessments.length + 144}`,
        patient_id: patientId,
        patient_name: `${pat.full_name} (${pat.gender.toUpperCase()}/${pat.age})`,
        practitioner_name: state.clinicians[state.activeRole].name,
        practitioner_role: state.activeRole,
        status: 'DRAFT',
        is_locked: false,
        responses: {},
        scores: { vata: 0, pitta: 0, kapha: 0, total: 100 },
        percentages: { vata: 33.3, pitta: 33.3, kapha: 33.4 },
        dominant_prakriti: 'SAMA-PRAKRITI',
        pariksha: { nadi: 'pitta', jivha: 'pitta', sparsha: 'pitta', drik: 'pitta' },
        notes: ''
    };
    state.assessments.unshift(newAsm);
    state.activeAssessmentId = newAsm.id;
    switchScreen('screen-3');
}

function handleCreatePatient(e) {
    e.preventDefault();
    const name = document.getElementById('pName').value;
    const age = parseInt(document.getElementById('pAge').value);
    const gender = document.getElementById('pGender').value;
    const phone = document.getElementById('pPhone').value;
    const history = document.getElementById('pHistory').value;

    const newPat = {
        id: `PAT-2026-00${state.patients.length + 1}`,
        full_name: name,
        age,
        gender,
        phone,
        baseline_history: history || 'No baseline notes recorded.'
    };
    state.patients.push(newPat);
    closeModal('newPatientModal');
    renderPatientsTable();
    alert(`Patient ${name} registered successfully with ID ${newPat.id}!`);
}

function handleCreateAssessment(e) {
    e.preventDefault();
    const patId = document.getElementById('selectPatientId').value;
    initiateAssessmentForPatient(patId);
    closeModal('newAssessmentModal');
}

function handleGlobalSearch(query) {
    console.log('Global search:', query);
}

function openShlokaModal() { document.getElementById('shlokaModal').classList.add('active'); }
function openNewPatientModal() { document.getElementById('newPatientModal').classList.add('active'); }
function openNewAssessmentModal() {
    const sel = document.getElementById('selectPatientId');
    sel.innerHTML = state.patients.map(p => `<option value="${p.id}">${p.full_name} (${p.id})</option>`).join('');
    document.getElementById('newAssessmentModal').classList.add('active');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function exportLedgerCSV() {
    const csvRows = [
        ["Criteria Domain", "Lakshana Category", "Observations", "Vata Pts", "Pitta Pts", "Kapha Pts", "Shloka Citation"],
        ["1. Body Structure & Joints", "Anatomical Frame", "Lean body structure, prominent joints, dry skin", "12.0", "4.0", "2.0", "Vimāna 8.98 / Vāta"],
        ["2. Digestive Fire & Agni", "Physiological Function", "Tikshnagni paired with Vishamagni", "10.0", "14.0", "1.4", "Vimāna 8.97 / Pitta"],
        ["3. Skin, Complexion & Heat", "Thermal & Tactile", "Warm body temperature, sweating tendency", "6.0", "12.8", "4.0", "Vimāna 8.97 / Pitta"],
        ["4. Sleep & Mental Activity", "Psychological & Manasa", "Light interrupted sleep, quick learning", "14.0", "4.0", "6.0", "Vimāna 8.98 / Vāta"],
        ["5. Joint Movements & Voice", "Motor & Acoustic", "Sandhi Sphutana cracking joints, clear speech", "6.0", "4.0", "14.0", "Vimāna 8.96 / Kapha"]
    ];
    let csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AyurEssence_Lakshana_Ledger_${state.activeAssessmentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openAdjustmentLog() {
    alert("Adjustment Log: 0 practitioner adjustments made. Algorithmic scores are 100% deterministic under CCRAS-PRKRITI-001-v1.0.");
}

function flagForRescoring() {
    const reason = prompt(`Enter clinical reason for flagging assessment ${state.activeAssessmentId} for rescoring:`);
    if (reason) {
        alert(`Assessment ${state.activeAssessmentId} flagged for rescoring. Reason logged: "${reason}"`);
    }
}
