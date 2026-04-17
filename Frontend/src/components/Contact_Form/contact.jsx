import React, { useRef } from "react";
import "./contact.css";
import { TextField } from "@mui/material";
import Aathees from "../images/Aathee.M.png";
import { motion as Motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const ContactUs = ({ profile }) => {
  const form = useRef();

  const sendEmail = (event) => {
    event.preventDefault();

    emailjs
      .sendForm("service_frvjq8l", "template_w2hbaue", form.current, {
        publicKey: "BJTV_kFxyD1mh9OsB",
      })
      .then(
        () => {
          alert("Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <Motion.div
      className="container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <Motion.div
        initial={{ opacity: 0, x: -40, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.2 }}
        className="img"
      >
        <img src={profile?.profileImage || Aathees} alt="Profile" />
      </Motion.div>

      <Motion.div
        className="Contact_Box"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <Motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
          className="contact-title"
        >
          Contact Me
        </Motion.h2>

        <Motion.form
          ref={form}
          className="form"
          onSubmit={sendEmail}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <TextField
            label="name"
            name="name"
            variant="outlined"
            className="Form"
            required
            fullWidth
            size="small"
          />
          <TextField
            label="email"
            name="email"
            type="email"
            variant="outlined"
            className="Form"
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Message"
            name="message"
            variant="outlined"
            className="Form"
            multiline
            rows={3}
            required
            fullWidth
            size="small"
          />
          <button type="submit" className="btn-send">
            Send Message
          </button>
        </Motion.form>
      </Motion.div>
    </Motion.div>
  );
};

export default ContactUs;
