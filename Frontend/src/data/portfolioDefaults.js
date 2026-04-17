const defaultProfile = {
  name: "Aatheeswaran M",
  title: "Frontend Developer",
  bio: "I design and build polished web experiences with a frontend-first mindset and full-stack execution.",
  heroBadge: "Available for freelance, internships, and junior developer roles",
  heroTitlePrimary: "Designing smooth, modern",
  heroTitleSecondary: "digital experiences",
  heroDescription:
    "I blend thoughtful UI design, motion, and practical engineering to create portfolio sites, dashboards, and product interfaces that feel alive.",
  aboutHeading: "I care about how a product feels as much as how it functions.",
  aboutLead:
    "My work sits at the intersection of clean frontend architecture, strong visual taste, and real-world product thinking.",
  aboutParagraphs: [
    "I enjoy turning rough ideas into responsive interfaces that feel intentional on every screen size.",
    "From React components and API integrations to motion design and content systems, I like building end-to-end experiences that are easy to maintain.",
    "Right now I am focused on growing as a product-minded engineer and shipping work that looks sharp, performs well, and communicates clearly.",
  ],
  focusAreas: [
    "Interactive frontend development",
    "Admin dashboards and content systems",
    "Responsive UI architecture",
    "Animation and micro-interactions",
  ],
  availability: "Based in India and open to remote opportunities",
  email: "aatheeswaran78@gmail.com",
  phone: "+91 99948 23277",
  location: "Tamil Nadu, India",
  profileImage: "/Aathee.M.png",
  socialLinks: {
    github: "https://github.com/Aatheessubash",
    linkedin: "https://www.linkedin.com/in/aatheeswaran78",
    instagram: "https://www.instagram.com/aathees111/",
    portfolio: "",
    whatsapp: "919994823277",
    email: "aatheeswaran78@gmail.com",
    x: "",
  },
};

const defaultSkills = [
  {
    name: "React",
    category: "Frontend",
    level: 92,
    icon: "react",
    description: "Building component-driven interfaces, stateful flows, and polished interactions.",
    sortOrder: 0,
  },
  {
    name: "JavaScript",
    category: "Language",
    level: 90,
    icon: "javascript",
    description: "Shipping production UI logic and API-driven frontend features.",
    sortOrder: 1,
  },
  {
    name: "Node.js",
    category: "Backend",
    level: 84,
    icon: "node",
    description: "Creating REST APIs, content endpoints, and lightweight backend services.",
    sortOrder: 2,
  },
  {
    name: "MongoDB",
    category: "Database",
    level: 82,
    icon: "mongodb",
    description: "Designing practical schemas and data flows for real-world portfolio apps.",
    sortOrder: 3,
  },
  {
    name: "UI Motion",
    category: "Design",
    level: 88,
    icon: "sparkles",
    description: "Using motion to guide attention and make layouts feel premium.",
    sortOrder: 4,
  },
  {
    name: "Figma",
    category: "Design",
    level: 78,
    icon: "figma",
    description: "Translating layout ideas and visual systems into working products.",
    sortOrder: 5,
  },
];

const defaultExperience = [
  {
    role: "Web Developer Intern",
    company: "HOSTSPACIO Digital Solution",
    date: "2024",
    location: "On site",
    summary: "Built responsive interfaces and collaborated on client-facing product improvements.",
    tasks: [
      "Developed responsive pages using HTML, CSS, JavaScript, and React.",
      "Improved UI quality with modern layout systems and cleaner interactions.",
      "Integrated backend APIs and collaborated through Git-based workflows.",
    ],
    skills: ["React", "Node.js", "MongoDB", "UI/UX"],
    link: "",
    sortOrder: 0,
  },
  {
    role: "Web Developer Intern",
    company: "CodSoft",
    date: "2024",
    location: "Remote",
    summary: "Created landing pages, portfolio templates, and reusable interface sections.",
    tasks: [
      "Built responsive pages with HTML, CSS, JavaScript, and React.",
      "Translated layout ideas into working interfaces with cleaner responsiveness.",
      "Improved debugging and frontend problem-solving through project delivery.",
    ],
    skills: ["JavaScript", "React", "Responsive Design"],
    link: "",
    sortOrder: 1,
  },
  {
    role: "Personal Project Developer",
    company: "Independent",
    date: "2023 - Present",
    location: "Self-directed",
    summary: "Built MERN projects focused on dashboards, APIs, and useful problem-solving tools.",
    tasks: [
      "Developed MERN projects including admin panels, scanners, and healthcare concepts.",
      "Handled backend APIs, dashboard UX, and data-driven frontend features.",
      "Strengthened product thinking by shipping complete, portfolio-ready experiences.",
    ],
    skills: ["Full Stack", "Express", "MongoDB", "Product UI"],
    link: "",
    sortOrder: 2,
  },
];

export const defaultPortfolio = {
  profile: defaultProfile,
  skills: defaultSkills,
  experience: defaultExperience,
  projects: [],
  certificates: [],
  resume: {
    fileUrl: "",
    label: "Resume",
    lastUpdated: null,
  },
};

const ensureString = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const ensureStringArray = (value, fallback = []) =>
  (Array.isArray(value) ? value : fallback)
    .map((item) => ensureString(item).trim())
    .filter(Boolean);

