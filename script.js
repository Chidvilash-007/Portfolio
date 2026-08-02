const root = document.documentElement;
const bootScreen = document.getElementById('bootScreen');
const bootBar = document.getElementById('bootBar');
const bootPercent = document.getElementById('bootPercent');
const bootText = document.getElementById('bootText');

// Premium boot sequence.
let bootValue = 0;
const bootMessages = [
  'Initializing Chidvilash OS...',
  'Loading creative systems...',
  'Connecting project modules...',
  'Experience ready.'
];
const bootTimer = setInterval(() => {
  bootValue += Math.ceil(Math.random() * 11);
  if (bootValue > 100) bootValue = 100;
  bootBar.style.width = `${bootValue}%`;
  bootPercent.textContent = `${bootValue}%`;
  bootText.textContent = bootMessages[Math.min(3, Math.floor(bootValue / 28))];
  if (bootValue === 100) {
    clearInterval(bootTimer);
    setTimeout(() => bootScreen.classList.add('is-hidden'), 380);
  }
}, 65);

// Reveal-on-scroll and skill progress animation.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.setProperty('--delay', `${delay}ms`);
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Sticky navigation state and active section tracking.
const topbar = document.getElementById('topbar');
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('main section[id]')];

function updateNavigation() {
  topbar.classList.toggle('scrolled', window.scrollY > 30);
  let current = 'home';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 220) current = section.id;
  });
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

// Mobile menu.
const menuButton = document.getElementById('menuButton');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Ambient color mode.
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('chidvilash-theme');
if (savedTheme) root.dataset.theme = savedTheme;
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'solar' ? '' : 'solar';
  if (next) root.dataset.theme = next;
  else root.removeAttribute('data-theme');
  localStorage.setItem('chidvilash-theme', next);
});

// Typewriter loop.
const phrases = ['IoT Systems', 'Network Intelligence', 'Interactive Frontends', 'Database Systems', 'Quantum Circuits'];
const typeText = document.getElementById('typeText');
let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;
function typeLoop() {
  const phrase = phrases[phraseIndex];
  typeText.textContent = phrase.slice(0, letterIndex);
  if (!deleting) {
    letterIndex += 1;
    if (letterIndex > phrase.length) {
      deleting = true;
      return setTimeout(typeLoop, 1300);
    }
  } else {
    letterIndex -= 1;
    if (letterIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      letterIndex = 0;
    }
  }
  setTimeout(typeLoop, deleting ? 36 : 65);
}
setTimeout(typeLoop, 900);

// Custom cursor and magnetic buttons.
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = -100;
let mouseY = -100;
let ringX = -100;
let ringY = -100;

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});
function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, input, .project-card').forEach((target) => {
  target.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
  target.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
});

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('mousemove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.11}px, ${y * 0.11}px)`;
  });
  element.addEventListener('mouseleave', () => { element.style.transform = ''; });
});

