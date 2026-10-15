/* ==================== CONFIG & STATE ==================== */

const GEMINI_API_KEY = ""; // Insert Gemini API Key here if using direct REST calls

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;



/// Quiz Questions Data (10 English Assessment Questions)

const quizData = [

  {

    id: 1,

    question: "Which of the following statements best describes how a computer processes tasks despite not possessing human-like intelligence?",

    options: [

      "It makes creative decisions by dynamically reinterpreting human intent.",

      "It executes precise, pre-defined sequences of instructions without independent reasoning.",

      "It relies entirely on high-level application software to operate without hardware involvement.",

      "It uses self-aware algorithms to infer missing program logic."

    ],

    correct_index: 1,

    explanation: "A computer is an execution machine. It lacks independent cognition, reasoning, or creativity, and relies entirely on executing deterministic, precise instructions provided to it."

  },

  {

    id: 2,

    question: "In the fundamental Input → Processing → Output model, what is the specific role of the Processing stage?",

    options: [

      "Translating user physical actions into external physical energy.",

      "Capturing raw signals directly from the physical environment.",

      "Manipulating, calculating, or transforming input data according to defined rules.",

      "Permanently archiving user files across power cycles."

    ],

    correct_index: 2,

    explanation: "The Processing stage takes captured input data and manipulates, transforms, or computes it according to programmed rules before producing an output."

  },

  {

    id: 3,

    question: "How does an Operating System (OS) differ from Application Software?",

    options: [

      "The OS directly performs end-user tasks like document editing, while applications manage hardware components.",

      "The OS manages hardware resources and coordinates device access, providing an abstraction layer for applications to run.",

      "Applications can run directly on electronic circuits without requiring an OS or firmware layer.",

      "The OS is stored permanently inside the CPU registers, whereas applications reside exclusively on secondary storage."

    ],

    correct_index: 1,

    explanation: "An Operating System manages hardware components (CPU, memory, storage, I/O) and provides system services and interfaces that allow application software to execute."

  },

  {

    id: 4,

    question: "Why are CPU Registers positioned at the very top of the memory hierarchy?",

    options: [

      "They provide the largest storage capacity in the entire computer system.",

      "They retain stored values permanently even when main power is completely disconnected.",

      "They are located directly inside the processor core, offering the fastest data access speeds for active operations.",

      "They replace the need for Random Access Memory (RAM) during application execution."

    ],

    correct_index: 2,

    explanation: "Registers are tiny, high-speed storage locations residing directly inside the CPU core, making them the fastest memory location available for current operational data."

  },

  {

    id: 5,

    question: "Which trade-off characterizes the relationship between Cache, RAM, and Secondary Storage?",

    options: [

      "Secondary storage is faster and more expensive per byte than Cache.",

      "RAM is faster than Cache but offers significantly smaller storage capacities.",

      "Cache is faster and closer to the CPU than RAM, but has smaller capacity and higher cost per byte.",

      "Registers and Secondary Storage share identical access speeds and volatility characteristics."

    ],

    correct_index: 2,

    explanation: "The memory hierarchy trades off speed, capacity, and cost: Cache is faster and closer to the CPU than RAM, but it is more expensive per byte and smaller in capacity."

  },

  {

    id: 6,

    question: "Which components comprise the core functional blocks of a Central Processing Unit (CPU)?",

    options: [

      "Arithmetic Logic Unit (ALU), Control Unit (CU), and internal Registers.",

      "Secondary Storage, System Buses, and Display Controller.",

      "Solid State Drive (SSD), Operating System Kernel, and RAM.",

      "Firmware Chip, Input Devices, and Logic Gates."

    ],

    correct_index: 0,

    explanation: "A standard CPU core primarily consists of the Arithmetic Logic Unit (ALU) for arithmetic/logic operations, the Control Unit (CU) for instruction sequencing/decoding, and internal Registers for immediate data storage."

  },

  {

    id: 7,

    question: "What is the primary function of the Control Unit (CU) during processor operation?",

    options: [

      "Performing floating-point mathematical calculations and comparisons.",

      "Fetching, decoding, and orchestrating the flow of data and execution signals across components.",

      "Providing long-term, non-volatile file storage for application data.",

      "Converting digital signals directly into visual pixels on a screen."

    ],

    correct_index: 1,

    explanation: "The Control Unit directs the operation of the processor by fetching instructions, decoding their operational codes, and generating control signals to coordinate data movement and processing."

  },

  {

    id: 8,

    question: "How are System Buses used within computer architecture?",

    options: [

      "They act as microscopic physical switches that switch between high and low voltage states.",

      "They serve as electrical pathways that transmit data, addresses, and control signals between system components.",

      "They execute complex arithmetic instructions when the ALU is fully saturated.",

      "They manage user authentication and operating system permissions."

    ],

    correct_index: 1,

    explanation: "System Buses are conductive electrical pathways (data bus, address bus, control bus) used to transfer signals and data between the CPU, memory, and I/O controllers."

  },

  {

    id: 9,

    question: "Which statement correctly describes the relationship between Transistors, Logic Gates, and Binary Representation?",

    options: [

      "A single transistor is structurally identical to a multi-input logic gate.",

      "Transistors act as electronic switches whose switching behavior is used to build logic gates, which process binary states.",

      "Logic gates are physical power supplies that feed binary digits directly to the operating system.",

      "Binary representation is only used in high-level software and is converted to decimal inside transistors."

    ],

    correct_index: 1,

    explanation: "Transistors are electronic switching components. Combining multiple transistors forms digital logic gates (e.g., AND, OR, NOT), which process signals representing binary states (0 and 1)."

  },

  {

    id: 10,

    question: "In the simplified Instruction Execution Cycle, what occurs during the Decode phase?",

    options: [

      "The instruction opcode is interpreted by the Control Unit to determine the required operation and operands.",

      "The next instruction is retrieved from main memory (RAM) over the system bus.",

      "The ALU calculates the mathematical result and writes it directly to secondary storage.",

      "The final output signal is rendered to an external display device."

    ],

    correct_index: 0,

    explanation: "During the Decode phase, the Control Unit interprets the fetched instruction's operational code (opcode) to identify what operation needs to be performed and which operands or registers are involved."

  }

];



