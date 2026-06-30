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
    desc: "A gateway that lets AI agents hold wallets and make payments under human-set rules: a KYA policy engine, an append-only ledger, and a React operator dashboard.",
    chips: ["TypeScript", "Express", "React", "PostgreSQL", "Drizzle"],
    honest: "~6k-LOC backend; the dashboard ships with a mock backend so it's demoable with no server.",
    href: "https://github.com/dkcb/flux",
  },
  {
    name: "ft_transcendence",
    tag: "real-time web",
    accent: "#60a5fa",
    desc: "Full single-page app where users play live multiplayer Pong and chat. 2FA auth, friends, match history, achievements.",
    chips: ["TypeScript", "NestJS", "React", "WebSockets"],
    honest: "42 group project — built with a team of five.",
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
    desc: "The 42 C++ piscine (CPP00–09): classes, polymorphism, operator overloading, exceptions, casts, templates and the STL.",
    chips: ["C++98", "OOP"],
    honest: "Curriculum coursework, C++98 norm.",
    href: "https://github.com/dkcb/C-",
  },
];

const STACK = [
  ["Languages", "C · C++ · TypeScript · Python"],
  ["Web", "React · Node · Express · NestJS · Vite"],
  ["Data", "PostgreSQL · Drizzle · NumPy"],
  ["ML", "linear models · neural nets (from scratch)"],
  ["Tooling", "Git · Linux · Jest · Docker"],
];

