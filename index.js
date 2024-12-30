#!/usr/bin/env node

import { readFile } from "fs/promises";
import welcome from "cli-welcome";
const pkJson = JSON.parse(
  await readFile(new URL("./package.json", import.meta.url))
);
welcome({
  title: "Get to know Rexford Koomson",
  version: pkJson.version,
});

console.log(`
    Name: ${pkJson.name}
    Version: ${pkJson.version}
`);

console.log(`
👋 Hi, I’m Rexford Koomson (@rexfordkode)
🚀 Fullstack Developer | 🧠 AI Integration Enthusiast | 💻 Cloud & Microservices Architect

👀 What I'm Into:
Software Engineering: Crafting scalable solutions and optimizing system design.
Backend Expertise: NodeJS, NestJS, TypeScript, AWS Lambda, Redis, GraphQL, and RESTful APIs.
Frontend Flair: Building intuitive UIs with React, Vue, and Storyblok.
Cloud & Infrastructure: Docker, AWS, Microservices, and serverless architectures.
AI Integration: Exploring how to merge AI into modern applications.
🌱 Currently Learning:
Advanced Cloud Solutions: Diving deeper into AWS, Docker, and distributed systems, AI Integration.
AI & Machine Learning: Integrating AI with microservices for smarter systems.

💬 Let’s Collaborate On:
Fullstack projects with NodeJS, NestJS, GraphQL, or RESTful APIs.
`);
