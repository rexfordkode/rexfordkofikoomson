#!/usr/bin/env node

/**
 * Rexford Kofi Koomson - Antigravity & Gemini Interactive CLI Console (v1.3.0)
 * An AI-Native Terminal Experience, Live Telemetry Dashboard & Agent
 * Portfolio: https://rexfordkofikoomson.me
 */

import { spawn } from "node:child_process";
import https from "node:https";
import readline from "node:readline";

// Environment & flags detection
const isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY && !process.env.CI);
const isStatic = process.argv.includes("--static") || process.argv.includes("--no-anim") || !isTTY;

// ANSI & Color Utilities
const esc = (code) => `\x1b[${code}m`;
const CSI = "\x1b[";

const reset = esc(0);
const bold = esc(1);
const dim = esc(2);
const italic = esc(3);
const underline = esc(4);

// 24-bit Truecolor helpers (Gemini signature spectrum)
const rgb = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;
const bgRgb = (r, g, b) => `\x1b[48;2;${r};${g};${b}m`;

const colors = {
  cyan: rgb(56, 189, 248),
  brightBlue: rgb(96, 165, 250),
  indigo: rgb(129, 140, 248),
  purple: rgb(168, 85, 247),
  pink: rgb(244, 114, 182),
  yellow: rgb(251, 191, 36),
  emerald: rgb(52, 211, 153),
  red: rgb(248, 113, 113),
  gray: rgb(148, 163, 184),
  darkGray: rgb(71, 85, 105),
  white: rgb(248, 250, 252),
};

const geminiGradientStops = [
  [56, 189, 248],   // Cyan
  [99, 102, 241],   // Indigo
  [168, 85, 247],   // Purple
  [244, 114, 182],  // Pink
];

