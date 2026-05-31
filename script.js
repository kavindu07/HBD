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
const heartSync = document.getElementById('heart-sync');
const heartSyncValue = document.getElementById('heart-sync-value');
const phaseCake = document.getElementById('phase-cake');
const candleHitArea = document.getElementById('candle-hit-area');
const confettiLayer = document.getElementById('confetti-layer');
const backgroundMusic = document.getElementById('background-music');
const phaseMemories = document.getElementById('phase-memories');
const cakeHint = document.getElementById('cake-hint');
const giftBoxes = [...document.querySelectorAll('.gift-box')];

// Customize these values for your girlfriend.
const expectedName = 'nathasha';
const expectedAnniversary = '11/18';
const expectedBoyfriendName = 'kavindu';
const birthdayMonth = 7;
const birthdayDay = 8;

let phaseTwoStarted = false;
let currentStep = 0;
let countdownInterval = null;
let candleBlown = false;
let cakeSequenceStarted = false;
let wrappingUnlocked = false;
let memorySlideIndex = 0;
let memorySlideInterval = null;

const heartProgressSteps = [33, 66, 100];
const terminalGraceMs = 2500;
const terminalBlackoutFadeMs = 1500;
const songTimelineMs = 78000;
const magicalSparkleMs = 4000;
const finalBlackFadeMs = 1500;

const giftRewards = [
  {
    title: 'You unlocked a Daytime Movie Date & Sweet Ride! (Sponsored by Kavindu) 🏍️🍿',
  },
  {
    title: "You unlocked a 'Shopping Spree with Kavindu'! 🛍️✨",
    subtitle: 'Pick a day, we are going shopping for whatever you want! ❤️',
  },
  {
    title: "You unlocked a 'Free Hugs & Unlimited Ice Cream' coupon! 🍦❤️",
  },
];

