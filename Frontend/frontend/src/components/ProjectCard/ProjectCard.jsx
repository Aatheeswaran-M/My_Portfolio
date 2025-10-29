import React, { useEffect, useState } from "react";
import "./ProjectCard.css";
import { motion as Motion } from "framer-motion"

const ProjectCard = () => {
  const Url = "http://localhost:5000/api/projects";
  const [projects, setProjects] = useState([]); // State to store fetched projects

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await fetch(Url);
        const json = await result.json();
        setProjects(json); // Set the entire projects array
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div  className="projects-container"
    >
      <Motion.h1 
         initial= {{opacity:0 , scale:0}}
         whileInView={{opacity:9 , scale:1}}
         transition={{duration:2}}
      className="projects-title">🚀 My Projects</Motion.h1>
      <div className="projects-wrapper">
        <Motion.div 
       
        className="projects-grid">
          {projects.map((project) => (
            <Motion.div  whileHover={{scale:1.05}} 

            className="project-card" key={project._id}>
              <div className="project-image">
                <img src={project.thumbnail} alt={project.title} />
              </div>
              <div className="project-content">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="tech-list">
                  {project.technologies.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    💻 Code
                  </a>
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    🌐 Live
                  </a>
                </div>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </div>
  );
};

export default ProjectCard;
