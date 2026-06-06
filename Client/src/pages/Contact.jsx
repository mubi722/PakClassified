import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("Input changed:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with:", formData);
    alert("Message sent! (This is just a demo)");
    // In real code, send to server
  };

  return (
    <div>
      {/* Banner */}
      <div className="d-flex align-items-center text-white contact-banner">
        <div className="w-100 h-100 d-flex align-items-center contact-overlay">
          <div className="ms-4 ps-3 contact-title-border">
            <h2 className="fw-bold mb-0">Contact</h2>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mt-4">
        <h5 className="fw-bold">Contact For Any Query</h5>
      </div>

      {/* Info Cards */}
      <div className="container mt-4">
        <div className="row g-3 text-center">
          <div className="col-md-4">
            <div className="p-3 rounded contact-info-card">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> EVS, Gulberg, Lahore
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded contact-info-card">
              <FontAwesomeIcon icon={faEnvelope} /> evs@gmail.com
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 rounded contact-info-card">
              <FontAwesomeIcon icon={faPhone} /> 0300 1 387 387
            </div>
          </div>
        </div>
      </div>

      {/* Map + Form */}
      <div className="container mt-5">
        <div className="row g-4 align-items-stretch">
          {/* Map */}
          <div className="col-md-6">
            <div className="h-100 border rounded overflow-hidden">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=EVS+Gulberg+Lahore&output=embed"
                className="w-100 h-100"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="col-md-6">
            <div className="p-4 border rounded h-100">
              <p className="text-muted small">
                For any inquiries, assistance, or feedback, please fill out our contact form below. Our team is committed to responding promptly to ensure your experience with PakClassified is exceptional.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control"
                      rows="4"
                      placeholder="Enter message here"
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn w-100 contact-send-btn">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
