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

/* ----------------------------- canvas graph ----------------------------- */
(function graph() {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, nodes = [], raf;
  const mouse = { x: -9999, y: -9999, active: false };

  function accent() {
    return getComputedStyle(root).getPropertyValue("--accent-2").trim() || "#60a5fa";
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(70, Math.floor((innerWidth * innerHeight) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr,
      r: (Math.random() * 1.6 + 0.8) * dpr,
      hub: Math.random() < 0.12,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const a = accent();
    const LINK = 140 * dpr;
    const MOUSE = 200 * dpr;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      if (mouse.active) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE) {
          const f = (1 - d / MOUSE) * 0.012;
          n.x += dx * f; n.y += dy * f;
        }
      }
    }

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a1 = nodes[i], a2 = nodes[j];
        const dx = a1.x - a2.x, dy = a1.y - a2.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          const o = (1 - d / LINK) * 0.5;
          ctx.strokeStyle = hexA(a, o * 0.5);
          ctx.lineWidth = dpr * 0.6;
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();
        }
      }
      // link to cursor
      if (mouse.active) {
        const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE) {
          ctx.strokeStyle = hexA(a, (1 - d / MOUSE) * 0.6);
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }

    // nodes
    for (const n of nodes) {
      ctx.fillStyle = n.hub ? a : hexA(a, 0.7);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.hub ? n.r * 1.8 : n.r, 0, Math.PI * 2);
      ctx.fill();
      if (n.hub) {
        ctx.strokeStyle = hexA(a, 0.25);
        ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2); ctx.stroke();
      }
    }
    raf = requestAnimationFrame(step);
  }

  function hexA(hex, alpha) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
  }

  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; mouse.active = true; });
  addEventListener("pointerleave", () => { mouse.active = false; });
  addEventListener("blur", () => { mouse.active = false; });

  resize();
  if (reduce) { step(); cancelAnimationFrame(raf); ctx.globalAlpha = 1; }
  else step();
})();