/* ==================== CENTRALIZED QUIZ CONFIG & STATE ==================== */

const GOOGLE_SHEETS_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwjfseAZcYl2P4V8NmraceknWRWBM_ran_2lGehxnTEApPMPOMT7OAG6gqJClq3zL8kgw/exec';

const QUIZ_STORAGE_KEY = 'nexus_session_01_quiz_state';



const quizState = {

  phase: 'REGISTER', // 'IDLE' | 'REGISTER' | 'IN_PROGRESS' | 'SUBMITTING' | 'COMPLETED' | 'REVIEW'

  student: {

    fullName: '',

    phone: ''

  },

  sessionId: 'NEXUS-LVL1-SEC01',

  attemptId: '',

  currentQuestion: 0,

  answers: quizData.map(q => ({ questionId: q.id, selectedIndex: null })),

  startTime: null,

  submissionTime: null,

  timeTaken: null,

  score: 0,

  submitted: false

};



/* ==================== INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', () => {

  initNavigation();

  initTabs();

  initializeQuiz();

  initChatbot();


});



/* ==================== NAVIGATION ==================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'فتح القائمة');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
}

/* ==================== TABS SYSTEM ==================== */
function initTabs() {
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabContents = document.querySelectorAll('.tab-content');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  function activateTab(btn, moveFocus) {
    const targetTab = btn.getAttribute('data-tab');

    tabBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      b.tabIndex = isActive ? 0 : -1;
    });
    tabContents.forEach(c => c.classList.toggle('active', c.id === targetTab));

    document.dispatchEvent(new CustomEvent('lx:tab', { detail: { index: tabBtns.indexOf(btn) } }));

    if (moveFocus) btn.focus();
    btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: scrollBehavior });
  }

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => activateTab(btn, false));

    btn.addEventListener('keydown', (e) => {
      const rtl = document.documentElement.dir === 'rtl';
      let next = null;
      if (e.key === 'ArrowLeft') next = rtl ? index + 1 : index - 1;
      else if (e.key === 'ArrowRight') next = rtl ? index - 1 : index + 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabBtns.length - 1;
      if (next === null) return;
      e.preventDefault();
      activateTab(tabBtns[(next + tabBtns.length) % tabBtns.length], true);
    });
  });

  document.querySelectorAll('[data-next-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = tabBtns.find(t => t.dataset.tab === btn.dataset.nextTab);
      if (!target) return;
      activateTab(target, false);
      const tabs = document.getElementById('modulesTabs');
      if (tabs) tabs.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      const panel = document.getElementById(target.dataset.tab);
      if (panel) panel.focus({ preventScroll: true });
    });
  });
}