const terminalSteps = [
  {
    label: 'Name',
    prompt: 'Enter your name (One word answer):',
    validate: value => value.toLowerCase() === expectedName,
    error: 'Access Denied: Invalid Username. Try again.',
    success: '[SUCCESS]: Name confirmed. Initializing memory check.',
  },
  {
    label: 'Anniversary',
    prompt: 'Enter anniversary month and date (Example: 01/01):',
    validate: value => value === expectedAnniversary,
    error: 'Incorrect key date. Hint: MM/DD. Try again.',
    success: '[SUCCESS]: Anniversary verified. Checking final identity parameter.',
  },
  {
    label: 'Boyfriend Name',
    prompt: "Enter your boyfriend's name:",
    validate: value => value.toLowerCase() === expectedBoyfriendName,
    error: '❌ Error: කවුද යකෝ ඒ?! 🤨ගහනවා හරියට නම ⚔️👊❤️',
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
  if (!heartOverlay) return;

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
  const promptLine = document.createElement('div');
  const promptText = document.createElement('span');

  promptLine.className = 'terminal-line terminal-prompt-line terminal-info';
  promptText.className = 'terminal-prompt-text';
  promptText.textContent = step.prompt;

  promptLine.appendChild(promptText);
  promptLine.appendChild(terminalInputRow);
  terminalOutput.appendChild(promptLine);

  terminalInput.value = '';
  terminalInput.placeholder = 'Type your answer and press Enter';
  terminalInputRow.classList.remove('hidden');
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  terminalInput.focus();
}

function updateHeartSync(progress) {
  if (!heartSync || !heartSyncValue) return;

  heartSync.style.setProperty('--heart-progress', `${progress}%`);
  heartSyncValue.textContent = `${progress}%`;
  heartSync.classList.toggle('complete', progress >= 100);
  heartSync.classList.remove('sync-pulse');

  requestAnimationFrame(() => {
    heartSync.classList.add('sync-pulse');
  });
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

  const isValid = step.validate(normalized);

  if (isValid) {
    if (currentStep === terminalSteps.length - 1) {
      updateHeartSync(heartProgressSteps[currentStep]);
      currentStep += 1;
      appendTerminalLine('[SUCCESS]: Database Decrypted. Access Granted...', 'terminal-success');
      startCakeCinematicSequence();
      return;
    }

    await delay(220);
    await typeLine(step.success, 28, 'terminal-success');
    updateHeartSync(heartProgressSteps[currentStep]);
    currentStep += 1;

    if (currentStep < terminalSteps.length) {
      await delay(380);
      showInputPrompt();
    }
  } else {
    await delay(220);
    await typeLine(step.error, 24, 'terminal-error');
    await delay(360);
    showInputPrompt();
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

function getCandleFlamePoint() {
  if (!candleHitArea) {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.62,
    };
  }

  const rect = candleHitArea.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height * 0.18,
  };
}

function createMagicalBlowoutEffect() {
  if (!confettiLayer) return;

  confettiLayer.innerHTML = '';
  confettiLayer.classList.add('active', 'magical-active');

  const flamePoint = getCandleFlamePoint();
  const flash = document.createElement('span');
  const vignette = document.createElement('span');
  const smoke = document.createElement('span');

  flash.className = 'magic-flash';
  vignette.className = 'magic-vignette';
  smoke.className = 'ember-smoke';
  smoke.style.left = `${flamePoint.x}px`;
  smoke.style.top = `${flamePoint.y}px`;

  confettiLayer.append(flash, vignette, smoke);

  for (let i = 0; i < 28; i += 1) {
    const spark = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = getRandomInt(58, 190);
    const upwardLift = getRandomInt(22, 86);
    const size = getRandomInt(3, 7);

    spark.className = 'gold-spark';
    spark.style.left = `${flamePoint.x}px`;
    spark.style.top = `${flamePoint.y}px`;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--y', `${Math.sin(angle) * distance - upwardLift}px`);
    spark.style.animationDelay = `${getRandomInt(0, 80)}ms`;

    confettiLayer.appendChild(spark);
  }

  for (let i = 0; i < 14; i += 1) {
    const firefly = document.createElement('span');
    const size = getRandomInt(9, 18);

    firefly.className = 'firefly-orb';
    firefly.style.left = `${getRandomInt(8, 92)}vw`;
    firefly.style.bottom = `${getRandomInt(-18, 16)}vh`;
    firefly.style.width = `${size}px`;
    firefly.style.height = `${size}px`;
    firefly.style.setProperty('--drift-x', `${getRandomInt(-55, 55)}px`);
    firefly.style.setProperty('--rise', `${getRandomInt(72, 118)}vh`);
    firefly.style.animationDelay = `${getRandomInt(250, 1400)}ms`;
    firefly.style.animationDuration = `${getRandomInt(3600, 5400)}ms`;

    confettiLayer.appendChild(firefly);
  }

  setTimeout(() => {
    confettiLayer.classList.remove('active', 'magical-active');
    confettiLayer.innerHTML = '';
  }, 6200);
}

function getFinalTransitionOverlay() {
  let overlay = document.getElementById('final-transition-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'final-transition-overlay';
    overlay.className = 'final-transition-overlay';
    document.body.appendChild(overlay);
  }

  return overlay;
}

function createBurnEmbers(container, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  const rect = container.getBoundingClientRect();
  const localX = originX - rect.left;
  const localY = originY - rect.top;

  for (let i = 0; i < 34; i += 1) {
    const ember = document.createElement('span');
    const angle = Math.random() * Math.PI * 2;
    const distance = getRandomInt(90, 360);
    const size = getRandomInt(3, 8);

    ember.className = 'burn-ember';
    ember.style.left = `${localX}px`;
    ember.style.top = `${localY}px`;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    ember.style.setProperty('--y', `${Math.sin(angle) * distance - getRandomInt(40, 180)}px`);
    ember.style.animationDelay = `${getRandomInt(0, 160)}ms`;

    container.appendChild(ember);
  }
}

function createVirtualWrappingShield() {
  if (!phaseMemories) return null;

  const existingShield = document.getElementById('virtual-wrapping-shield');
  if (existingShield) existingShield.remove();

  const shield = document.createElement('div');
  shield.id = 'virtual-wrapping-shield';
  shield.className = 'virtual-wrapping-shield';
  shield.innerHTML = '<div class="wrapping-energy-text">Swipe to unwrap your gift</div>';

  let startX = 0;
  let startY = 0;

  const burnOpen = event => {
    if (wrappingUnlocked || shield.classList.contains('burning')) return;

    wrappingUnlocked = true;
    const point = event.changedTouches?.[0] || event;

    shield.classList.add('burning');
    createBurnEmbers(shield, point.clientX || window.innerWidth / 2, point.clientY || window.innerHeight / 2);

    setTimeout(() => {
      phaseMemories.classList.remove('wrapped');
      phaseMemories.classList.add('unwrapped');
      shield.remove();
    }, 1800);
  };

  shield.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  }, { passive: true });

  shield.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    if (deltaX > 45 || deltaY > 45) {
      burnOpen(event);
    }
  }, { passive: true });

  shield.addEventListener('pointerdown', event => {
    startX = event.clientX;
    startY = event.clientY;
  });

  shield.addEventListener('pointerup', event => {
    const deltaX = Math.abs(event.clientX - startX);
    const deltaY = Math.abs(event.clientY - startY);

    if (deltaX > 45 || deltaY > 45) {
      burnOpen(event);
    }
  });

  phaseMemories.appendChild(shield);
  return shield;
}

