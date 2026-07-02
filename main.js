// ---------------------------------------------------------------------------
// dkcb.github.io — hand-written, no framework.
// Hero background: an "agent spend graph" — nodes are agents/wallets, edges are
// flows. It drifts on its own and leans toward the cursor.
// ---------------------------------------------------------------------------

/* ----------------------------- data ----------------------------- */
const PROJECTS = [
  {
    name: "FLUX",
    tag: "agentic commerce",
    accent: "#6ee7b7",
    desc: "A gateway that lets AI agents hold wallets and make payments under human-set rules — built by a team in a 3-day megathon. My part: the React operator dashboard.",
    chips: ["React", "TypeScript", "Vite"],
    honest: "Front-end (~12k LOC) is mine; backend by teammates. Ships with a mock backend so it's demoable with no server.",
    href: "https://github.com/dkcb/flux",
  },
  {
    name: "ft_transcendence",
    tag: "real-time web",
    accent: "#60a5fa",
    desc: "Full single-page app where users play live multiplayer Pong and chat. 2FA auth, friends, match history, achievements.",
    chips: ["TypeScript", "NestJS", "React", "WebSockets"],
    honest: "42 group project.",
    href: "https://github.com/dkcb/ft_transcendence",
  },
  {
    name: "ft_linear_regression",
    tag: "ML from scratch",
    accent: "#f0abfc",
    desc: "Predicts a car's price from mileage with gradient-descent linear regression — the math hand-written, no ML libraries.",
    chips: ["Python", "gradient descent"],
    honest: "Includes normalization + divergence/NaN safeguards.",
    href: "https://github.com/dkcb/ft_linear_regression",
  },
  {
    name: "minishell",
    tag: "systems / C",
    accent: "#fbbf24",
    desc: "A Bash-like shell: tokenizing, parsing, pipes, redirections, heredocs, variable expansion, built-ins and signal handling.",
    chips: ["C", "Unix", "processes"],
    honest: "42 group project. fork/execve/dup2/pipe under the hood.",
    href: "https://github.com/dkcb/minishell",
  },
  {
    name: "calculator_ts",
    tag: "spec-driven",
    accent: "#34d399",
    desc: "A small web calculator whose logic is written test-first against a written spec, covered by Jest.",
    chips: ["TypeScript", "Jest"],
    honest: "12 passing unit tests.",
    href: "https://github.com/dkcb/calculator_ts",
  },
  {
    name: "C++ modules",
    tag: "OOP fundamentals",
    accent: "#a78bfa",
    desc: "The 42 C++ modules (CPP00–06, 08–09): classes, polymorphism, operator overloading, exceptions, casts and the STL.",
    chips: ["C++98", "OOP"],
    honest: "Curriculum coursework, C++98 norm.",
    href: "https://github.com/dkcb/C-",
  },
];

const STACK = [
  ["Languages", "C · C++ · TypeScript · Python"],
  ["Web", "React · Vite · TypeScript (+ Node/NestJS via team projects)"],
  ["Data", "Python · matplotlib · a model written from scratch"],
  ["Tooling", "Git · Linux · Jest · Docker"],
];

const TYPE_LINES = [
  "front-ends for AI-agent platforms.",
  "shells, in C.",
  "web apps in TypeScript.",
  "ML from scratch.",
];

/* ----------------------------- render cards ----------------------------- */
const cardsEl = document.getElementById("cards");
cardsEl.innerHTML = PROJECTS.map((p) => `
  <a class="card" href="${p.href}" target="_blank" rel="noopener" style="--card-accent:${p.accent}">
    <div class="card-top">
      <span class="card-tag">${p.tag}</span>
      <span class="card-arrow">↗</span>
    </div>
    <h3>${p.name}</h3>
    <p>${p.desc}</p>
    <div class="meta">${p.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
    <div class="honest">${p.honest}</div>
  </a>`).join("");

// pointer-tracked glow + subtle tilt
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    const rx = ((y / r.height) - 0.5) * -5;
    const ry = ((x / r.width) - 0.5) * 5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

/* ----------------------------- render stack ----------------------------- */
document.getElementById("stack-grid").innerHTML = STACK
  .map(([k, v]) => `<div class="s"><b>${k}</b> &nbsp;${v}</div>`)
  .join("");

/* ----------------------------- scroll reveal ----------------------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en, i) => {
    if (en.isIntersecting) {
      en.target.style.animationDelay = `${(i % 6) * 60}ms`;
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".card, .stack .s").forEach((el) => io.observe(el));

/* ----------------------------- typewriter ----------------------------- */
(function typer() {
  const el = document.getElementById("typer");
  let li = 0, ci = 0, deleting = false;
  function tick() {
    const word = TYPE_LINES[li];
    el.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(tick, 55 + Math.random() * 50); }
    else if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1600); }
    else if (deleting && ci > 0) { ci--; setTimeout(tick, 28); }
    else { deleting = false; li = (li + 1) % TYPE_LINES.length; setTimeout(tick, 240); }
  }
  tick();
})();

