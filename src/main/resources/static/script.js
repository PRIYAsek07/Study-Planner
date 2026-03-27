// ===== STATE =====
let subjects = [];
let profile = {};
let progress = 0;
let streak = 0;
let completedTasks = 0;
let currentDifficulty = 1;
let chartInstance = null;
let dailyLog = [0, 0, 0, 0, 0, 0, 0];

const subjectColors = [
  '#6c5ce7', '#00cec9', '#fd79a8', '#00b894',
  '#e17055', '#fdcb6e', '#0984e3', '#a29bfe',
  '#55efc4', '#fab1a0', '#74b9ff', '#ffeaa7'
];

// ===== TYPING EFFECT =====
const taglines = [
  "Smart study planning that prevents overload",
  "Maximize your exam performance with AI",
  "Personalized schedules powered by intelligence",
  "Study smarter, not harder"
];

let taglineIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 50;

function typeWriter() {
  const el = document.querySelector('.typing-text');
  const current = taglines[taglineIndex];

  if (!isDeleting) {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else {
      typingSpeed = 50 + Math.random() * 50;
    }
  } else {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typingSpeed = 300;
    } else {
      typingSpeed = 30;
    }
  }

  setTimeout(typeWriter, typingSpeed);
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 60 + 240
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
          p.opacity = Math.min(p.opacity + 0.02, 0.8);
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      particles.forEach((p2, j) => {
        if (i === j) return;
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(260, 70%, 70%, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== CONFETTI =====
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894', '#e17055'];

  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    if (frame > 200) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    confetti.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.05;
      c.rotation += c.rotSpeed;

      if (frame > 120) {
        c.opacity -= 0.02;
      }

      if (c.opacity <= 0) return;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation * Math.PI / 180);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = Math.max(0, c.opacity);
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== TOAST NOTIFICATIONS =====
function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');

  const icons = {
    success: 'fa-check',
    error: 'fa-xmark',
    info: 'fa-info',
    warning: 'fa-exclamation'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="removeToast(this)">
      <i class="fas fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function removeToast(btn) {
  const toast = btn.closest('.toast');
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

// ===== BUTTON RIPPLE =====
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  btn.classList.remove('rippling');
  void btn.offsetWidth;
  btn.classList.add('rippling');

  setTimeout(() => btn.classList.remove('rippling'), 600);
});

// ===== DIFFICULTY SELECTOR =====
function setDifficulty(val) {
  currentDifficulty = val;
  document.getElementById('difficulty').value = val;

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.val) <= val) {
      btn.classList.add('active');
    }
  });
}

