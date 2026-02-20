// =============================
// 1) Your message stored in a DICTIONARY / OBJECT
// =============================
const messageDict = {
  title: "🎉 Hi Jonang, Happy Birthday. 🎂💛",
  lines: [
    "Today is your day, and I just want you to know how grateful I am that you’re part of my everyday life. From school mornings to stressful capstone nights, you’ve been more than just a partner in a project — you’ve been my constant companion.",
    "",
    "I know I tease you a lot. I pressure you sometimes. I push you to build things that feel difficult. But please understand, I do that because I see how capable you are. I believe in you more than you probably realize. I want you ready for every challenge that comes your way.",
    "",
    "You might think I randomly take photos of you, but you already know it’s not random. I keep them because these moments matter. One day, when everything changes and we look back at this season of life, I want you to remember how strong you were, how determined, and how bright you smiled even when things were hard.",
    "",
    "Even when you “kurot” me or get a little scary when you’re mad, I still care about you the same. Maybe even more. Because behind that strong personality is someone who works hard, tries her best, and deserves to feel appreciated.",
    "",
    "More than success, more than projects, more than achievements — I just hope you stay happy. Stay in a good mood. Stay thankful. Life will get harder sometimes, but I hope you always find reasons to smile.",
    "",
    "Today, I’ll follow your orders. It’s your special day. You’re the commander. I’ll do what you say… except for the impossible ones, of course. 😌",
    "",
    "Just enjoy being celebrated.",
    "Happy Birthday, Jonang.",
    "I’m always here — cheering for you quietly, pushing you when needed, and caring for you in ways you may not always see. 💛✨"
  ]
};

// =============================
// 2) Gallery images (put these files in /assets)
// =============================
const photos = [
  "assets/jonang5.jpeg",
  "assets/jonang2.jpg",
  "assets/jonang3.jpeg",
  "assets/jonang4.jpeg",
];

// =============================
// Elements
// =============================
const btnStart = document.getElementById("btnStart");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const messageBox = document.getElementById("messageBox");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const btnCelebrate = document.getElementById("btnCelebrate");
const btnMusic = document.getElementById("btnMusic");
const bgm = document.getElementById("bgm");

const confettiCanvas = document.getElementById("confetti");
const heartsLayer = document.getElementById("heartsLayer");

// Lightbox
const galleryEl = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

// =============================
// 3) Line-by-line rendering logic
// =============================
let idx = -1; // current line index shown

function updateProgress() {
  const total = messageDict.lines.length;
  const shown = Math.max(0, idx + 1);
  progressText.textContent = `${shown} / ${total}`;
  progressBar.style.width = `${(shown / total) * 100}%`;

  btnPrev.disabled = idx <= 0;
  btnNext.disabled = idx >= total - 1;
}

function addLine(text) {
  const p = document.createElement("p");
  p.className = "line";
  p.textContent = text;
  messageBox.appendChild(p);

  // animate in
  requestAnimationFrame(() => p.classList.add("show"));

  // auto scroll inside the message box
  messageBox.scrollTop = messageBox.scrollHeight;
}

function removeLastLine() {
  const last = messageBox.lastElementChild;
  if (!last) return;
  last.classList.remove("show");
  setTimeout(() => last.remove(), 250);
}

function startMessage() {
  messageBox.innerHTML = "";

  // Add the title line first
  idx = -1;
  addLine(messageDict.title);
  idx = 0; // title counts as the first displayed (but not part of lines)
  // We'll treat lines separately for progress
  // So set special mode: display title + then lines.
  // We'll manage progress against messageDict.lines, not title.
  idx = -1;

  btnNext.disabled = false;
  btnPrev.disabled = true;
  updateProgress();
}

function showNext() {
  if (idx >= messageDict.lines.length - 1) return;
  idx++;
  addLine(messageDict.lines[idx]);
  updateProgress();
}

function showPrev() {
  if (idx < 0) return;
  removeLastLine();
  idx--;
  updateProgress();
}

// =============================
// 4) Gallery builder
// =============================
function buildGallery() {
  galleryEl.innerHTML = "";
  photos.forEach((src) => {
    const box = document.createElement("div");
    box.className = "photo";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Jonang photo";
    box.appendChild(img);

    box.addEventListener("click", () => {
      lightboxImg.src = src;
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });

    galleryEl.appendChild(box);
  });
}

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
  }
});

// =============================
// 5) Confetti (simple canvas)
// =============================
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth * devicePixelRatio;
  confettiCanvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
function launchConfetti(count = 180) {
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * w,
      y: -20 * devicePixelRatio,
      r: (Math.random() * 6 + 2) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 2.2 * devicePixelRatio,
      vy: (Math.random() * 2.5 + 2.5) * devicePixelRatio,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      life: 0,
      maxLife: 260 + Math.random() * 120
    });
  }
}

function confettiLoop() {
  const ctx = confettiCanvas.getContext("2d");
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces = confettiPieces.filter(p => p.life < p.maxLife);
  confettiPieces.forEach(p => {
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    // gentle gravity
    p.vy += 0.015 * devicePixelRatio;

    // draw
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // no fixed colors requested; use soft random
    const hue = (p.life * 3 + p.x / 10) % 360;
    ctx.fillStyle = `hsla(${hue}, 85%, 70%, 0.9)`;

    ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    ctx.restore();
  });

  requestAnimationFrame(confettiLoop);
}
confettiLoop();

// =============================
// 6) Floating hearts
// =============================
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💛" : "💗";

  const left = Math.random() * 100;
  heart.style.left = `${left}vw`;
  heart.style.bottom = `-30px`;
  heart.style.animationDuration = `${6 + Math.random() * 4}s`;
  heart.style.fontSize = `${14 + Math.random() * 14}px`;

  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 11000);
}

// =============================
// Events
// =============================
btnStart.addEventListener("click", () => {
  startMessage();
  // show first line automatically
  showNext();
  showNext();
  showNext();
});

btnNext.addEventListener("click", showNext);
btnPrev.addEventListener("click", showPrev);

btnCelebrate.addEventListener("click", () => {
  launchConfetti(220);
  for (let i = 0; i < 20; i++) setTimeout(spawnHeart, i * 120);
});

btnMusic.addEventListener("click", async () => {
  try {
    if (bgm.paused) {
      await bgm.play();
      btnMusic.textContent = "Pause Music ⏸";
    } else {
      bgm.pause();
      btnMusic.textContent = "Play Music ♪";
    }
  } catch (err) {
    alert("Add your own song as assets/song.mp3, then try again 😊");
  }
});

// Ambient hearts (soft)
setInterval(() => {
  if (Math.random() < 0.45) spawnHeart();
}, 650);

// Init
buildGallery();
updateProgress();