/* ----------------------------- theme toggle ----------------------------- */
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);
function toggleTheme() {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) toggleTheme(); });

/* --------------------- canvas: Octocat turret ---------------------
   The GitHub Octocat is the hub of the distribution graph. Satellites drift
   around it, dashed channels march toward the hub rim, and packets flow along
   the lines in a calm banner-like loop. */
(function octoTurret() {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, raf;

  const PALETTE = ["#6ee7b7", "#60a5fa", "#f0abfc", "#fbbf24", "#a78bfa", "#34d399"];
  // GitHub Octocat mark (16x16 viewBox) as a reusable canvas path.
  const OCTO = new Path2D("M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");

  const HUB_BASE = 48;
  const HUB_RIM = 30;
  const SATELLITES = [
    { dx: -140, dy: -70, ampX: 8, ampY: 6, color: "#60a5fa", r: 4, dur: 2400, phase: 0.0 },
    { dx: 120, dy: -60, ampX: 10, ampY: 5, color: "#60a5fa", r: 4, dur: 3000, phase: 0.8 },
    { dx: 80, dy: 80, ampX: 8, ampY: 7, color: "#f0abfc", r: 4, dur: 2700, phase: 1.5 },
    { dx: -100, dy: 70, ampX: 7, ampY: 8, color: "#60a5fa", r: 3.5, dur: 3300, phase: 0.9 },
    { dx: 170, dy: 20, ampX: 6, ampY: 5, color: "#6ee7b7", r: 3.5, dur: 3600, phase: 2.2 },
  ];

  const octo = { x: 0, y: 0, size: 0, bob: 0 };
  let channels = [], parts = [], last = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function hubR() {
    return HUB_RIM * (octo.size / HUB_BASE);
  }

  function randomEndpoint() {
    const mx = w * 0.12;
    const my = h * 0.12;
    const hubX = octo.x || w * 0.72;
    const hubY = octo.y || h * 0.45;
    let x = hubX, y = hubY;
    for (let i = 0; i < 8; i++) {
      x = rand(mx, Math.max(mx + 1, w - mx));
      y = rand(my, Math.max(my + 1, h - my));
      if (Math.hypot(x - hubX, y - hubY) > Math.min(w, h) * 0.16) break;
    }
    return { x, y };
  }

  function scaleForZ(z) {
    return clamp(1.6 / Math.max(0.35, 1.6 + z), 0.45, 2.4);
  }

  function trimToHub(x, y, hx, hy, rim) {
    const dx = hx - x;
    const dy = hy - y;
    const d = Math.hypot(dx, dy) || 1;
    return { x: hx - (dx / d) * rim, y: hy - (dy / d) * rim };
  }

  function addSplash(x, y, color) {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + rand(-0.18, 0.18);
      const sp = rand(0.7, 2.2) * dpr;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(0.8, 1.6) * dpr, color, life: 1 });
    }
  }

  function makeChannel(spec, now) {
    const sat = { ...spec };
    sat.baseX = 0;
    sat.baseY = 0;
    sat.phaseX = spec.phase * 1.7 + rand(-0.2, 0.2);
    sat.phaseY = spec.phase * 2.1 + rand(-0.2, 0.2);
    sat.packetPhase = spec.phase * 900 + rand(0, spec.dur);
    sat.packetDur = spec.dur;
    sat.packetZ0 = rand(0.15, 0.65);
    sat.packetZ1 = rand(-0.15, 0.35);
    sat.lastCycle = Math.floor((now + sat.packetPhase) / sat.packetDur);
    sat.dotR = spec.r * dpr;
    return sat;
  }

  function seedChannels(now) {
    channels = SATELLITES.map((spec) => makeChannel(spec, now));
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    octo.size = Math.max(34, Math.min(66, innerWidth / 17)) * dpr;
    octo.x = w * 0.72;
    octo.y = h * 0.45;
    parts = [];
    seedChannels(performance.now());
  }

  function satellitePos(ch, now) {
    const s = octo.size / HUB_BASE;
    const bx = octo.x + ch.dx * s;
    const by = octo.y + ch.dy * s;
    return {
      x: bx + Math.sin(now / 900 + ch.phaseX) * ch.ampX * dpr * s,
      y: by + Math.sin(now / 1100 + ch.phaseY) * ch.ampY * dpr * s,
    };
  }

  function packetPos(ch, now, sat, rim, staticMode) {
    const t = staticMode ? 0.42 : ((now + ch.packetPhase) % ch.packetDur) / ch.packetDur;
    const x = sat.x + (rim.x - sat.x) * t;
    const y = sat.y + (rim.y - sat.y) * t;
    const z = ch.packetZ0 + (ch.packetZ1 - ch.packetZ0) * t;
    return { x, y, z, t };
  }

  function drawSatellite(ch, sat, now, staticMode) {
    const pulse = staticMode ? 0 : 0.5 + 0.5 * Math.sin(now / 900 + ch.phaseX * 1.3);
    ctx.fillStyle = ch.color;
    ctx.globalAlpha = staticMode ? 0.7 : 0.55 + pulse * 0.45;
    ctx.beginPath();
    ctx.arc(sat.x, sat.y, ch.dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawChannel(ch, now, staticMode) {
    const hubX = octo.x;
    const hubY = octo.y + octo.bob;
    const sat = satellitePos(ch, now);
    const rim = trimToHub(sat.x, sat.y, hubX, hubY, hubR());

    ctx.save();
    ctx.lineCap = "round";
    ctx.setLineDash([4 * dpr, 8 * dpr]);
    ctx.lineDashOffset = staticMode ? 0 : -((now / 18) + ch.phaseX * 40);

    ctx.strokeStyle = hexA("#60a5fa", 0.11);
    ctx.shadowBlur = 10 * dpr;
    ctx.shadowColor = "#60a5fa";
    ctx.lineWidth = 5 * dpr;
    ctx.beginPath();
    ctx.moveTo(sat.x, sat.y);
    ctx.lineTo(rim.x, rim.y);
    ctx.stroke();

    ctx.strokeStyle = hexA("#60a5fa", 0.32);
    ctx.lineWidth = 1.2 * dpr;
    ctx.beginPath();
    ctx.moveTo(sat.x, sat.y);
    ctx.lineTo(rim.x, rim.y);
    ctx.stroke();
    ctx.restore();

    drawSatellite(ch, sat, now, staticMode);

    const p = packetPos(ch, now, sat, rim, staticMode);
    const scale = scaleForZ(p.z);
    const pr = Math.max(0, 2.6 * dpr * scale);
    ctx.save();
    ctx.fillStyle = ch.color;
    ctx.shadowBlur = 12 * dpr * scale;
    ctx.shadowColor = ch.color;
    ctx.globalAlpha = staticMode ? 0.9 : 0.75 + 0.25 * Math.sin(Math.PI * p.t);
    ctx.beginPath();
    ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!staticMode) {
      const cycle = Math.floor((now + ch.packetPhase) / ch.packetDur);
      if (cycle !== ch.lastCycle) {
        ch.lastCycle = cycle;
        addSplash(rim.x, rim.y, ch.color);
      }
    }
  }

  function step(now) {
    const dt = Math.min(2.5, (now - last) / 16.67) || 1;
    last = now;
    ctx.clearRect(0, 0, w, h);

    octo.bob = Math.sin(now / 1100) * 1.8 * dpr;

    for (const p of parts) {
      p.life -= 0.018 * dt;
      p.vx *= 0.972;
      p.vy *= 0.972;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.fillStyle = hexA(p.color, Math.max(0, p.life));
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.r * Math.max(0, p.life)), 0, Math.PI * 2);
      ctx.fill();
    }
    parts = parts.filter((p) => p.life > 0);

    for (const ch of channels) drawChannel(ch, now, false);
    drawOcto(now);
    raf = requestAnimationFrame(step);
  }

  function drawOcto(now) {
    const s = octo.size, k = s / 16;
    const pulse = 0.5 + 0.5 * Math.sin(now / 500);
    ctx.save();
    ctx.translate(octo.x, octo.y + octo.bob);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.6 + pulse * 6 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = hexA("#6ee7b7", 0.06); ctx.fill();
    const g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
    g.addColorStop(0, "#6ee7b7"); g.addColorStop(0.5, "#60a5fa"); g.addColorStop(1, "#f0abfc");
    ctx.fillStyle = g; ctx.shadowBlur = 16 * dpr; ctx.shadowColor = "#60a5fa";
    ctx.translate(-s / 2, -s / 2); ctx.scale(k, k);
    ctx.fill(OCTO);
    ctx.restore();
  }

  function hexA(hex, alpha) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${Math.max(0, alpha).toFixed(3)})`;
  }

  addEventListener("resize", resize);

  resize();
  if (reduce) {
    ctx.clearRect(0, 0, w, h);
    octo.bob = Math.sin(performance.now() / 1100) * 1.8 * dpr;
    for (const ch of channels) drawChannel(ch, performance.now(), true);
    drawOcto(performance.now());
  } else {
    raf = requestAnimationFrame(step);
  }
})();