const TYPE_LINES = [
  "systems for AI agents.",
  "shells, in C.",
  "full-stack TypeScript.",
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
   The GitHub Octocat is the hub of the agent-spend graph. It wanders the
   viewport on its own, auto-fires laser bolts at drifting "balls"
   (agents/wallets); a hit pops the ball in a coloured splash, and new balls
   keep spawning so the graph never empties. Click to fire on demand. */
(function octoTurret() {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, raf;

  const PALETTE = ["#6ee7b7", "#60a5fa", "#f0abfc", "#fbbf24", "#a78bfa", "#34d399"];
  // GitHub Octocat mark (16x16 viewBox) as a reusable canvas path.
  const OCTO = new Path2D("M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");

  let balls = [], shots = [], parts = [], TARGET = 20, last = 0;
  const octo = { x: 0, y: 0, size: 0, fireAt: 0, waypointX: 0, waypointY: 0, bob: 0 };
  const FOCAL = 1.6;
  const Z_MIN = -0.8;
  const Z_MAX = 0.8;
  const WAYPOINT_MARGIN = 0.12;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  function randomWaypoint() {
    const mx = w * WAYPOINT_MARGIN;
    const my = h * WAYPOINT_MARGIN;
    octo.waypointX = rand(mx, Math.max(mx + 1, w - mx));
    octo.waypointY = rand(my, Math.max(my + 1, h - my));
  }

  function ballScale(b) {
    return Math.max(0.45, Math.min(2.4, FOCAL / Math.max(0.35, FOCAL + b.z)));
  }

  function spawnBall() {
    const m = 40 * dpr;
    const side = (Math.random() * 4) | 0;
    let x, y, vx, vy;
    switch (side) {
      case 0:
        x = rand(m, w - m); y = m; vx = rand(-0.18, 0.18) * dpr; vy = rand(0.14, 0.38) * dpr;
        break;
      case 1:
        x = w - m; y = rand(m, h - m); vx = rand(-0.38, -0.14) * dpr; vy = rand(-0.18, 0.18) * dpr;
        break;
      case 2:
        x = rand(m, w - m); y = h - m; vx = rand(-0.18, 0.18) * dpr; vy = rand(-0.38, -0.14) * dpr;
        break;
      default:
        x = m; y = rand(m, h - m); vx = rand(0.14, 0.38) * dpr; vy = rand(-0.18, 0.18) * dpr;
        break;
    }
    balls.push({
      x, y, vx, vy,
      r: rand(3.2, 6.5) * dpr,
      color: pick(PALETTE),
      born: performance.now(),
      z: rand(Z_MIN, Z_MAX),
      zVel: rand(-0.03, 0.03),
    });
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    octo.size = Math.max(34, Math.min(66, innerWidth / 17)) * dpr;
    octo.x = w * 0.72; octo.y = h * 0.42; octo.bob = 0;
    randomWaypoint();
    TARGET = Math.max(10, Math.min(26, Math.floor((innerWidth * innerHeight) / 52000)));
    balls = []; shots = []; parts = [];
    for (let i = 0; i < TARGET; i++) spawnBall();
  }

  function fireAt(b) {
    if (!b || b.dead) return;
    b.targeted = true;
    const oy = octo.y + octo.bob;
    shots.push({ x: octo.x, y: oy - octo.size * 0.12, target: b, color: b.color, speed: 9 * dpr });
  }

  function explode(b) {
    b.dead = true;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + Math.random();
      const sp = rand(1, 4.2) * dpr;
      parts.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(1, 2.6) * dpr, color: b.color, life: 1 });
    }
    parts.push({ x: b.x, y: b.y, ring: true, r: Math.max(0, b.drawR ?? b.r), color: b.color, life: 1 });
  }

  function step(now) {
    const dt = Math.min(2.5, (now - last) / 16.67) || 1; last = now;
    ctx.clearRect(0, 0, w, h);

    octo.bob = Math.sin(now / 650) * 2.5 * dpr;
    if (Math.hypot(octo.waypointX - octo.x, octo.waypointY - octo.y) < 30 * dpr) randomWaypoint();
    octo.x += (octo.waypointX - octo.x) * 0.012 * dt;
    octo.y += (octo.waypointY - octo.y) * 0.012 * dt;

    const liveCount = balls.reduce((n, b) => n + (b.dead ? 0 : 1), 0);
    if (liveCount < TARGET && Math.random() < 0.05 * dt) spawnBall();
    if (now > octo.fireAt) { fireAt(nearestBall(octo.x, octo.y)); octo.fireAt = now + rand(360, 780); }

    for (const b of balls) {
      if (b.dead) continue;
      const dx = octo.x - b.x, dy = octo.y - b.y, d = Math.hypot(dx, dy) || 1;
      const accel = 0.03 * dpr;
      b.vx += (dx / d) * accel * dt;
      b.vy += (dy / d) * accel * dt;
      b.vx *= Math.pow(0.987, dt);
      b.vy *= Math.pow(0.987, dt);
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < b.r) { b.x = b.r; if (b.vx < 0) b.vx *= -0.85; }
      if (b.x > w - b.r) { b.x = w - b.r; if (b.vx > 0) b.vx *= -0.85; }
      if (b.y < b.r) { b.y = b.r; if (b.vy < 0) b.vy *= -0.85; }
      if (b.y > h - b.r) { b.y = h - b.r; if (b.vy > 0) b.vy *= -0.85; }

      b.vx += (rand(-0.006, 0.006) * dpr) * 0.05 * dt;
      b.vy += (rand(-0.006, 0.006) * dpr) * 0.05 * dt;

      b.zVel += (-b.z) * 0.018 * dt;
      b.zVel *= Math.pow(0.99, dt);
      b.z += b.zVel * dt;
      if (b.z < Z_MIN) { b.z = Z_MIN; if (b.zVel < 0) b.zVel *= -0.65; }
      if (b.z > Z_MAX) { b.z = Z_MAX; if (b.zVel > 0) b.zVel *= -0.65; }
      b.scale = ballScale(b);
      b.drawR = Math.max(0, b.r * b.scale);
    }

    // shots + beams
    for (const s of shots) {
      const t = s.target;
      if (!t || t.dead) { s.done = true; continue; }
      const dx = t.x - s.x, dy = t.y - s.y, d = Math.hypot(dx, dy) || 1;
      const hitR = Math.max(0, t.drawR ?? t.r);
      if (d < s.speed * dt + hitR) { explode(t); s.done = true; }
      else { s.x += (dx / d) * s.speed * dt; s.y += (dy / d) * s.speed * dt; }
      const g = ctx.createLinearGradient(octo.x, octo.y + octo.bob, s.x, s.y);
      g.addColorStop(0, hexA(s.color, 0)); g.addColorStop(1, hexA(s.color, 0.9));
      ctx.strokeStyle = g; ctx.lineWidth = 2 * dpr;
      ctx.shadowBlur = 12 * dpr; ctx.shadowColor = s.color;
      ctx.beginPath(); ctx.moveTo(octo.x, octo.y + octo.bob - octo.size * 0.12); ctx.lineTo(s.x, s.y); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, 2.4 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    shots = shots.filter((s) => !s.done);

    balls = balls.filter((b) => !b.dead);
    const visibleBalls = balls.slice().sort((a, b) => b.z - a.z);

    // balls
    for (const b of visibleBalls) {
      const scale = b.scale ?? ballScale(b);
      const r = Math.max(0, b.drawR ?? b.r * scale);
      ctx.fillStyle = b.color;
      ctx.shadowBlur = 8 * dpr * scale;
      ctx.shadowColor = hexA(b.color, 0.85);
      ctx.globalAlpha = b.targeted ? 1 : 0.9;
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }

    // splash particles
    for (const p of parts) {
      p.life -= 0.02 * dt;
      if (p.ring) {
        p.r += 2.6 * dpr * dt;
        ctx.strokeStyle = hexA(p.color, Math.max(0, p.life) * 0.6); ctx.lineWidth = 2 * dpr;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
      } else {
        p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.05 * dpr;
        p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.fillStyle = hexA(p.color, Math.max(0, p.life));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * Math.max(0, p.life), 0, Math.PI * 2); ctx.fill();
      }
    }
    parts = parts.filter((p) => p.life > 0);

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

  function nearestBall(x, y) {
    let best = null, bd = Infinity;
    for (const b of balls) {
      if (b.dead) continue;
      const d = Math.hypot(b.x - x, b.y - y);
      if (d < bd) { bd = d; best = b; }
    }
    return best;
  }

  addEventListener("resize", resize);
  // click anywhere to fire on demand at the nearest ball
  addEventListener("pointerdown", (e) => { if (dpr) fireAt(nearestBall(e.clientX * dpr, e.clientY * dpr)); });

  resize();
  if (reduce) {
    const visibleBalls = balls.slice().sort((a, b) => b.z - a.z);
    for (const b of visibleBalls) {
      const scale = ballScale(b);
      ctx.fillStyle = b.color; ctx.shadowBlur = 8 * dpr * scale; ctx.shadowColor = hexA(b.color, 0.85);
      ctx.beginPath(); ctx.arc(b.x, b.y, Math.max(0, b.r * scale), 0, Math.PI * 2); ctx.fill();
    }
    drawOcto(performance.now());
  } else raf = requestAnimationFrame(step);
})();
