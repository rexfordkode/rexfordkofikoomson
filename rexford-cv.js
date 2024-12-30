#!/usr/bin/env node
const clearConsole = require("clear-any-console");
clearConsole();

const cv = {
  name: "Koomson Kofi  Rexford",
  title: "Software Engineer",
  location: "Takoradi, Ghana",
  contact: {
    email: "rexford.kk@gmail.com",
    phone: "+233240156467",
    nationality: "Ghanaian",
    gender: "Male",
  },
  education: [
    {
      degree: "Bsc Information Technology",
      institution: "Ghana Communication University College",
      period: "09/2015 – 08/2019",
      location: "Accra, Ghana",
    },
    {
      degree: "Huawei Certified Internetwork Associate",
      institution: "Huawei Academy",
      period: "05/2019 – 08/2011",
      location: "Takoradi, Ghana",
    },
    {
      degree: "Certificate Software Engineering",
      institution: "Integrated Plant Management and Control",
      period: "07/2017 – 12/2017",
      location: "Takoradi, Ghana",
    },
    {
      degree: "Full-Stack Engineer Career Path",
      institution: "Codecademy",
    },
    {
      degree: "Nano Degree Android Development",
      institution: "Google Africa Development Training Program (Udacity)",
      period: "09/2019 – 12/2020",
    },
  ],
  workExperience: [
    {
      title: "Senior Backend Developer",
      company: "Heatmap",
      period: "01/2024 – present",
      location: "Accra, Ghana",
      description: "Node developer in charge of leading service project.",
    },
    {
      title: "Software Engineer",
      company: "Amalitech Services",
      period: "03/2022 – present",
      location: "Takoradi, Ghana",
      description: "AmaliTech Enterprise Resource Platform (ERP)",
    },
    {
      title: "IT Consultant",
      company: "Jorexnet Solution- (Owner)",
      period: "10/2019 – 02/2023",
      location: "Takoradi, Ghana",
      description:
        "Network, Security System and Hardware Installer (CCTV), Application development, Digital business solution provider",
    },
    {
      title: "Freelance Backend Developer",
      company: "Freelance",
      period: "06/2018 – 09/2021",
      location: "Takoradi, Ghana",
      description:
        "Fault diagnosis and support: I provide expert services to diagnose and resolve issues in clients' systems, ensuring their smooth operation",
    },
    {
      title: "Web Developer and System Analyst",
      company: "Artsoft Gh",
      period: "06/2017 – 05/2021",
      location: "Takoradi, Ghana",
      description:
        "Back-end Developer. Part of the team in building web solutions for clients. Javascript, NodeJS, ExpressJS, Bootstrap, HTM, CSS, PHP, MySQL, Moodle",
    },
    {
      title: "Community Development Officer",
      company: "Effia-Kwesimintsim Municipal Assemply",
      period: "09/2018 – 08/2019",
      location: "Takoradi, Ghana",
      description:
        "Community Development officer at the social welfare. Incharge of handling cases with persons with disability. Foster care unit and cases of Abandoned children",
    },
  ],
  skills: [
    "NodeJS /Typescript/NestJS Backend Developer",
    "CSS and HTML",
    "Laravel",
    "MySQL, PostgreSQL, MongoDB and SQLlite",
    "System Architecture Design",
    "Prisma/Type ORM",
    "Java Core",
    "GraphQL Federation",
    "Redis Server",
    "MongoDB",
    "Microsoft Office Suit",
    "Data analysist",
    "React JS",
    "Docker",
    "AWS Services",
    "Storyblok",
    "Integration of API for CMS",
    "Selenium Javascript",
  ],
};

console.log("👨‍💻 %cKoomson Rexford Kofi", "font-size: 20px; font-weight: bold;");
console.log("📍 %cTakoradi, Ghana", "font-size: 16px;");
console.log("✉️ %crexford.kk@gmail.com", "font-size: 16px;");
console.log("📞 %c+233240156467", "font-size: 16px;");
console.log("\n🎓 %cEducation", "font-size: 18px; font-weight: bold;");
cv.education.forEach((edu) => {
  console.log(`🏫 %c${edu.degree} - ${edu.institution}`, "font-size: 16px;");
  console.log(`📅 %c${edu.period} | ${edu.location}`, "font-size: 14px;");
});
console.log("\n💼 %cWork Experience", "font-size: 18px; font-weight: bold;");
cv.workExperience.forEach((work) => {
  console.log(`🏢 %c${work.title} - ${work.company}`, "font-size: 16px;");
  console.log(`📅 %c${work.period} | ${work.location}`, "font-size: 14px;");
  console.log(`📝 %c${work.description}`, "font-size: 14px;");
});
console.log("\n🛠️ %cSkills", "font-size: 18px; font-weight: bold;");
cv.skills.forEach((skill) => {
  console.log(`🔧 %c${skill}`, "font-size: 14px;");
});
