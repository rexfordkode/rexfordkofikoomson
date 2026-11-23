#!/usr/bin/env node

/**
 * Rexford Kofi Koomson - Comprehensive Interactive Curriculum Vitae (CLI)
 * Styled with Gemini & Antigravity Terminal Aesthetics
 * Portfolio: https://rexfordkofikoomson.me
 */

import { spawn } from "node:child_process";
import fs from "node:fs/promises";

// TTY and flags detection
const isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY && !process.env.CI);
const isStatic = process.argv.includes("--static") || process.argv.includes("--no-anim") || !isTTY;

// ANSI & Color Utilities
const esc = (code) => `\x1b[${code}m`;
const CSI = "\x1b[";

const reset = esc(0);
const bold = esc(1);
const dim = esc(2);
const underline = esc(4);

// 24-bit Truecolor helpers (Gemini signature palette)
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

// Comprehensive CV Data Store
const cv = {
  profile: {
    name: "Rexford Kofi Koomson",
    title: "Software Engineer | Cloud Architect | Team Lead",
    location: "Grand Rapids, MI, USA / Takoradi, Ghana",
    portfolio: "https://rexfordkofikoomson.me",
    github: "https://github.com/rexfordkode",
    linkedin: "https://linkedin.com/in/rexfordkofikoomson",
    twitter: "https://x.com/originalrexford",
    email: "rexford.kk@gmail.com",
    summary:
      "Accomplished Software Engineer, Cloud Architect, and Team Lead with 7+ years of expertise architecting high-scale distributed backends, e-commerce analytics engines, cloud-native microservices, and AI-native applications. Holding an M.Sc. in Applied Computer Science.",
  },
  experience: [
    {
      title: "Senior Backend Developer & Team Lead",
      company: "Heatmap",
      period: "01/2024 – Present",
      location: "Accra, Ghana / Remote",
      highlights: [
        "Lead microservice backend engineering for high-volume e-commerce telemetry platforms.",
        "Architected and deployed 500+ scalable, resilient API endpoints utilizing NestJS, TypeScript, and AWS.",
        "Engineered low-latency caching and data streaming pipelines with Redis and AWS Lambda/ECS.",
        "Mentored engineering teams, led code reviews, and implemented automated CI/CD deployment gates.",
      ],
      tags: ["NestJS", "TypeScript", "AWS", "Redis", "Microservices", "Telemetry"],
    },
    {
      title: "Graduate Assistant (ISS & Tech Operations)",
      company: "Grand Valley State University (GVSU)",
      period: "08/2023 – 05/2025",
      location: "Grand Rapids, MI, USA",
      highlights: [
        "Administered digital workflows, records tracking systems, and onboarding portals within Padnos Center.",
        "Optimized student data automation scripts, reducing processing turnaround times by 40%.",
        "Collaborated across academic and IT departments to support international student operations.",
      ],
      tags: ["Data Automation", "Python", "Database Ops", "GVSU"],
    },
    {
      title: "Software Engineer",
      company: "AmaliTech Services",
      period: "03/2022 – 12/2023",
      location: "Takoradi, Ghana",
      highlights: [
        "Key contributor to the AmaliTech Enterprise Resource Platform (ERP) core architecture.",
        "Designed secure GraphQL and REST APIs with NestJS/TypeScript and Prisma ORM.",
        "Containerized development and staging environments using Docker and Docker Compose.",
      ],
      tags: ["GraphQL", "NestJS", "Docker", "ERP", "PostgreSQL"],
    },
    {
      title: "IT Consultant & Founder",
      company: "Jorexnet Solution",
      period: "10/2019 – 02/2023",
      location: "Takoradi, Ghana",
      highlights: [
        "Delivered custom business software solutions, web portals, and network infrastructure for corporate clients.",
        "Engineered secure server architectures and provided ongoing systems diagnostics.",
      ],
      tags: ["System Design", "Consulting", "Fullstack", "Networking"],
    },
    {
      title: "Freelance Backend Developer",
      company: "Self-Employed",
      period: "06/2018 – 09/2021",
      location: "Takoradi, Ghana",
      highlights: [
        "Developed custom API integrations, database schemas, and migration scripts for international clients.",
      ],
      tags: ["Node.js", "MySQL", "APIs", "Express"],
    },
  ],
  education: [
    {
      degree: "M.Sc. Applied Computer Science",
      institution: "Grand Valley State University (GVSU)",
      period: "2023 – 2025",
      location: "Allendale / Grand Rapids, MI, USA",
      details: "Focus: Distributed Systems, Cloud Architecture, Advanced Database Systems & Algorithms.",
    },
    {
      degree: "B.Sc. Information Technology",
      institution: "Ghana Communication Technology University (GCTU / GCUC)",
      period: "09/2015 – 08/2019",
      location: "Accra, Ghana",
      details: "First-Class Honors. Major emphasis in software engineering and network security.",
    },
    {
      degree: "Huawei Certified Internetwork Associate (HCIA)",
      institution: "Huawei Academy",
      period: "05/2019 – 08/2021",
      location: "Takoradi, Ghana",
      details: "Routing, switching, network security, and infrastructure design.",
    },
    {
      degree: "Nano Degree in Android Development",
      institution: "Google Africa Development Training Program (Udacity)",
      period: "09/2019 – 12/2020",
      location: "Remote",
      details: "Mobile architecture, performance profiling, and RESTful client integrations.",
    },
    {
      degree: "Full-Stack Engineer Career Path",
      institution: "Codecademy",
      period: "2020 – 2021",
      location: "Remote",
      details: "Full-stack web standards, Node.js, React, and data structures.",
    },
  ],
  skills: {
    "Backend & Architecture": [
      "Node.js", "TypeScript", "NestJS", "Python", "GraphQL Federation",
      "RESTful APIs", "Microservices", "Event-Driven Architecture", "System Design"
    ],
    "Cloud & DevOps": [
      "AWS (Lambda, ECS, RDS, S3)", "Docker", "Kubernetes", "CI/CD Pipelines",
      "Redis (Caching & Queues)", "Linux / Bash", "Serverless Framework"
    ],
    "Databases & ORM": [
      "PostgreSQL", "MongoDB", "MySQL", "SQLite", "Prisma ORM",
      "TypeORM", "Database Indexing & Query Tuning"
    ],
    "AI & Data Engineering": [
      "AI-Native Application Integration", "LLM Tooling & Agents",
      "Telemetry & Analytics Pipelines", "API Orchestration"
    ],
    "Frontend & CMS": [
      "React.js", "Next.js", "Vue.js", "Tailwind CSS",
      "HTML5 / CSS3", "Storyblok Headless CMS"
    ],
  },
  architecturalHighlights: [
    {
      title: "High-Throughput E-Commerce Telemetry Engine",
      organization: "Heatmap",
      impact: "Architected event ingestion handling millions of telemetry points daily with sub-50ms query responses using Redis caching and AWS ECS auto-scaling.",
      tech: "NestJS • AWS ECS • Redis • TypeScript • PostgreSQL",
    },
    {
      title: "Enterprise Resource Platform (ERP) Microservice Mesh",
      organization: "AmaliTech Services",
      impact: "Designed federated GraphQL gateways and modular NestJS services, decoupling legacy monoliths and cutting deployment cycles in half.",
      tech: "GraphQL • Docker • NestJS • Prisma ORM • CI/CD",
    },
    {
      title: "Developer Telemetry Portfolio & Operator Interface",
      organization: "rexfordkofikoomson.me",
      impact: "Built a code-first, real-time developer portfolio modeling live production telemetry (uptime, latency, request volumes, and live interactive controls).",
      tech: "Next.js • Tailwind CSS • Serverless • Edge Runtime",
    },
  ],
};