/* ==================== QUIZ SYSTEM ==================== */



/**

 * Generates a unique Attempt ID using crypto.randomUUID() with a safe fallback.

 */

function generateAttemptId() {

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {

    return crypto.randomUUID();

  }

  return 'att_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);

}



/**

 * Persists current quiz state to sessionStorage.

 */

function saveQuizState() {

  try {

    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizState));

  } catch (err) {

    console.warn('Unable to persist quiz state to sessionStorage:', err);

  }

}



/**

 * Restores quiz state from sessionStorage if available.

 */

function loadSavedQuizState() {

  try {

    const saved = sessionStorage.getItem(QUIZ_STORAGE_KEY);

    if (saved) {

      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === 'object') {

        // Ensure answers array is well-formed

        if (Array.isArray(parsed.answers)) {

          // Normalize answers structure if loaded from older format

          parsed.answers = quizData.map((q, idx) => {

            const existing = parsed.answers[idx];

            if (typeof existing === 'number') {

              return { questionId: q.id, selectedIndex: existing };

            } else if (existing && typeof existing === 'object') {

              return { questionId: q.id, selectedIndex: existing.selectedIndex ?? null };

            }

            return { questionId: q.id, selectedIndex: null };

          });

        }

        Object.assign(quizState, parsed);

        return true;

      }

    }

  } catch (err) {

    console.warn('Unable to read saved quiz state:', err);

  }

  return false;

}



/**

 * Calculates human-readable duration between two ISO timestamp strings.

 */

function formatDuration(startIso, endIso) {

  if (!startIso || !endIso) return 'N/A';

  const diffMs = Math.max(0, new Date(endIso) - new Date(startIso));

  const totalSec = Math.floor(diffMs / 1000);

  const min = Math.floor(totalSec / 60);

  const sec = totalSec % 60;

  if (min === 0) return `${sec}s`;

  return `${min}m ${sec}s`;

}



/**

 * Helper to get selected option index for a question index.

 */

function getSelectedAnswer(questionIndex) {

  if (!quizState.answers[questionIndex]) return null;

  return quizState.answers[questionIndex].selectedIndex;

}



/**

 * Helper to set selected option index for a question index.

 */

function setSelectedAnswer(questionIndex, optionIndex) {

  if (!quizState.answers[questionIndex]) {

    quizState.answers[questionIndex] = { questionId: quizData[questionIndex].id, selectedIndex: optionIndex };

  } else {

    quizState.answers[questionIndex].selectedIndex = optionIndex;

  }

}



/**

 * Main Quiz Engine Initializer.

 */

function initializeQuiz() {

  const hasSaved = loadSavedQuizState();



  if (hasSaved && quizState.submitted) {

    quizState.phase = 'COMPLETED';

  } else if (!hasSaved) {

    quizState.phase = 'REGISTER';

  }



  initializeRegistration();

  initializeQuizControls();

  renderQuizView();

}



/**

 * Initializes Registration form listener and validation.

 */

