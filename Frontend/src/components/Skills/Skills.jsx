import React from "react";
import {
  FaAws,
  FaCss3Alt,
  FaDocker,
  FaGit,
  FaGithub,
  FaHtml5,
  FaNodeJs,
  FaReact,
} from "react-icons/fa";
import {
  SiBootstrap,
  SiC,
  SiCplusplus,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPostman,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import "./Skills.css";

const iconMap = {
  react: <FaReact />,
  javascript: <SiJavascript />,
  node: <FaNodeJs />,
  mongodb: <SiMongodb />,
  figma: <SiFigma />,
  typescript: <SiTypescript />,
  html: <FaHtml5 />,
  css: <FaCss3Alt />,
  git: <FaGit />,
  docker: <FaDocker />,
  c: <SiC />,
  cpp: <SiCplusplus />,
  cplusplus: <SiCplusplus />,
  next: <SiNextdotjs />,
  nextjs: <SiNextdotjs />,
  tailwind: <SiTailwindcss />,
  express: <SiExpress />,
  mysql: <SiMysql />,
  bootstrap: <SiBootstrap />,
  redux: <SiRedux />,
  postman: <SiPostman />,
  firebase: <SiFirebase />,
  aws: <FaAws />,
  github: <FaGithub />,
};

const marqueeFallback = [
  { icon: <FaHtml5 />, name: "HTML5" },
  { icon: <FaCss3Alt />, name: "CSS3" },
  { icon: <SiJavascript />, name: "JavaScript" },
  { icon: <FaReact />, name: "React" },
  { icon: <FaNodeJs />, name: "Node.js" },
  { icon: <SiExpress />, name: "Express" },
  { icon: <SiMongodb />, name: "MongoDB" },
  { icon: <SiMysql />, name: "MySQL" },
  { icon: <FaGit />, name: "Git" },
  { icon: <FaGithub />, name: "GitHub" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS" },
  { icon: <SiBootstrap />, name: "Bootstrap" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <SiRedux />, name: "Redux" },
  { icon: <SiPostman />, name: "Postman" },
  { icon: <FaDocker />, name: "Docker" },
  { icon: <SiFirebase />, name: "Firebase" },
  { icon: <FaAws />, name: "AWS" },
  { icon: <SiFigma />, name: "Figma" },
];

const Skills = ({ skills = [] }) => {
  const filteredSkills = (Array.isArray(skills) ? skills : []).filter(
    (skill) => String(skill?.name || "").trim().length > 0
  );

  const skillsData = skills.length
    ? filteredSkills.map((skill, index) => ({
        icon: iconMap[String(skill.icon || skill.name).toLowerCase()] || <FaReact />,
        name: skill.name,
        color: "#61DAFB",
        progress: Number(skill.level) || 75,
      }))
    : [
        { icon: <SiNextdotjs />, name: "Next.js", color: "#000000", progress: 85 },
        { icon: <FaReact />, name: "React", color: "#61DAFB", progress: 90 },
        { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6", progress: 80 },
        { icon: <SiTailwindcss />, name: "Tailwind CSS", color: "#06B6D4", progress: 85 },
        { icon: <SiJavascript />, name: "JavaScript", color: "#F7DF1E", progress: 90 },
        { icon: <FaHtml5 />, name: "HTML", color: "#E34F26", progress: 95 },
        { icon: <FaCss3Alt />, name: "CSS", color: "#1572B6", progress: 90 },
        { icon: <FaGit />, name: "Git", color: "#F05032", progress: 85 },
        { icon: <FaNodeJs />, name: "Node.js", color: "#339933", progress: 85 },
        { icon: <FaDocker />, name: "Docker", color: "#2496ED", progress: 75 },
        { icon: <SiC />, name: "C", color: "#A8B9CC", progress: 80 },
        { icon: <SiCplusplus />, name: "C++", color: "#00599C", progress: 75 },
      ];

  const marqueeSkills = filteredSkills.length
    ? filteredSkills.map((skill) => ({
        icon: iconMap[String(skill.icon || skill.name).toLowerCase()] || <FaReact />,
        name: skill.name,
      }))
    : marqueeFallback;

  return (
    <div className="Skills" aria-label="skills carousel">
      <h1 className="Skill-H">Skills</h1>
      <div className="underlineS" />

      <div className="skills-marquee" aria-live="off">
        {[0, 1].map((track) => (
          <div className="group" key={track} aria-hidden={track === 1}>
            {marqueeSkills.map((skill, index) => (
              <div className="skill" key={`${track}-${skill.name}-${index}`}>
                {skill.icon} <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="skills-technologies-section">
        <h2 className="section-title">Skills & Technologies</h2>
        <p className="section-subtitle">
          The magical tools I use to bring <span className="highlight">ideas to life</span>
        </p>

        <div className="skills-grid">
          {skillsData.map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="skill-card">
              <div className="skill-icon" style={{ color: skill.color }}>
                {skill.icon}
              </div>
              <h3 className="skill-title">{skill.name}</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${skill.progress}%`,
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
