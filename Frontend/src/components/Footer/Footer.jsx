import React from "react";
import "./Footer.css";
import { FaEnvelope, FaGithub, FaHeart, FaLinkedin } from "react-icons/fa";

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-brand">{profile?.name || "Aatheeswaran M"}</h3>
          <p className="footer-tagline">
            {profile?.bio || "Building digital experiences with passion"}
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-socials">
            {profile?.socialLinks?.github ? (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            ) : null}
            {profile?.socialLinks?.linkedin ? (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            ) : null}
            {profile?.email ? (
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <FaEnvelope />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} {profile?.name || "Aatheeswaran M"} . Made with{" "}
          <FaHeart className="heart-icon" /> .....
        </p>
      </div>
    </footer>
  );
};

export default Footer;