function initializeRegistration() {

  const regForm = document.getElementById('quizRegForm');

  if (regForm) {

    regForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const nameInput = document.getElementById('studentFullName');

      const phoneInput = document.getElementById('studentPhone');

      const errorBox = document.getElementById('quizRegError');



      const fullName = (nameInput ? nameInput.value : '').trim();

      const phone = (phoneInput ? phoneInput.value : '').trim();



      // Validate Full Name (required, non-empty, trimmed)

      if (!fullName || fullName.length < 2) {

        showError(errorBox, 'Please enter your Full Name (minimum 2 characters).');

        if (nameInput) nameInput.focus();

        return;

      }



      // Validate Phone Number (required, non-empty, trimmed)

      if (!phone || phone.length < 5) {

        showError(errorBox, 'Please enter a valid Phone Number.');

        if (phoneInput) phoneInput.focus();

        return;

      }



      hideError(errorBox);

      startQuiz(fullName, phone);

    });

  }

}



/**

 * Starts the active quiz session after valid registration.

 */

function startQuiz(fullName, phone) {

  quizState.student.fullName = fullName;

  quizState.student.phone = phone;

  quizState.attemptId = generateAttemptId();

  quizState.startTime = new Date().toISOString();

  quizState.submissionTime = null;

  quizState.timeTaken = null;

  quizState.currentQuestion = 0;

  quizState.answers = quizData.map(q => ({ questionId: q.id, selectedIndex: null }));

  quizState.submitted = false;

  quizState.score = 0;

  quizState.phase = 'IN_PROGRESS';



  saveQuizState();

  renderQuizView();

}



/**

 * Binds Next, Previous, Submit, Review, and Back-to-Result buttons.

 */

function initializeQuizControls() {

  const prevBtn = document.getElementById('prevBtn');

  const nextBtn = document.getElementById('nextBtn');

  const submitBtn = document.getElementById('submitQuizBtn');

  const viewReviewBtn = document.getElementById('viewReviewBtn');

  const backToResultBtn = document.getElementById('backToResultBtn');



  if (prevBtn) {

    prevBtn.addEventListener('click', previousQuestion);

  }



  if (nextBtn) {

    nextBtn.addEventListener('click', nextQuestion);

  }



  if (submitBtn) {

    submitBtn.addEventListener('click', submitQuiz);

  }



  if (viewReviewBtn) {

    viewReviewBtn.addEventListener('click', showReview);

  }



  if (backToResultBtn) {

    backToResultBtn.addEventListener('click', showResults);

  }

}



/**

 * Displays error message in a container element.

 */

function showError(el, message) {

  if (!el) return;

  el.textContent = message;

  el.classList.remove('hidden');

}



/**

 * Hides and clears an error container element.

 */

function hideError(el) {

  if (!el) return;

  el.textContent = '';

  el.classList.add('hidden');

}



/**

 * Renders the container view corresponding to the current phase.

 */

function renderQuizView() {

  const regView = document.getElementById('quizRegisterView');

  const questionView = document.getElementById('quizQuestionView');

  const submittingView = document.getElementById('quizSubmittingView');

  const completedView = document.getElementById('quizCompletedView');

  const reviewView = document.getElementById('quizReviewView');



  // Hide all views first

  [regView, questionView, submittingView, completedView, reviewView].forEach(v => {

    if (v) v.classList.add('hidden');

  });



  switch (quizState.phase) {

    case 'REGISTER':

    case 'IDLE':

      if (regView) regView.classList.remove('hidden');

      break;



    case 'IN_PROGRESS':

      if (questionView) {

        questionView.classList.remove('hidden');

        renderQuestion(quizState.currentQuestion);

      }

      break;



    case 'SUBMITTING':

      if (submittingView) submittingView.classList.remove('hidden');

      break;



    case 'COMPLETED':

      if (completedView) {

        completedView.classList.remove('hidden');

        renderCompletedView();

      }

      break;



    case 'REVIEW':

      if (reviewView) {

        reviewView.classList.remove('hidden');

        renderReviewView();

      }

      break;



    default:

      if (regView) regView.classList.remove('hidden');

      break;

  }

}



/**

 * Renders the question at the specified index.

 */

