const countdownElement = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

const phaseCountdown = document.getElementById('phase-countdown');
const skipButton = document.getElementById('skip-button');
const heartOverlay = document.getElementById('heart-rain');
const phaseTerminal = document.getElementById('phase-terminal');
const terminalOutput = document.getElementById('terminal-output');
const terminalInputRow = document.getElementById('terminal-input-row');
const terminalInput = document.getElementById('terminal-input');

// Customize these values for your girlfriend.
const validUsernames = ['love', 'baby'];
const expectedToken = '1506';
const expectedYears = '4';
const birthdayMonth = 7;
const birthdayDay = 8;

let phaseTwoStarted = false;
let currentStep = 0;
let countdownInterval = null;

const terminalSteps = [
  {
    label: 'Username',
    prompt: 'Username:',
    validate: value => validUsernames.includes(value.toLowerCase()),
    success: '[SUCCESS]: Username confirmed. Initializing access token.',
  },
  {
    label: 'Access Token',
    prompt: 'Access Token (Your Birthday DDMM):',
    validate: value => value === expectedToken,
    success: '[SUCCESS]: Access token accepted. Verifying security parameters.',
  },
  {
    label: 'Security Question',
    prompt: 'Security Question: How many years has this system been operating smoothly?',
    validate: value => value === expectedYears,
    success: '[SUCCESS]: Identity confirmed. Database decryption starting.',
  },
];

function getNextBirthdayMonthDay(month, day) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const thisYearBirthday = new Date(currentYear, month - 1, day, 0, 0, 0, 0);

  return thisYearBirthday <= now
    ? new Date(currentYear + 1, month - 1, day, 0, 0, 0, 0)
    : thisYearBirthday;
}

const targetDate = getNextBirthdayMonthDay(birthdayMonth, birthdayDay);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    startPhaseTwoTransition();
    return;
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  countdownElement.days.textContent = String(days).padStart(2, '0');
  countdownElement.hours.textContent = String(hours).padStart(2, '0');
  countdownElement.minutes.textContent = String(minutes).padStart(2, '0');
  countdownElement.seconds.textContent = String(seconds).padStart(2, '0');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createHeartRain(count = 20) {
  heartOverlay.innerHTML = '';

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    const left = getRandomInt(4, 96);
    const size = getRandomInt(16, 28);
    const delayMs = getRandomInt(0, 400);
    const duration = getRandomInt(1500, 1900);

    heart.style.left = `${left}%`;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.animationDelay = `${delayMs}ms`;
    heart.style.animationDuration = `${duration}ms`;
    heart.style.opacity = '0';

    heartOverlay.appendChild(heart);

    requestAnimationFrame(() => {
      heart.classList.add('animate');
    });
  }
}

async function startPhaseTwoTransition() {
  if (phaseTwoStarted) return;
  phaseTwoStarted = true;

  clearInterval(countdownInterval);

  Object.values(countdownElement).forEach(element => {
    element.textContent = '00';
  });

  const breachWarning = document.createElement('div');
  breachWarning.className = 'breach-warning';
  breachWarning.textContent = '[CRITICAL ERROR]: DECRYPTION FIREWALL BREACHED. INITIALIZING SYSTEM OVERRIDE...';
  phaseCountdown.appendChild(breachWarning);
  phaseCountdown.classList.add('system-breach');

  await delay(3000);

  phaseCountdown.classList.add('fade-out');
  await delay(650);

  phaseCountdown.classList.add('hidden');
  phaseCountdown.classList.remove('system-breach');

  phaseTerminal.classList.remove('hidden');
  requestAnimationFrame(() => phaseTerminal.classList.add('visible'));
  await delay(250);
  startTerminalSequence();
}

function appendTerminalLine(text, className = 'terminal-info') {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`.trim();
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  return line;
}

async function typeLine(text, speed = 35, className = 'terminal-info') {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`.trim();
  terminalOutput.appendChild(line);

  for (const character of text) {
    line.textContent += character;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    await delay(speed);
  }
}

function showInputPrompt() {
  const step = terminalSteps[currentStep];
  appendTerminalLine(`${step.prompt} `, 'terminal-info');
  terminalInput.value = '';
  terminalInput.placeholder = 'Type your answer and press Enter';
  terminalInputRow.classList.remove('hidden');
  terminalInput.focus();
}

async function handleStepInput(value) {
  const step = terminalSteps[currentStep];
  const normalized = value.trim();

  if (!normalized) {
    appendTerminalLine('[ERROR]: Empty input. Please try again.', 'terminal-error');
    terminalInputRow.classList.remove('hidden');
    terminalInput.focus();
    return;
  }

  const echo = appendTerminalLine(`> ${normalized}`, 'terminal-info');
  terminalInputRow.classList.add('hidden');

  await delay(220);

  if (step.validate(normalized)) {
    await typeLine(step.success, 28, 'terminal-success');
    currentStep += 1;

    if (currentStep < terminalSteps.length) {
      await delay(380);
      showInputPrompt();
    } else {
      await delay(400);
      await typeLine('[SUCCESS]: Database Decrypted. Preparing GUI...', 30, 'terminal-success');
      await delay(900);
      appendTerminalLine('[READY]: Phase 3 interface will appear shortly.', 'terminal-success');
    }
  } else {
    appendTerminalLine('[ERROR]: Access Denied. Try again.', 'terminal-error');
    await delay(360);
    terminalInputRow.classList.remove('hidden');
    terminalInput.focus();
  }
}

async function startTerminalSequence() {
  await typeLine('[ACCESS NODE] Secure boot initiated.', 28);
  await delay(320);
  await typeLine('[SYSTEM] Memory encryption verified.', 28);
  await delay(240);
  await typeLine('[PROMPT] Enter credentials to continue.', 28);
  await delay(320);
  showInputPrompt();
}

skipButton?.addEventListener('click', () => {
  startPhaseTwoTransition();
});

terminalInput?.addEventListener('keydown', async event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();

  const value = terminalInput.value;
  await handleStepInput(value);
});

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
