import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faYoutube, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">

          {/* Company */}
          <div className="col-md-3">
            <h5>Company</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nulla vitae elit libero, a pharetra augue.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Condition</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h5>Contact</h5>

            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Ferozepur Road, Gulberg III, Lahore
            </p>

            <p>
              <FontAwesomeIcon icon={faPhone} /> 0300 1 387 387
            </p>

            <p>
              <FontAwesomeIcon icon={faEnvelope} /> evs@gmail.com
            </p>

            <div className="social-icons">
              <FontAwesomeIcon icon={faTwitter} />
              <FontAwesomeIcon icon={faFacebookF} />
              <FontAwesomeIcon icon={faYoutube} />
              <FontAwesomeIcon icon={faLinkedinIn} />
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-md-3">
            <h5>Newsletter</h5>
            <p>Subscribe to our newsletter for the latest updates and news.</p>

            <div className="newsletter">
              <input type="email" placeholder="Your email" />
              <button>SignUp</button>
            </div>
          </div>

        </div>

        <hr />

        <div className="footer-bottom">
          <p>
            © PakClassified, All Right Reserved. Designed By <span>Team EVS</span>
          </p>
          <div className="footer-menu">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Help</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;