function startBirthdaySong() {
  if (!backgroundMusic) return Promise.resolve();

  backgroundMusic.currentTime = 0;
  backgroundMusic.volume = 0.72;

  const audioEnded = new Promise(resolve => {
    const finish = () => {
      backgroundMusic.removeEventListener('ended', finish);
      backgroundMusic.removeEventListener('error', fail);
      resolve();
    };

    const fail = () => {
      backgroundMusic.removeEventListener('error', fail);
      console.warn('Add bday-song.mp3 to enable music playback.');
    };

    backgroundMusic.addEventListener('ended', finish, { once: true });
    backgroundMusic.addEventListener('error', fail, { once: true });

    const playAttempt = backgroundMusic.play();
    if (playAttempt) {
      playAttempt.catch(fail);
    }
  });

  return Promise.race([audioEnded, delay(songTimelineMs)]);
}

function unlockCandleInteraction() {
  if (!phaseCake || !candleHitArea) return;

  phaseCake.classList.add('ready-for-wish');
  candleHitArea.removeAttribute('disabled');
  cakeHint?.classList.add('visible');
}

async function startCakeCinematicSequence() {
  if (cakeSequenceStarted || !phaseCake) return;
  cakeSequenceStarted = true;

  terminalInputRow?.classList.add('hidden');
  phaseTerminal?.classList.remove('terminal-dissolve');
  phaseCake.classList.remove('hidden', 'image-revealed', 'ready-for-wish', 'fade-out', 'candle-blown');
  phaseCake.classList.add('blackout-pending');
  candleHitArea?.setAttribute('disabled', 'true');
  cakeHint?.classList.remove('visible');

  await delay(terminalGraceMs);

  phaseCake.classList.remove('blackout-pending');
  phaseCake.classList.add('blackout-active');
  phaseTerminal?.classList.add('terminal-dissolve');
  setTimeout(() => {
    phaseTerminal?.classList.add('hidden');
  }, terminalBlackoutFadeMs);
  const songFinished = startBirthdaySong();

  await delay(terminalBlackoutFadeMs);
  phaseCake.classList.add('image-revealed');

  await songFinished;
  unlockCandleInteraction();
}

function startMemorySlides() {
  if (!phaseMemories) return;

  const slides = [...phaseMemories.querySelectorAll('.memory-slide')];
  if (slides.length <= 1) return;

  memorySlideInterval = setInterval(() => {
    slides[memorySlideIndex].classList.remove('active');
    memorySlideIndex = (memorySlideIndex + 1) % slides.length;
    slides[memorySlideIndex].classList.add('active');
  }, 3600);
}

function openGiftBox(box) {
  const reward = giftRewards[Number(box.dataset.giftIndex)];
  const reveal = box.querySelector('.gift-reveal');
  if (!reward || !reveal) return;

  box.classList.add('opened');
  box.setAttribute('aria-expanded', 'true');
  reveal.innerHTML = reward.subtitle
    ? `<strong>${reward.title}</strong><span>${reward.subtitle}</span>`
    : `<strong>${reward.title}</strong>`;
}

async function handleCandleBlowout() {
  if (candleBlown || !phaseCake) return;
  candleBlown = true;

  phaseCake.classList.add('candle-blown');
  candleHitArea?.setAttribute('disabled', 'true');
  createMagicalBlowoutEffect();

  await delay(magicalSparkleMs);

  const finalOverlay = getFinalTransitionOverlay();
  requestAnimationFrame(() => {
    finalOverlay.classList.add('visible');
  });

  await delay(finalBlackFadeMs);

  phaseCake.classList.add('hidden');
  phaseMemories?.classList.remove('hidden');
  phaseMemories?.classList.remove('unwrapped');
  phaseMemories?.classList.add('wrapped');
  wrappingUnlocked = false;
  createVirtualWrappingShield();
  phaseMemories?.classList.add('visible');
  requestAnimationFrame(() => {
    finalOverlay.classList.remove('visible');
  });

  setTimeout(() => {
    finalOverlay.remove();
  }, finalBlackFadeMs + 150);

  startMemorySlides();
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

candleHitArea?.addEventListener('click', handleCandleBlowout);

giftBoxes.forEach(box => {
  box.addEventListener('click', () => openGiftBox(box));
});

if (phaseCountdown) {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

if (phaseCake && !phaseTerminal) {
  startCakeCinematicSequence();
}