// Markdown exporter
async function exportMarkdownCV() {
  const md = `# ${cv.profile.name}
**${cv.profile.title}**  
📍 ${cv.profile.location}  
🌐 Portfolio: ${cv.profile.portfolio}  
🐙 GitHub: ${cv.profile.github}  
💼 LinkedIn: ${cv.profile.linkedin}  
✉️ Email: ${cv.profile.email}

---

## Executive Summary
${cv.profile.summary}

---

## Work Experience
${cv.experience
  .map(
    (exp) => `### ${exp.title} — ${exp.company}
*${exp.period} | ${exp.location}*  
${exp.highlights.map((h) => `- ${h}`).join("\n")}
**Technologies:** ${exp.tags.join(", ")}
`
  )
  .join("\n")}

---

## Architectural & System Highlights
${cv.architecturalHighlights
  .map(
    (proj) => `### ${proj.title} (${proj.organization})
${proj.impact}  
**Stack:** ${proj.tech}
`
  )
  .join("\n")}

---

## Education & Credentials
${cv.education
  .map(
    (edu) => `### ${edu.degree}
**${edu.institution}** (${edu.period})  
${edu.location ? `*${edu.location}* — ` : ""}${edu.details}
`
  )
  .join("\n")}

---

## Technical Skills Matrix
${Object.entries(cv.skills)
  .map(([cat, list]) => `- **${cat}:** ${list.join(", ")}`)
  .join("\n")}

---
*Exported from Rexford CLI (https://rexfordkofikoomson.me)*
`;

  const fileName = "REXFORD_KOOMSON_CV.md";
  await fs.writeFile(fileName, md, "utf8");
  return fileName;
}