// ===== PROFILE =====
function saveProfile() {
  const hours = document.getElementById('hoursPerDay').value;
  const start = document.getElementById('startTime').value;

  if (!hours || !start) {
    showToast('error', 'Missing Info', 'Please fill in all profile fields');
    return;
  }

  profile.hours = parseFloat(hours);
  profile.start = start;

  showToast('success', 'Profile Saved', `${hours} hrs/day starting at ${formatTime(start)}`);
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

// ===== ADD SUBJECT =====
function addSubject() {
  const name = document.getElementById('subjectName').value.trim();
  const difficulty = parseInt(document.getElementById('difficulty').value);
  const examDate = document.getElementById('examDate').value;

  if (!name) {
    showToast('error', 'Missing Subject', 'Please enter a subject name');
    return;
  }

  if (!examDate) {
    showToast('error', 'Missing Date', 'Please select an exam date');
    return;
  }

  const exam = new Date(examDate);
  const color = subjectColors[subjects.length % subjectColors.length];

  subjects.push({ name, difficulty, exam, color, id: Date.now() });

  renderSubjects();

  // Clear inputs
  document.getElementById('subjectName').value = '';
  document.getElementById('examDate').value = '';
  setDifficulty(1);

  showToast('success', 'Subject Added', `${name} added with difficulty ${difficulty}`);
}

// ===== RENDER SUBJECTS =====
function renderSubjects() {
  const list = document.getElementById('subjectList');
  const empty = document.getElementById('emptySubjects');
  const counter = document.getElementById('subjectCount');

  list.innerHTML = '';
  counter.textContent = subjects.length;

  if (subjects.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  subjects.forEach((s, index) => {
    const daysLeft = Math.ceil((s.exam - new Date()) / (1000 * 3600 * 24));
    const item = document.createElement('div');
    item.className = 'subject-item';
    item.style.animationDelay = `${index * 0.1}s`;

    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots += `<div class="dot ${i <= s.difficulty ? 'active' : ''}"></div>`;
    }

    item.innerHTML = `
      <div class="subject-color" style="background: ${s.color}"></div>
      <div class="subject-info">
        <div class="subject-name">${s.name}</div>
        <div class="subject-meta">
          <div class="subject-diff">${dots}</div>
          <span>${daysLeft > 0 ? daysLeft + ' days left' : 'Exam passed'}</span>
        </div>
      </div>
      <button class="subject-delete" onclick="deleteSubject(${s.id})">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;

    list.appendChild(item);
  });
}

function deleteSubject(id) {
  subjects = subjects.filter(s => s.id !== id);
  renderSubjects();
  showToast('info', 'Subject Removed', 'Subject has been deleted');
}

// ===== GENERATE SCHEDULE =====
function generateSchedule() {
  if (subjects.length === 0) {
    showToast('warning', 'No Subjects', 'Add subjects before generating a schedule');
    return;
  }

  const hours = profile.hours || 4;
  const startTime = profile.start || '09:00';
  const schedule = document.getElementById('schedule');
  schedule.innerHTML = '';

  // Sort by urgency (difficulty / days until exam)
  const sorted = [...subjects].sort((a, b) => {
    const daysA = Math.max((a.exam - new Date()) / (1000 * 3600 * 24), 1);
    const daysB = Math.max((b.exam - new Date()) / (1000 * 3600 * 24), 1);
    const scoreA = a.difficulty / daysA;
    const scoreB = b.difficulty / daysB;
    return scoreB - scoreA;
  });

  let currentHour = parseInt(startTime.split(':')[0]);
  let currentMinute = parseInt(startTime.split(':')[1]) || 0;
  let lastDifficulty = 0;

  sorted.forEach((s, index) => {
    let studyHours = parseFloat((hours / subjects.length).toFixed(1));

    // Prevent burnout from consecutive hard subjects
    if (lastDifficulty >= 4 && s.difficulty >= 4) {
      studyHours = parseFloat((studyHours * 0.8).toFixed(1));
    }

    const daysLeft = Math.ceil((s.exam - new Date()) / (1000 * 3600 * 24));
    let priority = 'low';
    if (daysLeft <= 3) priority = 'high';
    else if (daysLeft <= 7) priority = 'medium';

    const timeStr = `${String(currentHour % 24).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.style.animationDelay = `${index * 0.15}s`;

    item.innerHTML = `
      <div class="schedule-time">${formatTime(timeStr)}</div>
      <div class="schedule-info">
        <div class="schedule-subject">${s.name}</div>
        <div class="schedule-hours">${studyHours} hours · ${daysLeft > 0 ? daysLeft + ' days until exam' : 'Exam passed!'}</div>
      </div>
      <div class="schedule-priority priority-${priority}">${priority}</div>
    `;

    schedule.appendChild(item);

    // Advance time
    const totalMinutes = currentMinute + studyHours * 60;
    currentHour += Math.floor(totalMinutes / 60);
    currentMinute = Math.round(totalMinutes % 60);

    lastDifficulty = s.difficulty;
  });

  generateChart();
  showToast('success', 'Schedule Generated', 'Your AI study plan is ready!');
}

// ===== CHART =====
function generateChart() {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = subjects.map(s => s.name);
  const data = subjects.map(s => s.difficulty);
  const colors = subjects.map(s => s.color);

  // Define gradient
  const ctx = document.getElementById('analyticsChart').getContext('2d');

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Difficulty Level',
        data: data,
        backgroundColor: colors.map(c => c + '66'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#8888aa',
            font: { family: 'Space Grotesk', size: 12 }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          grid: {
            color: 'rgba(255,255,255,0.03)'
          },
          ticks: {
            color: '#8888aa',
            font: { family: 'Space Grotesk' }
          }
        },
        x: {
          grid: {
            color: 'rgba(255,255,255,0.03)'
          },
          ticks: {
            color: '#8888aa',
            font: { family: 'Space Grotesk' }
          }
        }
      }
    }
  });
}

// ===== PROGRESS =====
function updateProgress() {
  const circle = document.getElementById('progressCircle');
  const bar = document.getElementById('progressBarFill');
  const glow = document.getElementById('progressBarGlow');
  const text = document.getElementById('progressText');
  const percent = document.getElementById('progressPercent');

  // Circle
  const circumference = 326.73;
  const offset = circumference - (progress / 100) * circumference;

  // Create SVG gradient if not exists
  const svg = circle.closest('svg');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'progressGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#6c5ce7');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#00cec9');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.prepend(defs);
  }

  circle.setAttribute('stroke', 'url(#progressGradient)');
  circle.style.strokeDashoffset = offset;

  // Bar
  bar.style.width = progress + '%';
  glow.style.left = progress + '%';

  // Text
  text.textContent = progress + '% Completed';

  // Animated counter
  animateCounter(percent, progress);
}

function animateCounter(el, target) {
  const current = parseInt(el.textContent);
  if (current === target) return;

  const step = current < target ? 1 : -1;
  let val = current;

  const interval = setInterval(() => {
    val += step;
    el.textContent = val;
    if (val === target) clearInterval(interval);
  }, 20);
}