// Hero parallax orb.
const visualShell = document.getElementById('visualShell');
visualShell.addEventListener('mousemove', (event) => {
  const rect = visualShell.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  visualShell.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -12}deg)`;
});
visualShell.addEventListener('mouseleave', () => { visualShell.style.transform = ''; });

// Spotlight cards.
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

// Project tilt.
document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1200px) rotateY(${x * 2.4}deg) rotateX(${y * -2.4}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Timeline progress.
const timeline = document.querySelector('.timeline');
const timelineProgress = document.getElementById('timelineProgress');
function updateTimeline() {
  const rect = timeline.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - rect.top) / rect.height));
  timelineProgress.style.height = `${progress * 100}%`;
}
window.addEventListener('scroll', updateTimeline, { passive: true });
updateTimeline();

// Canvas particle field.
const canvas = document.getElementById('particleCanvas');
const context = canvas.getContext('2d');
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 1.7);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  particles = Array.from({ length: Math.min(88, Math.floor(canvasWidth / 16)) }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 1.4 + 0.35,
    speed: Math.random() * 0.19 + 0.04,
    drift: (Math.random() - 0.5) * 0.08,
    alpha: Math.random() * 0.45 + 0.1
  }));
}
function animateParticles() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((particle, index) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;
    if (particle.y < -4) particle.y = canvasHeight + 4;
    if (particle.x < -4) particle.x = canvasWidth + 4;
    if (particle.x > canvasWidth + 4) particle.x = -4;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = index % 5 === 0 ? `rgba(116,247,226,${particle.alpha})` : `rgba(180,195,235,${particle.alpha})`;
    context.fill();
  });
  requestAnimationFrame(animateParticles);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();

// Project detail modal content.
const projectData = {
  network: {
    status: 'ONGOING SYSTEM',
    title: 'Network Monitoring & Database Analytics',
    description: 'A practical DBMS and computer networks build focused on collecting, organizing and presenting meaningful network information.',
    role: 'System builder', state: 'In progress', stack: 'Networks, SQL, Web UI',
    focus: 'Device visibility, traffic and performance observations, structured log storage, searchable history and dashboard-style analysis.',
    images: [], actions: []
  },
  youtube: {
    status: 'CUSTOM INTERFACE',
    title: 'YouTube Custom CSS Extension',
    description: 'A visual customization project that reshapes the YouTube experience through carefully designed CSS and browser extension behavior.',
    role: 'UI customizer', state: 'Working concept', stack: 'CSS, Extension',
    focus: 'Cleaner surfaces, custom backgrounds, controlled visual effects, improved spacing and a more personal viewing environment.',
    images: [], actions: []
  },
  food: {
    status: 'FRONTEND PROTOTYPE',
    title: 'Food Express',
    description: 'An in-progress frontend prototype for discovering restaurants and food, viewing account screens and exploring an order-tracking experience.',
    role: 'Frontend developer', state: 'Prototype', stack: 'HTML, CSS, JS, React',
    focus: 'Responsive restaurant cards, food categories, search navigation, customer profile screens and order tracking. Backend ordering and payment processing are not yet implemented.',
    images: [
      { src: 'assets/food-express/home.webp', alt: 'Food Express home interface' },
      { src: 'assets/food-express/restaurants.webp', alt: 'Food Express restaurants interface' },
      { src: 'assets/food-express/tracking.webp', alt: 'Food Express order tracking interface' },
      { src: 'assets/food-express/profile.webp', alt: 'Food Express profile interface' }
    ],
    actions: []
  },
  quantum: {
    status: 'IBM QUANTUM COURSEWORK',
    title: 'Quantum Computing Experiments',
    description: 'A structured collection of quantum circuit experiments created to understand gates through simulation and evidence.',
    role: 'Quantum learner', state: 'Completed studies', stack: 'Qiskit, Python',
    focus: 'Gate decomposition, statevector comparison, measurement counts, Bloch-sphere movement and circuit-equivalence verification.',
    images: [{ src: 'assets/certificates/ibm-quantum.webp', alt: 'IBM Foundation of Quantum Technologies certificate' }],
    actions: [{ label: 'View IBM certificate ↗', href: 'assets/certificates/IBM-Foundation-of-Quantum-Technologies.pdf' }]
  },
  vtop: {
    status: 'DESIGN EXPERIMENT',
    title: 'VTOP Theme Extension',
    description: 'A UI exploration for making a student portal feel visually cleaner and more expressive through custom styling.',
    role: 'UI experimenter', state: 'Concept', stack: 'CSS, JavaScript',
    focus: 'Theme experimentation, colors, spacing, layout refinement and visual effects while preserving the original portal functions.',
    images: [], actions: []
  }
};

const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
function openProjectModal(key) {
  const data = projectData[key];
  if (!data) return;
  document.getElementById('modalStatus').textContent = data.status;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDescription').textContent = data.description;
  document.getElementById('modalRole').textContent = data.role;
  document.getElementById('modalState').textContent = data.state;
  document.getElementById('modalStack').textContent = data.stack;
  document.getElementById('modalFocus').textContent = data.focus;

  const gallery = document.getElementById('modalGallery');
  gallery.innerHTML = '';
  (data.images || []).forEach((image) => {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    gallery.appendChild(img);
  });
  gallery.classList.toggle('has-media', Boolean(data.images && data.images.length));

  const actions = document.getElementById('modalActions');
  actions.innerHTML = '';
  (data.actions || []).forEach((action) => {
    const link = document.createElement('a');
    link.href = action.href;
    link.textContent = action.label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.appendChild(link);
  });
  actions.classList.toggle('has-actions', Boolean(data.actions && data.actions.length));

  projectModal.showModal();
}

document.querySelectorAll('.project-card').forEach((card) => {
  const open = () => openProjectModal(card.dataset.project);
  card.querySelector('.text-button').addEventListener('click', (event) => { event.stopPropagation(); open(); });
  card.addEventListener('dblclick', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});
modalClose.addEventListener('click', () => projectModal.close());
projectModal.addEventListener('click', (event) => {
  const rect = projectModal.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) projectModal.close();
});

// Interactive terminal.
const terminalForm = document.getElementById('terminalForm');
const terminalCommand = document.getElementById('terminalCommand');
const terminalOutput = document.getElementById('terminalOutput');
const commands = {
  help: 'Commands: <strong>about</strong>, <strong>education</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>profiles</strong>, <strong>certificate</strong>, <strong>contact</strong>, <strong>status</strong>, <strong>clear</strong>.',
  about: 'Chidvilash is a B.Tech CSE (Internet of Things) student at VIT Vellore, building across frontend, DBMS, networks and quantum computing.',
  education: 'VIT Vellore · B.Tech Computer Science and Engineering (Internet of Things) · Expected graduation: 2028',
  skills: 'HTML · CSS · JavaScript · React · Java · Python · SQL · Qiskit · Computer Networks · Operating Systems · IoT',
  projects: '01 Network Monitor [ongoing] · 02 YouTube CSS Extension · 03 Food Express [prototype] · 04 Quantum Experiments · 05 VTOP Theme',
  profiles: '<a href="https://github.com/Chidvilash-007" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="https://www.linkedin.com/in/chidvilash-gedela-519a21324/" target="_blank" rel="noopener noreferrer">LinkedIn</a> · <a href="https://leetcode.com/u/chidvilash_007/" target="_blank" rel="noopener noreferrer">LeetCode</a>',
  certificate: '<a href="assets/certificates/IBM-Foundation-of-Quantum-Technologies.pdf" target="_blank" rel="noopener noreferrer">IBM Foundation of Quantum Technologies ↗</a>',
  contact: 'Email: <strong><a href="mailto:gchidvilashnaidu@gmail.com">gchidvilashnaidu@gmail.com</a></strong>',
  status: '<span class="terminal-green">ONLINE</span> — continuously learning and building.'
};
terminalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const command = terminalCommand.value.trim().toLowerCase();
  if (!command) return;
  const prompt = document.createElement('p');
  prompt.innerHTML = `<span class="terminal-green">visitor@chidvilash:~$</span> ${escapeHTML(command)}`;
  terminalOutput.appendChild(prompt);
  if (command === 'clear') {
    terminalOutput.innerHTML = '';
  } else {
    const result = document.createElement('p');
    if (commands[command]) result.innerHTML = commands[command];
    else result.innerHTML = `<span class="error">Command not found:</span> ${escapeHTML(command)}. Type <strong>help</strong>.`;
    terminalOutput.appendChild(result);
  }
  terminalCommand.value = '';
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});
function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

// Keyboard shortcut opens terminal.
window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => terminalCommand.focus(), 700);
  }
});