// Terminal management
let inAltScreen = false;
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

// Static printer for piping or non-interactive use
function printStaticCV() {
  const banner = applyGradient("════════════════════════════════════════════════════════════════════════════════");
  const divLine = applyGradient("────────────────────────────────────────────────────────────────────────────────");

  console.log(`\n  ${banner}`);
  console.log(`  ${bold}${colors.white}${cv.profile.name.toUpperCase()}${reset}`);
  console.log(`  ${colors.yellow}${cv.profile.title}${reset}`);
  console.log(`  ${dim}📍 ${cv.profile.location}${reset}`);
  console.log(`  ${banner}\n`);

  console.log(`  ${colors.purple}✦${reset} ${bold}Portfolio:${reset}  ${colors.cyan}${underline}${link(cv.profile.portfolio)}${reset}`);
  console.log(`  ${colors.purple}✦${reset} ${bold}GitHub:${reset}     ${colors.cyan}${link(cv.profile.github)}${reset}`);
  console.log(`  ${colors.purple}✦${reset} ${bold}LinkedIn:${reset}   ${colors.cyan}${link(cv.profile.linkedin)}${reset}`);
  console.log(`  ${colors.purple}✦${reset} ${bold}Email:${reset}      ${colors.cyan}${cv.profile.email}${reset}\n`);
  console.log(`  ${dim}${cv.profile.summary}${reset}\n`);

  console.log(`  ${colors.pink}${bold}💼 WORK EXPERIENCE${reset}`);
  console.log(`  ${divLine}`);
  for (const job of cv.experience) {
    console.log(`  ${bold}${colors.white}${job.title}${reset} — ${colors.emerald}${bold}${job.company}${reset}`);
    console.log(`  ${colors.yellow}📅 ${job.period}${reset}  ${colors.darkGray}│${reset} ${dim}📍 ${job.location}${reset}`);
    job.highlights.forEach((h) => console.log(`  ${dim}• ${h}${reset}`));
    console.log(`  ${colors.cyan}Stack: ${job.tags.join(" • ")}${reset}\n`);
  }

  console.log(`  ${colors.brightBlue}${bold}🚀 ARCHITECTURAL & SYSTEM HIGHLIGHTS${reset}`);
  console.log(`  ${divLine}`);
  for (const proj of cv.architecturalHighlights) {
    console.log(`  ${bold}${colors.white}${proj.title}${reset} ${colors.yellow}(${proj.organization})${reset}`);
    console.log(`  ${dim}${proj.impact}${reset}`);
    console.log(`  ${colors.purple}Stack: ${proj.tech}${reset}\n`);
  }

  console.log(`  ${colors.yellow}${bold}🎓 EDUCATION & CREDENTIALS${reset}`);
  console.log(`  ${divLine}`);
  for (const edu of cv.education) {
    console.log(`  ${bold}${colors.white}${edu.degree}${reset}`);
    console.log(`  ${colors.brightBlue}${edu.institution}${reset} ${colors.yellow}(${edu.period})${reset}`);
    console.log(`  ${dim}${edu.location ? `📍 ${edu.location} — ` : ""}${edu.details}${reset}\n`);
  }

  console.log(`  ${colors.cyan}${bold}🛠️  TECHNICAL SKILLS MATRIX${reset}`);
  console.log(`  ${divLine}`);
  for (const [category, skillList] of Object.entries(cv.skills)) {
    console.log(`  ${colors.purple}${bold}${category}:${reset}`);
    console.log(`  ${colors.darkGray}›${reset} ${skillList.map((s) => `${colors.white}${s}${reset}`).join(`${dim} • ${reset}`)}\n`);
  }

  console.log(`  ${banner}`);
  console.log(`  ${colors.purple}✦${reset} ${dim}Interactive live telemetry & systems available at:${reset} ${colors.cyan}${bold}${underline}${link(cv.profile.portfolio)}${reset}\n`);
}