function renderQuestion(index) {

  if (index < 0 || index >= quizData.length) return;

  quizState.currentQuestion = index;

  const q = quizData[index];



  // Update Meta Info

  const studentTag = document.getElementById('quizStudentTag');

  const qNumEl = document.getElementById('questionNumber');

  const progressFill = document.getElementById('quizProgressFill');

  const progressBar = document.getElementById('quizProgressBar');

  const qText = document.getElementById('questionText');

  const optionsGrid = document.getElementById('optionsGrid');

  const validationAlert = document.getElementById('quizValidationAlert');



  if (studentTag) {

    studentTag.innerHTML = `<i class="fa-solid fa-user-graduate"></i> ${escapeHtml(quizState.student.fullName || 'Student')}`;

  }



  if (qNumEl) {

    qNumEl.textContent = `Question ${index + 1} of ${quizData.length}`;

  }



  const progressPercent = Math.round(((index + 1) / quizData.length) * 100);

  if (progressFill) {

    progressFill.style.width = `${progressPercent}%`;

  }

  if (progressBar) {

    progressBar.setAttribute('aria-valuenow', progressPercent);

  }



  if (qText) {

    qText.textContent = q.question;

  }



  // Clear any existing validation warning

  hideError(validationAlert);



  // Render Navigation Pills

  renderNavPills();



  // Render Options

  if (optionsGrid) {

    optionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];

    const currentSelected = getSelectedAnswer(index);



    q.options.forEach((optText, optIdx) => {

      const btn = document.createElement('button');

      btn.type = 'button';

      btn.className = 'option-btn';

      btn.setAttribute('role', 'radio');

      const isSelected = currentSelected === optIdx;

      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');



      if (isSelected) {

        btn.classList.add('selected');

      }



      if (quizState.submitted) {

        btn.disabled = true;

      }



      btn.innerHTML = `

        <span class="option-indicator">${letters[optIdx]}</span>

        <span>${escapeHtml(optText)}</span>

      `;



      btn.addEventListener('click', () => {

        selectAnswer(index, optIdx);

      });



      optionsGrid.appendChild(btn);

    });

  }



  // Update Action Buttons

  const prevBtn = document.getElementById('prevBtn');

  const nextBtn = document.getElementById('nextBtn');

  const submitBtn = document.getElementById('submitQuizBtn');



  if (prevBtn) {

    prevBtn.disabled = index === 0;

    prevBtn.style.opacity = index === 0 ? '0.4' : '1';

    prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';

  }



  const isLastQuestion = index === quizData.length - 1;

  if (nextBtn) {

    nextBtn.classList.toggle('hidden', isLastQuestion);

  }

  if (submitBtn) {

    submitBtn.classList.toggle('hidden', !isLastQuestion);

  }

}



/**

 * Handles selecting an answer without revealing correctness.

 */

function selectAnswer(questionIndex, optionIndex) {

  if (quizState.submitted) return; // Prevent modification if submitted



  setSelectedAnswer(questionIndex, optionIndex);

  saveQuizState();



  // Update UI selection state neutrally (no green/red, no explanation)

  const optionButtons = document.querySelectorAll('#optionsGrid .option-btn');

  optionButtons.forEach((btn, idx) => {

    const isSelected = idx === optionIndex;

    btn.classList.toggle('selected', isSelected);

    btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');

  });



  renderNavPills();



  const validationAlert = document.getElementById('quizValidationAlert');

  hideError(validationAlert);

}



/**

 * Moves to the next question.

 */

function nextQuestion() {

  if (quizState.currentQuestion < quizData.length - 1) {

    quizState.currentQuestion++;

    renderQuestion(quizState.currentQuestion);

    saveQuizState();

  }

}



/**

 * Moves to the previous question.

 */

function previousQuestion() {

  if (quizState.currentQuestion > 0) {

    quizState.currentQuestion--;

    renderQuestion(quizState.currentQuestion);

    saveQuizState();

  }

}



/**

 * Renders the 1-10 navigation pills.

 */

