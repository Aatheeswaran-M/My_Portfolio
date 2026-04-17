import React from "react";
import "./Experience.css";
import { motion } from "framer-motion";

const Experience = ({ items = [] }) => {
  const experiences = items;

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 240, damping: 22 },
    },
  };

  return (
    <div className="experience-container" id="experience">
      <motion.h2
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true, amount: 0.25 }}
        className="exp-title"
      >
        Experience
      </motion.h2>
      <div className="exp-underline" />
      <p className="exp-subtitle">
        My professional journey in <span className="highlight">software development</span>
      </p>

      <motion.div
        className="exp-list"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {experiences.map((exp, index) => (
          <motion.div
            className="exp-card"
            key={`${exp.role}-${exp.company}-${index}`}
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="exp-header">
              <h3>{exp.role}</h3>
              <span className="exp-date">{exp.date}</span>
            </div>
            <p className="exp-company">{exp.company}</p>

            <ul className="exp-tasks">
              {(exp.tasks || []).map((task, taskIndex) => (
                <li key={`${task}-${taskIndex}`}>{task}</li>
              ))}
            </ul>

            <div className="exp-skills">
              {(exp.skills || []).map((skill, skillIndex) => (
                <span key={`${skill}-${skillIndex}`} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Experience;