function completeTask() {
  if (subjects.length === 0) {
    showToast('warning', 'No Subjects', 'Add subjects first');
    return;
  }

  completedTasks++;

  progress += 10;
  if (progress > 100) progress = 100;

  streak++;
  document.getElementById('streak').textContent = streak;

  // Update daily log
  const today = new Date().getDay();
  dailyLog[today]++;

  updateProgress();
  updateStreak();
  generateFeedback();

  showToast('success', 'Task Complete!', 'Great job! Keep up the momentum! 🚀');

  if (progress >= 100) {
    launchConfetti();
    showToast('success', '🎉 All Done!', 'You\'ve completed all your study tasks!');
  }

  if (streak === 5 || streak === 7 || streak === 14 || streak === 30) {
    launchConfetti();
  }
}

function missTask() {
  streak = 0;
  document.getElementById('streak').textContent = streak;
  updateStreak();

  const reward = document.getElementById('reward');
  reward.textContent = 'Streak lost. Don\'t give up — start again! 💪';
  reward.className = 'reward-text negative';

  showToast('error', 'Streak Lost', 'Your streak has been reset to 0');
}

function updateStreak() {
  const display = document.querySelector('.streak-display');

  if (streak > 0) {
    display.classList.add('active');
  } else {
    display.classList.remove('active');
  }

  // Update milestones
  const milestones = [3, 5, 7, 14, 30];
  milestones.forEach(m => {
    const el = document.getElementById(`m${m}`);
    if (streak >= m) {
      el.classList.add('unlocked');
    } else {
      el.classList.remove('unlocked');
    }
  });

  // Reward text
  const reward = document.getElementById('reward');
  if (streak >= 30) {
    reward.textContent = '🐉 Legendary Scholar — 30 Day Streak!';
    reward.className = 'reward-text positive';
  } else if (streak >= 14) {
    reward.textContent = '💎 Diamond Student — 14 Day Streak!';
    reward.className = 'reward-text positive';
  } else if (streak >= 7) {
    reward.textContent = '👑 Study Royalty — 7 Day Streak!';
    reward.className = 'reward-text positive';
  } else if (streak >= 5) {
    reward.textContent = '🏆 Study Champion — 5 Day Streak!';
    reward.className = 'reward-text positive';
  } else if (streak >= 3) {
    reward.textContent = '⭐ Rising Star — 3 Day Streak!';
    reward.className = 'reward-text positive';
  } else if (streak > 0) {
    reward.textContent = `Keep going! ${3 - streak} more days to first milestone!`;
    reward.className = 'reward-text';
  }
}

// ===== REMINDERS =====
function generateReminder() {
  if (subjects.length === 0) {
    document.getElementById('reminder').textContent = 'Add subjects first to get smart reminders.';
    showToast('warning', 'No Subjects', 'Add subjects to generate reminders');
    return;
  }

  const sorted = [...subjects].sort((a, b) => a.exam - b.exam);
  const urgent = sorted[0];
  const daysLeft = Math.ceil((urgent.exam - new Date()) / (1000 * 3600 * 24));

  const reminders = [
    `🎯 Priority Alert: Focus on ${urgent.name} today — only ${daysLeft} days until your exam!`,
    `⚡ ${urgent.name} needs your attention! Exam in ${daysLeft} days. Let's make every minute count.`,
    `📚 Smart reminder: ${urgent.name} is your most urgent subject with ${daysLeft} days remaining.`,
    `🔥 Don't forget: ${urgent.name} exam is approaching in ${daysLeft} days. Start with the hardest topics!`,
    `🧠 AI Tip: Spend extra time on ${urgent.name} today. Spaced repetition works best before exams!`
  ];

  const reminder = reminders[Math.floor(Math.random() * reminders.length)];
  document.getElementById('reminder').textContent = reminder;

  showToast('info', 'Reminder Generated', `Focus on ${urgent.name}`);
}

// ===== FEEDBACK =====
function generateFeedback() {
  let text = '';
  let emoji = '';

  if (progress < 20) {
    text = 'You\'re just getting started. Every expert was once a beginner. Keep building your foundation!';
    emoji = '🌱';
  } else if (progress < 40) {
    text = 'Building momentum! Your consistency is starting to show. Stay on this path.';
    emoji = '📈';
  } else if (progress < 60) {
    text = 'Halfway there! Your dedication is impressive. The hardest part is already behind you.';
    emoji = '⚡';
  } else if (progress < 80) {
    text = 'Outstanding progress! You\'re in the top tier of study discipline. Keep pushing!';
    emoji = '🔥';
  } else if (progress < 100) {
    text = 'Almost there! Your preparation level is exceptional. You\'re going to ace those exams!';
    emoji = '🌟';
  } else {
    text = 'Perfect completion! You\'ve demonstrated extraordinary discipline. You are exam ready!';
    emoji = '🏆';
  }

  if (streak >= 5) {
    text += ` Your ${streak}-day streak shows remarkable consistency!`;
  }

  document.getElementById('feedback').textContent = `${emoji} ${text}`;
}

// ===== CARD HOVER GLOW TRACKING =====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(108, 92, 231, 0.12) 0%, transparent 60%)`;
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
  card.style.animationPlayState = 'paused';
  observer.observe(card);
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  typeWriter();
  initParticles();
  setDifficulty(1);
  updateProgress();

  // Set minimum exam date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('examDate').setAttribute('min', today);
});