function renderNavPills() {

  const navContainer = document.getElementById('quizNavPills');

  if (!navContainer) return;



  navContainer.innerHTML = '';

  quizData.forEach((_, idx) => {

    const pill = document.createElement('button');

    pill.type = 'button';

    pill.className = 'nav-pill';

    pill.textContent = idx + 1;

    pill.setAttribute('aria-label', `Go to question ${idx + 1}`);



    if (idx === quizState.currentQuestion) {

      pill.classList.add('current');

    }



    const ans = getSelectedAnswer(idx);

    if (ans !== null && ans !== undefined) {

      pill.classList.add('answered');

    }



    pill.addEventListener('click', () => {

      renderQuestion(idx);

      saveQuizState();

    });



    navContainer.appendChild(pill);

  });

}



/**

 * Validates whether all questions have an answer selected.

 * Returns array of 1-indexed unanswered question numbers.

 */

function validateSubmission() {

  const unanswered = [];

  quizData.forEach((_, idx) => {

    const ans = getSelectedAnswer(idx);

    if (ans === null || ans === undefined) {

      unanswered.push(idx + 1);

    }

  });

  return unanswered;

}



/**

 * Submits the assessment to Google Sheets endpoint, locks attempt, and moves to COMPLETED upon success.

 */

async function submitQuiz() {

  if (quizState.submitted) return; // Prevent duplicate submissions



  const validationAlert = document.getElementById('quizValidationAlert');

  const unanswered = validateSubmission();



  if (unanswered.length > 0) {

    // Navigate to first unanswered question, then display clear validation alert

    renderQuestion(unanswered[0] - 1);

    showError(

      validationAlert,

      `Please complete all questions before submitting. Unanswered: Question ${unanswered.join(', ')}`

    );

    return;

  }



  // Transition to SUBMITTING loading state

  quizState.phase = 'SUBMITTING';

  renderQuizView();



  quizState.submissionTime = new Date().toISOString();

  quizState.timeTaken = formatDuration(quizState.startTime, quizState.submissionTime);



  // Calculate Score (10 points per question = 100 max)

  let correctCount = 0;

  quizData.forEach((q, idx) => {

    if (getSelectedAnswer(idx) === q.correct_index) {

      correctCount++;

    }

  });

  quizState.score = correctCount * 10;

  const percentageStr = `${Math.round((quizState.score / (quizData.length * 10)) * 100)}%`;



  // Build the exact required submission payload

  const submissionPayload = {

    fullName: quizState.student.fullName,

    phoneNumber: quizState.student.phone,

    sessionId: quizState.sessionId,

    attemptId: quizState.attemptId,

    score: quizState.score,

    percentage: percentageStr,

    startTime: quizState.startTime,

    submissionTime: quizState.submissionTime,

    timeTaken: quizState.timeTaken

  };



  console.info('Submitting NEXUS Assessment to Google Sheets:', submissionPayload);



  try {

    const response = await fetch(GOOGLE_SHEETS_ENDPOINT_URL, {

      method: 'POST',

      headers: {

        'Content-Type': 'text/plain;charset=utf-8'

      },

      body: JSON.stringify(submissionPayload)

    });



    let result = null;

    try {

      result = await response.json();

    } catch (parseErr) {

      // In browser environments where Apps Script redirects with 200/opaque output

      if (response.ok || response.status === 200 || response.type === 'opaque') {

        result = { success: true, message: 'Submission recorded successfully' };

      }

    }



    if (result && result.success !== false) {

      // Only on success: lock attempt, save state, and display results

      quizState.submitted = true;

      quizState.phase = 'COMPLETED';

      saveQuizState();

      renderQuizView();

    } else {

      // Server returned failure

      const errorMsg = result && result.message ? result.message : 'Server rejected the submission.';

      handleSubmissionFailure(errorMsg);

    }

  } catch (error) {

    console.error('Submission request failed:', error);

    handleSubmissionFailure('Network error: Unable to reach Google Sheets endpoint. Please verify your internet connection and retry.');

  }

}



/**

 * Handles failed submission: preserves student answers, resets state to IN_PROGRESS, and shows retry alert.

 */