// Interactive TUI CV Explorer
class InteractiveCVApp {
  constructor() {
    this.activeTab = 0; // 0: Overview, 1: Experience, 2: Architecture, 3: Education, 4: Skills
    this.tabs = [
      { id: "overview", label: "Overview", icon: "📋" },
      { id: "experience", label: "Experience", icon: "💼" },
      { id: "architecture", label: "Architecture", icon: "🚀" },
      { id: "education", label: "Education", icon: "🎓" },
      { id: "skills", label: "Skills Matrix", icon: "🛠️ " },
    ];
    this.toast = null;
    this.toastTimer = null;
  }

  showToast(msg, duration = 2500) {
    this.toast = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.render();
    }, duration);
    this.render();
  }

  renderHeader() {
    const banner = applyGradient("════════════════════════════════════════════════════════════════════════════════");
    console.log(`  ${banner}`);
    console.log(`  ${bold}${colors.white}${cv.profile.name.toUpperCase()}${reset}  ${colors.gray}(@rexfordkode)${reset}`);
    console.log(`  ${colors.brightBlue}${bold}${cv.profile.title}${reset}`);
    console.log(`  ${colors.purple}✦ Portfolio:${reset} ${colors.cyan}${underline}${link(cv.profile.portfolio)}${reset}  ${colors.darkGray}│${reset}  ${colors.yellow}M.Sc. Applied Computer Science (GVSU)${reset}`);
    console.log(`  ${banner}\n`);

    // Tab Bar
    let tabLine = "  ";
    this.tabs.forEach((tab, index) => {
      const isSelected = index === this.activeTab;
      const num = index + 1;
      if (isSelected) {
        tabLine += `${bgRgb(56, 189, 248)}${colors.darkGray}${bold} [${num}] ${tab.icon} ${tab.label} ${reset} `;
      } else {
        tabLine += `${colors.gray}[${num}] ${tab.icon} ${tab.label}${reset}  `;
      }
    });
    console.log(tabLine);
    console.log(`  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}\n`);
  }

  renderOverview() {
    console.log(`  ${colors.purple}${bold}✦ EXECUTIVE SUMMARY${reset}`);
    console.log(`  ${dim}${cv.profile.summary}${reset}\n`);

    console.log(`  ${colors.pink}${bold}📊 CAREER HIGHLIGHTS & VELOCITY${reset}`);
    console.log(`  ${dim}•${reset} ${bold}Senior Backend Developer & Team Lead${reset} at ${colors.emerald}Heatmap${reset} (High-traffic E-Commerce Data)`);
    console.log(`  ${dim}•${reset} ${bold}500+ Production APIs${reset} Architected, Containerized, and Deployed to AWS`);
    console.log(`  ${dim}•${reset} ${bold}M.Sc. in Applied Computer Science${reset} from Grand Valley State University (GVSU)`);
    console.log(`  ${dim}•${reset} ${bold}7+ Years${reset} Building Cloud-Native Microservices, Data Pipelines & AI Integrations\n`);

    console.log(`  ${colors.yellow}${bold}🌐 DIRECT CONTACT & CHANNELS${reset}`);
    console.log(`  ${colors.purple}✦${reset} ${bold}Portfolio:${reset}  ${colors.cyan}${underline}${link(cv.profile.portfolio)}${reset}`);
    console.log(`  ${colors.purple}✦${reset} ${bold}GitHub:${reset}     ${colors.cyan}${link(cv.profile.github)}${reset}`);
    console.log(`  ${colors.purple}✦${reset} ${bold}LinkedIn:${reset}   ${colors.cyan}${link(cv.profile.linkedin)}${reset}`);
    console.log(`  ${colors.purple}✦${reset} ${bold}Email:${reset}      ${colors.cyan}${cv.profile.email}${reset}`);
  }

  renderExperience() {
    console.log(`  ${colors.pink}${bold}💼 PROFESSIONAL EXPERIENCE DEEP-DIVE${reset}\n`);
    for (const job of cv.experience) {
      console.log(`  ${bold}${colors.white}${job.title}${reset} — ${colors.emerald}${bold}${job.company}${reset}`);
      console.log(`  ${colors.yellow}📅 ${job.period}${reset}  ${colors.darkGray}│${reset} ${dim}📍 ${job.location}${reset}`);
      job.highlights.forEach((h) => console.log(`  ${dim}• ${h}${reset}`));
      console.log(`  ${colors.purple}Technologies:${reset} ${job.tags.map((t) => `${colors.cyan}[${t}]${reset}`).join(" ")}\n`);
    }
  }

  renderArchitecture() {
    console.log(`  ${colors.brightBlue}${bold}🚀 KEY SYSTEM ARCHITECTURE HIGHLIGHTS${reset}\n`);
    for (const proj of cv.architecturalHighlights) {
      console.log(`  ${bold}${colors.white}${proj.title}${reset} ${colors.yellow}(${proj.organization})${reset}`);
      console.log(`  ${dim}${proj.impact}${reset}`);
      console.log(`  ${colors.purple}Architecture & Stack:${reset} ${colors.cyan}${proj.tech}${reset}\n`);
    }
  }

  renderEducation() {
    console.log(`  ${colors.yellow}${bold}🎓 EDUCATION & ACADEMIC CREDENTIALS${reset}\n`);
    for (const edu of cv.education) {
      console.log(`  ${bold}${colors.white}${edu.degree}${reset}`);
      console.log(`  ${colors.brightBlue}${edu.institution}${reset} ${colors.yellow}(${edu.period})${reset}`);
      console.log(`  ${dim}${edu.location ? `📍 ${edu.location} — ` : ""}${edu.details}${reset}\n`);
    }
  }

  renderSkills() {
    console.log(`  ${colors.cyan}${bold}🛠️  TECHNICAL SKILLS & COMPETENCY MATRIX${reset}\n`);
    for (const [category, skillList] of Object.entries(cv.skills)) {
      console.log(`  ${colors.purple}${bold}${category}:${reset}`);
      console.log(`  ${colors.darkGray}›${reset} ${skillList.map((s) => `${colors.white}${s}${reset}`).join(`${dim} • ${reset}`)}\n`);
    }
  }

  render() {
    process.stdout.write(`${CSI}2J${CSI}H`);
    this.renderHeader();

    if (this.toast) {
      console.log(`  ${bgRgb(16, 185, 129)}${colors.white}${bold} ✔ ${this.toast} ${reset}\n`);
    }

    if (this.activeTab === 0) this.renderOverview();
    else if (this.activeTab === 1) this.renderExperience();
    else if (this.activeTab === 2) this.renderArchitecture();
    else if (this.activeTab === 3) this.renderEducation();
    else if (this.activeTab === 4) this.renderSkills();

    console.log(`\n  ${applyGradient("────────────────────────────────────────────────────────────────────────────────")}`);
    console.log(`  ${colors.darkGray}Shortcuts: [←/→] or [1-5] Tabs  [e] Export MD  [c] Copy Info  [o] Portfolio  [q] Exit${reset}`);
  }

  listen() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", async (key) => {
      // Ctrl+C or 'q'
      if (key === "\u0003" || key === "q" || key === "Q") {
        leaveAltScreen();
        console.log(`\n  ${colors.purple}✦${reset} ${dim}Thank you! Explore the live portfolio at:${reset} ${colors.cyan}${bold}https://rexfordkofikoomson.me${reset}\n`);
        process.exit(0);
      }

      // Left arrow or 'h'
      if (key === "\u001b[D" || key === "h") {
        this.activeTab = (this.activeTab - 1 + this.tabs.length) % this.tabs.length;
        this.render();
      }
      // Right arrow or 'l'
      else if (key === "\u001b[C" || key === "l" || key === "\t") {
        this.activeTab = (this.activeTab + 1) % this.tabs.length;
        this.render();
      }
      // Number keys 1 to 5
      else if (key >= "1" && key <= String(this.tabs.length)) {
        this.activeTab = parseInt(key, 10) - 1;
        this.render();
      }
      // 'e' -> Export Markdown
      else if (key === "e" || key === "E") {
        try {
          const file = await exportMarkdownCV();
          this.showToast(`Saved CV as '${file}' in current folder!`);
        } catch {
          this.showToast("Failed to write Markdown file.");
        }
      }
      // 'c' -> Copy contact info
      else if (key === "c" || key === "C") {
        copyToClipboard("rexford.kk@gmail.com");
        this.showToast("Email 'rexford.kk@gmail.com' copied to clipboard!");
      }
      // 'o' -> Open portfolio in browser
      else if (key === "o" || key === "O") {
        openBrowser(cv.profile.portfolio);
        this.showToast(`Opening ${cv.profile.portfolio} in your browser...`);
      }
    });

    if (process.stdout.on) {
      process.stdout.on("resize", () => {
        if (inAltScreen) {
          this.render();
        }
      });
    }
  }

  start() {
    enterAltScreen();
    this.render();
    this.listen();
  }
}

// Main execution
async function main() {
  if (isStatic) {
    printStaticCV();
  } else {
    const app = new InteractiveCVApp();
    app.start();
  }
}

main().catch((err) => {
  leaveAltScreen();
  console.error(err);
  process.exit(1);
});