// Utility: Gradient text generator
function applyGradient(text, colorStops = geminiGradientStops) {
  const chars = [...text];
  const total = chars.length;
  if (total <= 1) return chars.join("");

  return (
    chars
      .map((char, index) => {
        const position = index / (total - 1);
        const segment = position * (colorStops.length - 1);
        const stopIndex = Math.min(Math.floor(segment), colorStops.length - 2);
        const factor = segment - stopIndex;

        const [r1, g1, b1] = colorStops[stopIndex];
        const [r2, g2, b2] = colorStops[stopIndex + 1];

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `${rgb(r, g, b)}${char}`;
      })
      .join("") + reset
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const link = (url, label = url) => `\x1b]8;;${url}\x1b\\${label}\x1b]8;;\x1b\\`;

// Live non-blocking telemetry probe to rexfordkofikoomson.me
let liveTelemetry = {
  tested: false,
  online: true,
  latency: 14,
  isLive: false,
  status: 200,
};

function probePortfolio() {
  const start = Date.now();
  const req = https.request(
    "https://rexfordkofikoomson.me",
    { method: "HEAD", timeout: 2500 },
    (res) => {
      liveTelemetry = {
        tested: true,
        online: res.statusCode < 400,
        latency: Date.now() - start,
        isLive: true,
        status: res.statusCode,
      };
      if (globalApp && globalApp.activeScreen === "menu") {
        globalApp.render();
      }
    }
  );
  req.on("error", () => {
    liveTelemetry = {
      tested: true,
      online: true,
      latency: 12,
      isLive: false,
      status: 200,
    };
  });
  req.on("timeout", () => {
    req.destroy();
  });
  req.end();
}

// Cross-platform browser launcher
function openBrowser(url) {
  const platform = process.platform;
  let cmd = "open";
  let args = [url];
  if (platform === "win32") {
    cmd = "cmd.exe";
    args = ["/c", "start", '""', url];
  } else if (platform !== "darwin") {
    cmd = "xdg-open";
  }
  try {
    const p = spawn(cmd, args, { stdio: "ignore", detached: true });
    p.unref();
    return true;
  } catch {
    return false;
  }
}

// Cross-platform clipboard copy
function copyToClipboard(text) {
  const platform = process.platform;
  try {
    if (platform === "darwin") {
      const p = spawn("pbcopy");
      p.stdin.write(text);
      p.stdin.end();
      return true;
    } else if (platform === "win32") {
      const p = spawn("clip");
      p.stdin.write(text);
      p.stdin.end();
      return true;
    } else {
      const p = spawn("xclip", ["-selection", "clipboard"]);
      p.stdin.write(text);
      p.stdin.end();
      return true;
    }
  } catch {
    return false;
  }
}

// Terminal management & safe screen restoration
let inAltScreen = false;
let globalApp = null;

function enterAltScreen() {
  if (isTTY && !inAltScreen) {
    process.stdout.write(`${CSI}?1049h${CSI}2J${CSI}H${CSI}?25l`);
    inAltScreen = true;
  }
}

function leaveAltScreen() {
  if (inAltScreen) {
    process.stdout.write(`${CSI}?1049l${CSI}?25h${reset}`);
    inAltScreen = false;
  } else {
    process.stdout.write(`${CSI}?25h${reset}\n`);
  }
}

process.on("exit", leaveAltScreen);
process.on("SIGINT", () => {
  leaveAltScreen();
  process.exit(0);
});

// Comprehensive Offline Knowledge Base
const knowledgeBase = [
  {
    triggers: ["who", "about", "bio", "background", "rexford", "intro", "summary"],
    title: "About Rexford Kofi Koomson",
    response: `Rexford is an accomplished Software Engineer, Cloud Architect, and Team Lead holding an M.Sc. in Applied Computer Science from Grand Valley State University (GVSU). With 7+ years of experience, he specializes in high-throughput distributed systems, e-commerce data platforms, cloud-native microservices, and AI-native application architectures.`,
  },
  {
    triggers: ["heatmap", "lead", "senior", "job", "current", "work", "role"],
    title: "Senior Backend Developer & Team Lead @ Heatmap",
    response: `At Heatmap (01/2024 – Present), Rexford leads backend engineering for a high-traffic e-commerce analytics platform. He has architected and shipped 500+ scalable API endpoints, optimized ingestion pipelines handling massive telemetry volume, and engineered low-latency caching layers with AWS and Redis.`,
  },
  {
    triggers: ["gvsu", "education", "degree", "master", "gctu", "university", "college", "school"],
    title: "Education & Credentials",
    response: `• M.Sc. in Applied Computer Science — Grand Valley State University (GVSU), Michigan (2023–2025). Graduate Assistant at Padnos Center for International Student Services.
• B.Sc. in Information Technology — Ghana Communication Technology University (GCTU / GCUC), First-Class Honors.
• Huawei Certified Internetwork Associate (HCIA) & Google Africa / Udacity Android NanoDegree.`,
  },
  {
    triggers: ["stack", "tech", "skills", "languages", "backend", "cloud", "aws", "docker"],
    title: "Technical Stack & Architecture",
    response: `• Languages & Core: Node.js, TypeScript, NestJS, Python, Java, GraphQL Federation, RESTful APIs.
• Cloud & Infrastructure: AWS (Lambda, ECS, RDS, S3, CloudWatch), Docker, Kubernetes, Redis, Serverless, CI/CD.
• Databases & Data: PostgreSQL, MongoDB, MySQL, SQLite, Prisma ORM, TypeORM.
• AI & Integrations: LLM Integration, Agentic Workflows, Telemetry Pipelines.
• Frontend: React, Next.js, Vue, Tailwind CSS, Storyblok CMS.`,
  },
  {
    triggers: ["ai", "llm", "agent", "gemini", "antigravity", "machine learning"],
    title: "AI-Native Engineering & Agentic Systems",
    response: `Rexford builds AI-native systems that embed modern LLMs and agentic orchestration directly into microservices and product pipelines. He leverages AI coding assistants and automation frameworks to accelerate feature velocity, build self-healing pipelines, and deliver intuitive developer experiences.`,
  },
  {
    triggers: ["contact", "email", "reach", "hire", "phone", "location", "portfolio", "website", "social"],
    title: "Contact & Social Nodes",
    response: `• Website/Portfolio: https://rexfordkofikoomson.me
• Email: rexford.kk@gmail.com
• GitHub: https://github.com/rexfordkode
• LinkedIn: https://linkedin.com/in/rexfordkofikoomson
• X (Twitter): https://x.com/originalrexford
• Locations: Grand Rapids, MI, USA & Takoradi/Accra, Ghana`,
  },
];

function answerQuery(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  for (const item of knowledgeBase) {
    if (item.triggers.some((trigger) => q.includes(trigger))) {
      return item;
    }
  }

  return {
    title: "Rexford Telemetry Intelligence",
    response: `I didn't find an exact keyword match, but here is a quick overview:
Rexford is a Cloud Architect, Team Lead, and Software Engineer with an M.Sc. in Applied Computer Science from GVSU.
You can ask about: "Heatmap", "Experience", "Education", "Tech Stack", "AI Systems", or "Contact".
Explore his live interactive portfolio anytime at: https://rexfordkofikoomson.me`,
  };
}

// Optional live Gemini API query if GEMINI_API_KEY is configured
async function queryLiveGemini(prompt, apiKey) {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are the AI persona representing Rexford Kofi Koomson in his CLI portfolio. Answer the following user question concisely (in 2-4 sentences max), speaking proudly and accurately about Rexford.
Rexford's Background:
- Role: Software Engineer, Cloud Architect, Team Lead (7+ years exp)
- Current: Senior Backend Developer & Team Lead at Heatmap (500+ APIs deployed, e-commerce data)
- Education: M.Sc. in Applied Computer Science from Grand Valley State University (GVSU), Michigan; B.Sc. IT from GCTU (First Class).
- Website: https://rexfordkofikoomson.me, Email: rexford.kk@gmail.com
- Stack: Node.js, TypeScript, NestJS, AWS, Docker, Redis, GraphQL, React, AI integrations.

User question: "${prompt}"`,
            },
          ],
        },
      ],
    });

    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 4000,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const data = JSON.parse(body);
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            resolve(text ? text.trim() : null);
          } catch {
            resolve(null);
          }
        });
      }
    );

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.write(payload);
    req.end();
  });
}

// Static card renderer
function renderStaticCard() {
  const topBorder = applyGradient("╭────────────────────────────────────────────────────────────────────────╮");
  const midBorder = applyGradient("├────────────────────────────────────────────────────────────────────────┤");
  const botBorder = applyGradient("╰────────────────────────────────────────────────────────────────────────╯");

  console.log(`\n  ${applyGradient("✦  R E X F O R D   K O F I   K O O M S O N  ✦")}`);
  console.log(`  ${topBorder}`);
  console.log(`  │  ${colors.emerald}●${reset} ${bold}SYSTEM STATUS:${reset} ${colors.emerald}OPERATIONAL${reset}  ${colors.darkGray}│${reset}  ${colors.cyan}UPTIME: 99.97%${reset}  ${colors.darkGray}│${reset}  ${colors.purple}REGION: GLOBAL${reset}    │`);
  console.log(`  ${midBorder}`);
  console.log(`  │                                                                        │`);
  console.log(`  │  ${bold}${colors.white}REXFORD KOFI KOOMSON${reset}  ${colors.gray}(@rexfordkode)${reset}                                  │`);
  console.log(`  │  ${colors.brightBlue}${bold}Software Engineer | Cloud Architect | Team Lead${reset}                       │`);
  console.log(`  │  ${colors.yellow}M.Sc. Applied Computer Science${reset} — Grand Valley State University        │`);
  console.log(`  │                                                                        │`);
  console.log(`  │  ${colors.purple}✦${reset} ${bold}Portfolio:${reset}    ${colors.cyan}${underline}${link("https://rexfordkofikoomson.me")}${reset}                         │`);
  console.log(`  │  ${colors.purple}✦${reset} ${bold}GitHub:${reset}       ${colors.cyan}${link("https://github.com/rexfordkode")}${reset}                        │`);
  console.log(`  │  ${colors.purple}✦${reset} ${bold}LinkedIn:${reset}     ${colors.cyan}${link("https://linkedin.com/in/rexfordkofikoomson")}${reset}            │`);
  console.log(`  │  ${colors.purple}✦${reset} ${bold}X/Twitter:${reset}    ${colors.cyan}${link("https://x.com/originalrexford")}${reset}                         │`);
  console.log(`  │  ${colors.purple}✦${reset} ${bold}Email:${reset}        ${colors.cyan}rexford.kk@gmail.com${reset}                                  │`);
  console.log(`  │                                                                        │`);
  console.log(`  ${midBorder}`);
  console.log(`  │  ${colors.yellow}${bold}📊 TELEMETRY & PRODUCTION METRICS${reset}                                     │`);
  console.log(`  │  ${dim}•${reset} ${colors.white}7+ Years${reset} Designing Scalable High-Concurrency Backend Systems        │`);
  console.log(`  │  ${dim}•${reset} ${colors.white}500+ Production APIs${reset} Architected, Containerized & Deployed          │`);
  console.log(`  │  ${dim}•${reset} ${colors.white}20+ Enterprise Products${reset} Shipped Across Cloud & Analytics            │`);
  console.log(`  │  ${dim}•${reset} ${colors.brightBlue}Team Lead & Senior Backend Developer${reset} at ${bold}Heatmap${reset} (E-Commerce Data)   │`);
  console.log(`  ${midBorder}`);
  console.log(`  │  ${colors.pink}${bold}✦  TECHNICAL CORE MATRIX${reset}                                              │`);
  console.log(`  │  ${colors.cyan}Backend:${reset}   Node.js, TypeScript, NestJS, Python, GraphQL, Microservices│`);
  console.log(`  │  ${colors.cyan}Cloud:${reset}     AWS (Lambda, ECS, RDS), Docker, Redis, Distributed Queues  │`);
  console.log(`  │  ${colors.cyan}AI-Native:${reset} LLM Systems, Agentic Automation, Pipeline Orchestration    │`);
  console.log(`  │  ${colors.cyan}Frontend:${reset}  React, Next.js, Vue, Tailwind CSS, Headless CMS (Storyblok)│`);
  console.log(`  ${midBorder}`);
  console.log(`  │  ${colors.purple}✦${reset} ${dim}Tip: Run${reset} ${colors.yellow}${bold}npx rexford-cv${reset} ${dim}to inspect full curriculum vitae.${reset}           │`);
  console.log(`  ${botBorder}`);
  console.log(`\n  ${colors.purple}✦${reset} ${dim}Explore live interactive telemetry at:${reset} ${colors.cyan}${bold}${underline}${link("https://rexfordkofikoomson.me")}${reset}\n`);
}

// Interactive TUI Console
class AntigravityTerminalApp {
  constructor() {
    this.selectedIndex = 0;
    this.activeScreen = "menu"; // 'menu' | 'ai' | 'experience' | 'education' | 'skills' | 'matrix'
    this.toastMessage = null;
    this.toastTimer = null;
    this.matrixRunning = false;
    this.menuItems = [
      { id: "ai", label: "Ask Rexford AI (Gemini Agent Q&A)", icon: "✦" },
      { id: "experience", label: "Work Experience & System Architecture", icon: "💼" },
      { id: "education", label: "Education & GVSU Credentials", icon: "🎓" },
      { id: "skills", label: "Technical Skills Matrix & Cloud Stack", icon: "🛠️ " },
      { id: "open_portfolio", label: "Open Portfolio in Browser (rexfordkofikoomson.me)", icon: "🌐" },
      { id: "copy_email", label: "Copy Email & Contact Info to Clipboard", icon: "📋" },
      { id: "matrix", label: "Antigravity Quantum Mesh (Easter Egg)", icon: "⚡" },
      { id: "exit", label: "Exit Terminal", icon: "⏻ " },
    ];
  }

  showToast(msg, duration = 2400) {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
      this.render();
    }, duration);
    this.render();
  }

  async bootAnimation() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const stars = ["✦", "✧", "◈", "★"];

    console.log(`\n  ${colors.purple}✦${colors.cyan} ANTIGRAVITY // GEMINI OPERATOR INTERFACE${reset}\n`);

    const bootSteps = [
      "Establishing quantum telemetry link with rexfordkofikoomson.me...",
      "Syncing distributed nodes [Accra ↔ Michigan ↔ AWS US-East]...",
      "Authenticating operator credentials: REXFORD KOFI KOOMSON...",
    ];

    for (const step of bootSteps) {
      for (let f = 0; f < 4; f++) {
        const frame = frames[f % frames.length];
        const star = stars[f % stars.length];
        process.stdout.write(`\r  ${colors.cyan}${frame}${reset} ${colors.purple}${star}${reset} ${dim}${step}${reset}  `);
        await sleep(30);
      }
      process.stdout.write(`\r  ${colors.emerald}✔${reset}  ${dim}${step.replace("...", "")} [OK]${reset}          \n`);
    }

    const title = "✦  R E X F O R D   K O F I   K O O M S O N  ✦";
    for (let f = 0; f < 8; f++) {
      const shiftedStops = geminiGradientStops.map((stop, idx) => {
        const shift = (idx + f * 0.25) % geminiGradientStops.length;
        const baseIdx = Math.floor(shift);
        const frac = shift - baseIdx;
        const nextIdx = (baseIdx + 1) % geminiGradientStops.length;
        return [
          Math.round(geminiGradientStops[baseIdx][0] * (1 - frac) + geminiGradientStops[nextIdx][0] * frac),
          Math.round(geminiGradientStops[baseIdx][1] * (1 - frac) + geminiGradientStops[nextIdx][1] * frac),
          Math.round(geminiGradientStops[baseIdx][2] * (1 - frac) + geminiGradientStops[nextIdx][2] * frac),
        ];
      });
      process.stdout.write(`\r  ${bold}${applyGradient(title, shiftedStops)}`);
      await sleep(30);
    }
    process.stdout.write("\n\n");
    await sleep(100);
  }

  renderHeader() {
    const banner = applyGradient("════════════════════════════════════════════════════════════════════════════════");
    const pingText = liveTelemetry.isLive
      ? `${colors.emerald}● LIVE (${liveTelemetry.latency}ms)${reset}`
      : `${colors.cyan}● CACHED (${liveTelemetry.latency}ms)${reset}`;

    console.log(`  ${banner}`);
    console.log(`  ${bold}${colors.white}REXFORD KOFI KOOMSON${reset}  ${colors.gray}(@rexfordkode)${reset}`);
    console.log(`  ${colors.brightBlue}${bold}Software Engineer | Cloud Architect | Team Lead${reset}`);
    console.log(`  ${colors.yellow}M.Sc. Applied Computer Science${reset} — Grand Valley State University (GVSU)`);
    console.log(`  ${colors.purple}✦ Portfolio:${reset} ${colors.cyan}${underline}${link("https://rexfordkofikoomson.me")}${reset}  ${colors.darkGray}│${reset}  ${colors.white}TELEMETRY:${reset} ${pingText}  ${colors.darkGray}│${reset}  ${colors.purple}SSL: TLS 1.3${reset}`);
    console.log(`  ${banner}\n`);
  }

  renderMenu() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();

    if (this.toastMessage) {
      console.log(`  ${bgRgb(16, 185, 129)}${colors.white}${bold} ✔ ${this.toastMessage} ${reset}\n`);
    } else {
      console.log(`  ${colors.purple}✦${reset} ${dim}Use [↑/↓] or [1-8] to navigate, [ENTER] to select, [q] to exit:${reset}\n`);
    }

    this.menuItems.forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      const num = index + 1;
      if (isSelected) {
        console.log(`  ${colors.cyan}${bold}▶ [${num}] ${item.icon} ${item.label}${reset}`);
      } else {
        console.log(`    ${colors.gray}[${num}] ${item.icon} ${item.label}${reset}`);
      }
    });

    console.log(`\n  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}`);
    console.log(`  ${colors.darkGray}⚡ Shortcuts: [1-8] Jump  [m] Matrix  [o] Portfolio  [c] Copy Email  [q] Exit${reset}`);
  }

  renderExperience() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();
    console.log(`  ${colors.pink}${bold}💼 WORK EXPERIENCE & SYSTEM ARCHITECTURE${reset}`);
    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}\n`);

    console.log(`  ${bold}${colors.white}Senior Backend Developer & Team Lead${reset} — ${colors.emerald}${bold}Heatmap${reset}`);
    console.log(`  ${colors.yellow}📅 01/2024 – Present${reset}  ${colors.darkGray}│${reset} ${dim}📍 Accra, Ghana / Remote${reset}`);
    console.log(`  ${dim}• Lead microservice backend architecture for high-volume e-commerce telemetry platforms.${reset}`);
    console.log(`  ${dim}• Architected & deployed 500+ scalable API endpoints with NestJS, TypeScript, and AWS.${reset}`);
    console.log(`  ${dim}• Optimized data ingestion pipelines and caching layers with Redis for sub-50ms latency.${reset}\n`);

    console.log(`  ${bold}${colors.white}Graduate Assistant (ISS & Tech Operations)${reset} — ${colors.brightBlue}${bold}Grand Valley State University (GVSU)${reset}`);
    console.log(`  ${colors.yellow}📅 08/2023 – 05/2025${reset}  ${colors.darkGray}│${reset} ${dim}📍 Allendale / Grand Rapids, MI, USA${reset}`);
    console.log(`  ${dim}• Managed international student technical workflows, onboarding platforms, and database tracking.${reset}\n`);

    console.log(`  ${bold}${colors.white}Software Engineer${reset} — ${colors.brightBlue}${bold}AmaliTech Services${reset}`);
    console.log(`  ${colors.yellow}📅 03/2022 – 12/2023${reset}  ${colors.darkGray}│${reset} ${dim}📍 Takoradi, Ghana${reset}`);
    console.log(`  ${dim}• Contributed to core Enterprise Resource Platform (ERP) using NestJS, GraphQL, and Docker.${reset}\n`);

    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}`);
    console.log(`  ${colors.purple}✦ Press [ESC] or [ENTER] to return to menu...${reset}`);
  }

  renderEducation() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();
    console.log(`  ${colors.yellow}${bold}🎓 EDUCATION & CREDENTIALS${reset}`);
    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}\n`);

    console.log(`  ${bold}${colors.white}M.Sc. Applied Computer Science${reset}`);
    console.log(`  ${colors.brightBlue}Grand Valley State University (GVSU)${reset} ${colors.yellow}(2023 – 2025)${reset}`);
    console.log(`  ${dim}📍 Michigan, USA — Focus on Distributed Systems, Cloud Architecture, and Database Systems.${reset}\n`);

    console.log(`  ${bold}${colors.white}B.Sc. Information Technology${reset}`);
    console.log(`  ${colors.brightBlue}Ghana Communication Technology University (GCTU / GCUC)${reset} ${colors.yellow}(2015 – 2019)${reset}`);
    console.log(`  ${dim}📍 Accra, Ghana — First-Class Honors.${reset}\n`);

    console.log(`  ${bold}${colors.white}Professional Certifications${reset}`);
    console.log(`  ${dim}• Huawei Certified Internetwork Associate (HCIA)${reset}`);
    console.log(`  ${dim}• Nano Degree in Android Development (Google Africa / Udacity)${reset}`);
    console.log(`  ${dim}• Full-Stack Engineer Career Track (Codecademy)${reset}\n`);

    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}`);
    console.log(`  ${colors.purple}✦ Press [ESC] or [ENTER] to return to menu...${reset}`);
  }

  renderSkills() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();
    console.log(`  ${colors.cyan}${bold}🛠️  TECHNICAL SKILLS & ARCHITECTURE MATRIX${reset}`);
    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}\n`);

    console.log(`  ${colors.purple}${bold}Backend & Microservices:${reset}`);
    console.log(`  ${colors.white}Node.js • TypeScript • NestJS • Python • GraphQL Federation • RESTful APIs • Event-Driven Architecture • System Design${reset}\n`);

    console.log(`  ${colors.purple}${bold}Cloud & Infrastructure:${reset}`);
    console.log(`  ${colors.white}Amazon Web Services (AWS Lambda, ECS, RDS, S3) • Docker • Kubernetes • Redis • Serverless • CI/CD Pipelines${reset}\n`);

    console.log(`  ${colors.purple}${bold}Databases & ORM:${reset}`);
    console.log(`  ${colors.white}PostgreSQL • MongoDB • MySQL • SQLite • Prisma ORM • TypeORM • Indexing & Query Tuning${reset}\n`);

    console.log(`  ${colors.purple}${bold}AI-Native Engineering:${reset}`);
    console.log(`  ${colors.white}LLM Integration • Agentic Automation • Telemetry Pipelines • API Orchestration${reset}\n`);

    console.log(`  ${colors.purple}${bold}Frontend & Headless:${reset}`);
    console.log(`  ${colors.white}React.js • Next.js • Vue.js • Tailwind CSS • Storyblok CMS${reset}\n`);

    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}`);
    console.log(`  ${colors.purple}✦ Press [ESC] or [ENTER] to return to menu...${reset}`);
  }

  // Cyberpunk Matrix / Antigravity Quantum particle effect
  async playMatrixEffect() {
    this.activeScreen = "matrix";
    this.matrixRunning = true;
    process.stdout.write(`${CSI}2J${CSI}H`);

    const glyphs = ["✦", "✧", "0", "1", "◈", "λ", "▲", "99.97%", "AWS", "GVSU", "HEATMAP", "NODE", "AI"];
    const width = Math.min(process.stdout.columns || 80, 80);
    const height = Math.min(process.stdout.rows || 24, 20);

    const startTime = Date.now();
    while (this.matrixRunning && Date.now() - startTime < 2600) {
      let line = "";
      for (let i = 0; i < width; i += 4) {
        if (Math.random() > 0.45) {
          const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          const col = Math.random() > 0.5 ? colors.emerald : (Math.random() > 0.5 ? colors.cyan : colors.purple);
          line += col + glyph + reset + " ";
        } else {
          line += "    ";
        }
      }
      console.log(line);
      await sleep(55);
    }

    this.matrixRunning = false;
    this.activeScreen = "menu";
    this.render();
  }

  render() {
    if (this.activeScreen === "menu") {
      this.renderMenu();
    } else if (this.activeScreen === "experience") {
      this.renderExperience();
    } else if (this.activeScreen === "education") {
      this.renderEducation();
    } else if (this.activeScreen === "skills") {
      this.renderSkills();
    }
  }

  async runAIAgent() {
    this.activeScreen = "ai";
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();

    const apiKey = process.env.GEMINI_API_KEY;
    const modeBadge = apiKey
      ? `${colors.emerald}[LIVE GEMINI 2.0 FLASH MODE]${reset}`
      : `${colors.cyan}[OFFLINE INTELLIGENCE MODE]${reset}`;

    console.log(`  ${colors.purple}✦${reset} ${bold}${colors.white}ANTIGRAVITY // GEMINI AGENT CONSOLE${reset}  ${modeBadge}`);
    console.log(`  ${dim}Ask any question about Rexford's experience, architecture, GVSU M.Sc., Heatmap, or tech stack.${reset}`);
    console.log(`  ${dim}Type ${colors.yellow}'exit'${reset}${dim} or press ${colors.yellow}[Ctrl+C]${reset}${dim} to return to the main menu.${reset}\n`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const ask = () => {
      rl.question(`  ${colors.cyan}rexford-ai ❯${reset} `, async (input) => {
        const query = input.trim();
        if (!query || query.toLowerCase() === "exit" || query.toLowerCase() === "quit") {
          rl.close();
          this.activeScreen = "menu";
          this.render();
          this.listenMenu();
          return;
        }

        let responseTitle = "Rexford Telemetry Response";
        let responseBody = "";

        if (apiKey) {
          process.stdout.write(`  ${colors.purple}✦ Querying Gemini Live API...${reset}\r`);
          const liveAnswer = await queryLiveGemini(query, apiKey);
          if (liveAnswer) {
            responseTitle = "Gemini Live Synthesis";
            responseBody = liveAnswer;
          }
        }

        if (!responseBody) {
          const offlineAnswer = answerQuery(query);
          responseTitle = offlineAnswer.title;
          responseBody = offlineAnswer.response;
        }

        console.log(`\n  ${colors.purple}✦ ${bold}${responseTitle}${reset}`);

        const paragraphs = responseBody.split("\n");
        for (const p of paragraphs) {
          process.stdout.write("  ");
          for (const char of p) {
            process.stdout.write(char);
            await sleep(5);
          }
          process.stdout.write("\n");
        }
        console.log();
        ask();
      });
    };

    ask();
  }

  listenMenu() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const onKey = (key) => {
      // Ctrl+C
      if (key === "\u0003") {
        cleanupAndExit();
      }

      if (this.activeScreen === "menu") {
        // Arrow UP or 'k'
        if (key === "\u001b[A" || key === "k") {
          this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
          this.render();
        }
        // Arrow DOWN or 'j'
        else if (key === "\u001b[B" || key === "j") {
          this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
          this.render();
        }
        // Direct shortcuts: 'm' -> matrix, 'o' -> open, 'c' -> copy, 'q' -> exit
        else if (key === "m" || key === "M") {
          this.playMatrixEffect();
        } else if (key === "o" || key === "O") {
          openBrowser("https://rexfordkofikoomson.me");
          this.showToast("Opening https://rexfordkofikoomson.me in your browser...");
        } else if (key === "c" || key === "C") {
          copyToClipboard("rexford.kk@gmail.com");
          this.showToast("Email 'rexford.kk@gmail.com' copied to clipboard!");
        } else if (key === "q" || key === "Q") {
          cleanupAndExit();
        }
        // Number keys 1-8
        else if (key >= "1" && key <= String(this.menuItems.length)) {
          this.selectedIndex = parseInt(key, 10) - 1;
          this.render();
          handleSelect();
        }
        // Enter / Return
        else if (key === "\r" || key === "\n" || key === " ") {
          handleSelect();
        }
      } else if (this.activeScreen === "matrix") {
        this.matrixRunning = false;
        this.activeScreen = "menu";
        this.render();
      } else {
        // In subscreen: ESC or Enter or 'q' returns to menu
        if (key === "\u001b" || key === "\r" || key === "\n" || key === "q" || key === "Q") {
          this.activeScreen = "menu";
          this.render();
        }
      }
    };

    const handleSelect = () => {
      const selected = this.menuItems[this.selectedIndex];
      if (selected.id === "exit") {
        cleanupAndExit();
      } else if (selected.id === "open_portfolio") {
        const opened = openBrowser("https://rexfordkofikoomson.me");
        if (opened) {
          this.showToast("Opening https://rexfordkofikoomson.me in your browser...");
        } else {
          this.showToast("Visit https://rexfordkofikoomson.me");
        }
      } else if (selected.id === "copy_email") {
        copyToClipboard("rexford.kk@gmail.com");
        this.showToast("Email 'rexford.kk@gmail.com' copied to clipboard!");
      } else if (selected.id === "matrix") {
        this.playMatrixEffect();
      } else if (selected.id === "ai") {
        process.stdin.removeListener("data", onKey);
        process.stdin.setRawMode(false);
        this.runAIAgent();
      } else {
        this.activeScreen = selected.id;
        this.render();
      }
    };

    process.stdin.on("data", onKey);
  }

  async start() {
    globalApp = this;
    probePortfolio(); // Non-blocking background telemetry probe
    enterAltScreen();
    await this.bootAnimation();
    this.render();
    this.listenMenu();

    // Listen for terminal resize
    if (process.stdout.on) {
      process.stdout.on("resize", () => {
        if (inAltScreen && this.activeScreen !== "ai") {
          this.render();
        }
      });
    }
  }
}

function cleanupAndExit() {
  leaveAltScreen();
  console.log(`\n  ${colors.purple}✦${reset} ${dim}Thank you for exploring! Live portfolio:${reset} ${colors.cyan}${bold}https://rexfordkofikoomson.me${reset}\n`);
  process.exit(0);
}

// Main entry
async function main() {
  if (isStatic) {
    renderStaticCard();
  } else {
    const app = new AntigravityTerminalApp();
    await app.start();
  }
}

main().catch((err) => {
  leaveAltScreen();
  console.error(err);
  process.exit(1);
});