function handleSubmissionFailure(message) {

  quizState.submitted = false;

  quizState.phase = 'IN_PROGRESS';

  renderQuizView();



  const validationAlert = document.getElementById('quizValidationAlert');

  showError(

    validationAlert,

    `Submission Failed: ${message} (Your answers are safely preserved. Click "Submit Assessment" to retry).`

  );

}



/**

 * Transitions to COMPLETED results screen.

 */

function showResults() {

  if (!quizState.submitted) return;

  quizState.phase = 'COMPLETED';

  renderQuizView();

}



/**

 * Renders the completed results screen.

 */

function renderCompletedView() {

  const studentNameEl = document.getElementById('resultStudentName');

  const studentPhoneEl = document.getElementById('resultStudentPhone');

  const timeTakenEl = document.getElementById('resultTimeTaken');

  const attemptIdEl = document.getElementById('resultAttemptId');

  const scoreNumEl = document.getElementById('scoreNum');

  const badgeEl = document.getElementById('scorePercentageBadge');

  const resultTitleEl = document.getElementById('resultTitle');

  const resultIconEl = document.getElementById('resultIcon');



  if (studentNameEl) studentNameEl.textContent = quizState.student.fullName || '-';

  if (studentPhoneEl) studentPhoneEl.textContent = quizState.student.phone || '-';

  if (timeTakenEl) timeTakenEl.textContent = quizState.timeTaken || '-';

  if (attemptIdEl) attemptIdEl.textContent = quizState.attemptId || '-';



  const percentage = Math.round((quizState.score / (quizData.length * 10)) * 100);

  if (scoreNumEl) scoreNumEl.textContent = quizState.score;

  if (badgeEl) badgeEl.textContent = `${percentage}%`;



  if (resultTitleEl && resultIconEl) {

    if (percentage >= 80) {

      resultTitleEl.textContent = 'Outstanding Performance! 🏆';

      resultIconEl.className = 'fa-solid fa-trophy';

    } else if (percentage >= 50) {

      resultTitleEl.textContent = 'Good Job! Assessment Passed 👍';

      resultIconEl.className = 'fa-solid fa-award';

    } else {

      resultTitleEl.textContent = 'Assessment Completed';

      resultIconEl.className = 'fa-solid fa-clipboard-check';

    }

  }

}



/**

 * Transitions to detailed review view.

 */

function showReview() {

  if (!quizState.submitted) return;

  quizState.phase = 'REVIEW';

  renderQuizView();

}



/**

 * Renders the detailed post-submission review for all 10 questions.

 */

function renderReviewView() {

  const reviewList = document.getElementById('reviewList');

  if (!reviewList) return;



  reviewList.innerHTML = '';

  const letters = ['A', 'B', 'C', 'D'];



  quizData.forEach((q, idx) => {

    const studentAns = getSelectedAnswer(idx);

    const isAnswered = studentAns !== null && studentAns !== undefined;

    const isCorrect = isAnswered && studentAns === q.correct_index;



    const card = document.createElement('div');

    card.className = `review-card ${

      !isAnswered

        ? 'status-unanswered'

        : isCorrect

        ? 'status-correct'

        : 'status-incorrect'

    }`;



    let badgeHtml = '';

    if (!isAnswered) {

      badgeHtml = '<span class="review-badge badge-unanswered"><i class="fa-solid fa-circle-question"></i> Unanswered</span>';

    } else if (isCorrect) {

      badgeHtml = '<span class="review-badge badge-correct"><i class="fa-solid fa-circle-check"></i> Correct (+10)</span>';

    } else {

      badgeHtml = '<span class="review-badge badge-incorrect"><i class="fa-solid fa-circle-xmark"></i> Incorrect (+0)</span>';

    }



    let optionsHtml = '<div class="review-options">';

    q.options.forEach((optText, optIdx) => {

      let optClass = 'review-option-item';

      let icon = `<span class="option-indicator">${letters[optIdx]}</span>`;



      if (optIdx === q.correct_index) {

        optClass += ' opt-correct-target';

        icon = '<span class="option-indicator" style="border-color: #4ade80; background: #4ade80; color: #0f172a;"><i class="fa-solid fa-check"></i></span>';

      }



      if (optIdx === studentAns) {

        if (isCorrect) {

          optClass += ' opt-student-correct';

        } else {

          optClass += ' opt-student-wrong';

          icon = '<span class="option-indicator" style="border-color: #ef4444; background: #ef4444; color: #fff;"><i class="fa-solid fa-xmark"></i></span>';

        }

      }



      optionsHtml += `

        <div class="${optClass}">

          ${icon}

          <div>

            ${escapeHtml(optText)}

            ${optIdx === studentAns ? ' <strong>(Your Selection)</strong>' : ''}

            ${optIdx === q.correct_index ? ' <strong style="color: #4ade80;">(Correct Answer)</strong>' : ''}

          </div>

        </div>

      `;

    });

    optionsHtml += '</div>';



    card.innerHTML = `

      <div class="review-card-top">

        <span class="review-q-num">Question ${idx + 1} of ${quizData.length}</span>

        ${badgeHtml}

      </div>

      <h4 class="review-q-text">${escapeHtml(q.question)}</h4>

      ${optionsHtml}

      <div class="review-explanation">

        <strong><i class="fa-solid fa-lightbulb"></i> Scientific Explanation:</strong>

        ${escapeHtml(q.explanation)}

      </div>

    `;



    reviewList.appendChild(card);

  });

}