const sortByOrder = (items) =>
  [...items].sort(
    (left, right) => (Number(left.sortOrder) || 0) - (Number(right.sortOrder) || 0)
  );

const normalizeProfile = (profile = {}) => ({
  ...defaultProfile,
  ...profile,
  aboutParagraphs: ensureStringArray(
    profile.aboutParagraphs,
    defaultProfile.aboutParagraphs
  ),
  focusAreas: ensureStringArray(profile.focusAreas, defaultProfile.focusAreas),
  socialLinks: {
    ...defaultProfile.socialLinks,
    ...(profile.socialLinks || {}),
  },
});

const normalizeSkills = (skills = []) =>
  sortByOrder(
    (Array.isArray(skills) ? skills : []).map((skill, index) => ({
      _id: skill?._id || `skill-${index}`,
      name: ensureString(skill?.name),
      category: ensureString(skill?.category),
      level: Number.isFinite(Number(skill?.level)) ? Number(skill.level) : 75,
      icon: ensureString(skill?.icon),
      description: ensureString(skill?.description),
      sortOrder: Number.isFinite(Number(skill?.sortOrder))
        ? Number(skill.sortOrder)
        : index,
    }))
  );

const normalizeExperience = (experience = []) =>
  sortByOrder(
    (Array.isArray(experience) ? experience : []).map((item, index) => ({
      _id: item?._id || `experience-${index}`,
      role: ensureString(item?.role),
      company: ensureString(item?.company),
      date: ensureString(item?.date),
      location: ensureString(item?.location),
      summary: ensureString(item?.summary),
      tasks: ensureStringArray(item?.tasks),
      skills: ensureStringArray(item?.skills),
      link: ensureString(item?.link),
      sortOrder: Number.isFinite(Number(item?.sortOrder))
        ? Number(item.sortOrder)
        : index,
    }))
  );

const normalizeProjects = (projects = []) =>
  sortByOrder(
    (Array.isArray(projects) ? projects : []).map((project, index) => ({
      _id: project?._id || `project-${index}`,
      title: ensureString(project?.title),
      description: ensureString(project?.description),
      technologies: ensureStringArray(project?.technologies),
      githubUrl: ensureString(project?.githubUrl),
      demoUrl: ensureString(project?.demoUrl),
      thumbnail: ensureString(project?.thumbnail),
      featured: Boolean(project?.featured),
      sortOrder: Number.isFinite(Number(project?.sortOrder))
        ? Number(project.sortOrder)
        : index,
    }))
  );

const normalizeCertificates = (certificates = []) =>
  sortByOrder(
    (Array.isArray(certificates) ? certificates : []).map((certificate, index) => ({
      _id: certificate?._id || `certificate-${index}`,
      title: ensureString(certificate?.title),
      issuedBy: ensureString(certificate?.issuedBy),
      issueDate: ensureString(certificate?.issueDate),
      certificateUrl: ensureString(certificate?.certificateUrl),
      description: ensureString(certificate?.description),
      thumbnail: ensureString(certificate?.thumbnail),
      sortOrder: Number.isFinite(Number(certificate?.sortOrder))
        ? Number(certificate.sortOrder)
        : index,
    }))
  );

export const normalizePortfolioData = (value = {}) => {
  const normalizedProfile = normalizeProfile(value.profile || {});
  const hasTopLevelSkills = Array.isArray(value.skills);
  const hasProfileSkills = Array.isArray(value.profile?.skills);
  const hasTopLevelExperience = Array.isArray(value.experience);
  const hasProfileExperience = Array.isArray(value.profile?.experience);

  const skillsSource = hasTopLevelSkills
    ? value.skills
    : hasProfileSkills
      ? value.profile.skills
      : defaultSkills;
  const experienceSource = hasTopLevelExperience
    ? value.experience
    : hasProfileExperience
      ? value.profile.experience
      : defaultExperience;

  return {
    profile: normalizedProfile,
    skills: normalizeSkills(skillsSource),
    experience: normalizeExperience(experienceSource),
    projects: normalizeProjects(value.projects || []),
    certificates: normalizeCertificates(value.certificates || []),
    resume: {
      ...defaultPortfolio.resume,
      ...(value.resume || {}),
    },
  };
};

export const createEmptySkill = (sortOrder = 0) => ({
  _id: `skill-new-${sortOrder}-${Date.now()}`,
  name: "",
  category: "",
  level: 75,
  icon: "",
  description: "",
  sortOrder,
});

export const createEmptyExperience = (sortOrder = 0) => ({
  _id: `experience-new-${sortOrder}-${Date.now()}`,
  role: "",
  company: "",
  date: "",
  location: "",
  summary: "",
  tasks: [],
  skills: [],
  link: "",
  sortOrder,
});

export const createEmptyProject = (sortOrder = 0) => ({
  _id: `project-new-${sortOrder}-${Date.now()}`,
  title: "",
  description: "",
  technologies: [],
  githubUrl: "",
  demoUrl: "",
  thumbnail: "",
  featured: false,
  sortOrder,
});

export const createEmptyCertificate = (sortOrder = 0) => ({
  _id: `certificate-new-${sortOrder}-${Date.now()}`,
  title: "",
  issuedBy: "",
  issueDate: "",
  certificateUrl: "",
  description: "",
  thumbnail: "",
  sortOrder,
});
