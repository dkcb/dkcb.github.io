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
   viewport on its own, and channels flicker, carry packets, and respawn.
   Click to seed a channel on demand. */
(function octoTurret() {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, raf;

  const PALETTE = ["#6ee7b7", "#60a5fa", "#f0abfc", "#fbbf24", "#a78bfa", "#34d399"];
  // GitHub Octocat mark (16x16 viewBox) as a reusable canvas path.
  const OCTO = new Path2D("M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");

  const FOCAL = 1.6;
  const Z_MIN = -0.8;
  const Z_MAX = 0.8;
  const WAYPOINT_MARGIN = 0.12;
  const WARMUP_MS = 600;
  const FADE_MS = 400;
  const CHANNEL_MIN = 5;
  const CHANNEL_MAX = 7;

  const octo = { x: 0, y: 0, size: 0, waypointX: 0, waypointY: 0, bob: 0 };
  let channels = [], parts = [], last = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function randomWaypoint() {
    const mx = w * WAYPOINT_MARGIN;
    const my = h * WAYPOINT_MARGIN;
    octo.waypointX = rand(mx, Math.max(mx + 1, w - mx));
    octo.waypointY = rand(my, Math.max(my + 1, h - my));
  }

  function randomEndpoint() {
    const mx = w * WAYPOINT_MARGIN;
    const my = h * WAYPOINT_MARGIN;
    const hubX = octo.x || w * 0.72;
    const hubY = octo.y || h * 0.42;
    let x = hubX, y = hubY;
    for (let i = 0; i < 8; i++) {
      x = rand(mx, Math.max(mx + 1, w - mx));
      y = rand(my, Math.max(my + 1, h - my));
      if (Math.hypot(x - hubX, y - hubY) > Math.min(w, h) * 0.16) break;
    }
    return { x, y };
  }

  function scaleForZ(z) {
    return clamp(FOCAL / Math.max(0.35, FOCAL + z), 0.45, 2.4);
  }

  function addSplash(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + rand(-0.2, 0.2);
      const sp = rand(0.8, 2.8) * dpr;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(0.9, 1.8) * dpr, color, life: 1 });
    }
  }

  function makeChannel(now, opts = {}) {
    const endpoint = opts.endpoint || randomEndpoint();
    const dir = opts.dir ?? (Math.random() < 0.5 ? -1 : 1);
    const travelMs = opts.travelMs ?? rand(2400, 3600);
    const ch = {
      endpointX: endpoint.x,
      endpointY: endpoint.y,
      color: opts.color || pick(PALETTE),
      dir,
      travelMs,
      warmupMs: WARMUP_MS,
      fadeMs: FADE_MS,
      cycleMs: 0,
      phaseStart: now,
      packetR: rand(2.2, 3) * dpr,
      startZ: dir > 0 ? 0 : rand(0.35, 0.8),
      endZ: dir > 0 ? rand(0.35, 0.8) : 0,
      splashed: false,
    };
    ch.cycleMs = ch.warmupMs + ch.travelMs + ch.fadeMs;
    if (opts.phaseOffset) ch.phaseStart = now - opts.phaseOffset;
    return ch;
  }

  function respawnChannel(ch, now, opts = {}) {
    const next = makeChannel(now, opts);
    ch.endpointX = next.endpointX;
    ch.endpointY = next.endpointY;
    ch.color = next.color;
    ch.dir = next.dir;
    ch.travelMs = next.travelMs;
    ch.warmupMs = next.warmupMs;
    ch.fadeMs = next.fadeMs;
    ch.cycleMs = next.cycleMs;
    ch.phaseStart = next.phaseStart;
    ch.packetR = next.packetR;
    ch.startZ = next.startZ;
    ch.endZ = next.endZ;
    ch.splashed = next.splashed;
    return ch;
  }

  function seedChannels(now) {
    channels = [];
    const target = clamp(Math.round(innerWidth / 280), CHANNEL_MIN, CHANNEL_MAX);
    for (let i = 0; i < target; i++) {
      const ch = makeChannel(now);
      ch.phaseStart = now - rand(0, ch.cycleMs);
      channels.push(ch);
    }
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
    parts = [];
    seedChannels(performance.now());
  }

  function warmOpacity(t) {
    const keys = [0, 0.12, 0.22, 0.4, 0.58, 0.78, 1];
    const vals = [0, 0.6, 0, 0.95, 0.2, 1, 1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i]) {
        const u = (t - keys[i - 1]) / (keys[i] - keys[i - 1] || 1);
        return vals[i - 1] + (vals[i] - vals[i - 1]) * clamp(u, 0, 1);
      }
    }
    return 1;
  }

  function lineAlphaFor(ch, elapsed) {
    if (elapsed < ch.warmupMs) return warmOpacity(elapsed / ch.warmupMs);
    if (elapsed < ch.warmupMs + ch.travelMs) return 0.76;
    if (elapsed < ch.cycleMs) return Math.max(0, 0.76 * (1 - (elapsed - ch.warmupMs - ch.travelMs) / ch.fadeMs));
    return 0;
  }

  function packetState(ch, elapsed) {
    const travelStart = ch.warmupMs;
    const travelEnd = ch.warmupMs + ch.travelMs;
    if (elapsed < travelStart || elapsed > travelEnd) return null;
    const t = clamp((elapsed - travelStart) / ch.travelMs, 0, 1);
    const hubX = octo.x, hubY = octo.y + octo.bob;
    const srcX = ch.dir > 0 ? hubX : ch.endpointX;
    const srcY = ch.dir > 0 ? hubY : ch.endpointY;
    const dstX = ch.dir > 0 ? ch.endpointX : hubX;
    const dstY = ch.dir > 0 ? ch.endpointY : hubY;
    const x = srcX + (dstX - srcX) * t;
    const y = srcY + (dstY - srcY) * t;
    const z = ch.startZ + (ch.endZ - ch.startZ) * t;
    return { x, y, z, t };
  }

  function drawChannel(ch, now) {
    const elapsed = now - ch.phaseStart;
    const hubX = octo.x, hubY = octo.y + octo.bob;
    const lineAlpha = lineAlphaFor(ch, elapsed);
    const glowAlpha = lineAlpha * 0.18;
    const bx = ch.endpointX, by = ch.endpointY;

    ctx.lineCap = "round";
    ctx.strokeStyle = hexA(ch.color, glowAlpha);
    ctx.shadowBlur = 14 * dpr;
    ctx.shadowColor = ch.color;
    ctx.lineWidth = 5 * dpr;
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.strokeStyle = hexA(ch.color, lineAlpha);
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const packet = packetState(ch, elapsed);
    if (packet) {
      const scale = scaleForZ(packet.z);
      const r = Math.max(0, ch.packetR * scale);
      ctx.fillStyle = hexA(ch.color, 0.95);
      ctx.shadowBlur = 12 * dpr * scale;
      ctx.shadowColor = ch.color;
      ctx.beginPath();
      ctx.arc(packet.x, packet.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (!ch.splashed && elapsed >= ch.warmupMs + ch.travelMs) {
      ch.splashed = true;
      const x = ch.dir > 0 ? ch.endpointX : hubX;
      const y = ch.dir > 0 ? ch.endpointY : hubY;
      addSplash(x, y, ch.color);
    }
  }

  function step(now) {
    const dt = Math.min(2.5, (now - last) / 16.67) || 1; last = now;
    ctx.clearRect(0, 0, w, h);

    octo.bob = Math.sin(now / 650) * 2.5 * dpr;
    if (Math.hypot(octo.waypointX - octo.x, octo.waypointY - octo.y) < 30 * dpr) randomWaypoint();
    octo.x += (octo.waypointX - octo.x) * 0.003 * dt;
    octo.y += (octo.waypointY - octo.y) * 0.003 * dt;

    for (const ch of channels) {
      while (now - ch.phaseStart >= ch.cycleMs) respawnChannel(ch, ch.phaseStart + ch.cycleMs);
      drawChannel(ch, now);
    }

    for (const p of parts) {
      p.life -= 0.018 * dt;
      p.vx *= 0.972;
      p.vy = p.vy * 0.972 - 0.015 * dpr;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.fillStyle = hexA(p.color, Math.max(0, p.life));
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.r * Math.max(0, p.life)), 0, Math.PI * 2);
      ctx.fill();
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

  addEventListener("resize", resize);
  addEventListener("pointerdown", (e) => {
    const now = performance.now();
    const ch = makeChannel(now, { endpoint: { x: e.clientX * dpr, y: e.clientY * dpr }, dir: -1 });
    ch.phaseStart = now;
    channels.push(ch);
    while (channels.length > CHANNEL_MAX) channels.shift();
  });

  resize();
  if (reduce) {
    ctx.clearRect(0, 0, w, h);
    for (const ch of channels) {
      const hubX = octo.x, hubY = octo.y + octo.bob;
      ctx.lineCap = "round";
      ctx.strokeStyle = hexA(ch.color, 0.12);
      ctx.shadowBlur = 10 * dpr;
      ctx.shadowColor = ch.color;
      ctx.lineWidth = 4 * dpr;
      ctx.beginPath(); ctx.moveTo(hubX, hubY); ctx.lineTo(ch.endpointX, ch.endpointY); ctx.stroke();
      ctx.strokeStyle = hexA(ch.color, 0.4);
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath(); ctx.moveTo(hubX, hubY); ctx.lineTo(ch.endpointX, ch.endpointY); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = hexA(ch.color, 0.35);
      ctx.beginPath(); ctx.arc(ch.endpointX, ch.endpointY, 2.5 * dpr, 0, Math.PI * 2); ctx.fill();
    }
    drawOcto(performance.now());
  } else {
    raf = requestAnimationFrame(step);
  }
})();