/**

 * Escapes HTML characters to prevent XSS.

 */

function escapeHtml(str) {

  if (typeof str !== 'string') return '';

  return str

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;')

    .replace(/"/g, '&quot;')

    .replace(/'/g, '&#039;');

}



/* ==================== AI CHATBOT ==================== */
function initChatbot() {
  const toggleBtn = document.getElementById('chatToggleBtn');
  const chatWindow = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const sendBtn = document.getElementById('sendMessageBtn');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const chatStatus = document.getElementById('chatStatus');
  const chatGreeting = document.getElementById('chatGreeting');
  const chatPulse = document.getElementById('chatPulse');

  // Without a configured key the assistant is shown honestly as "not active yet"
  // instead of returning a canned reply that looks like a real answer.
  const assistantEnabled = Boolean(GEMINI_API_KEY);

  if (assistantEnabled) {
    if (chatStatus) chatStatus.textContent = 'متصل';
    if (chatGreeting) chatGreeting.textContent = 'أهلاً! اسألني عن أي حاجة في الدرس زي الـ CPU أو الـ RAM أو الـ Binary.';
  } else {
    chatInput.disabled = true;
    sendBtn.disabled = true;
    chatInput.placeholder = 'المساعد غير متاح حالياً';
    chatInput.setAttribute('aria-label', 'المساعد غير متاح حالياً');
    if (chatPulse) chatPulse.classList.add('hidden');
  }

  function setChatOpen(open) {
    chatWindow.classList.toggle('hidden', !open);
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggleBtn.addEventListener('click', () => setChatOpen(chatWindow.classList.contains('hidden')));
  closeBtn.addEventListener('click', () => {
    setChatOpen(false);
    toggleBtn.focus();
  });

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.isComposing) sendMessage();
  });

  async function sendMessage() {
    if (!assistantEnabled) return;

    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    const loadingMsg = appendMessage('bot', 'بفكر في إجابة…');

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `أنت مساعد NEXUS لجلسة "The Computer: From Input to Execution". أجب باختصار وبالعامية المصرية البسيطة، وخلّي المصطلحات التقنية بالإنجليزي. لو السؤال برّه حدود الجلسة (الكمبيوتر، الـ IPO، الـ OS، الذاكرة، الـ CPU، الـ Binary، دورة تنفيذ الأمر) قول إنه برّه حدود الجلسة ولا تخترع إجابة. السؤال: ${text}`
            }]
          }]
        })
      });

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'مقدرتش أجاوب دلوقتي، جرّب تاني.';
      loadingMsg.textContent = reply;

    } catch (err) {
      loadingMsg.textContent = 'حصلت مشكلة في الاتصال، جرّب تاني بعد شوية.';
    }
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }
}
