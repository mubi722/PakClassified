import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Banner */}
      <section className="about-banner">
        <div className="about-banner-overlay">
          <div className="about-banner-inner container">
            <div className="about-banner-title">
              <h2 className="about-heading-border">About Us</h2>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div className="about-content">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-images-grid">
                <div className="about-image-card about-image-card--left-top">
                  <img src="/images/car1.jpg" alt="Car 1" />
                </div>
                <div className="about-image-card about-image-card--right-top">
                  <img src="/images/car2.jpg" alt="Car 2" />
                </div>
                <div className="about-image-card about-image-card--left-bottom">
                  <img src="/images/car3.jpg" alt="Car 3" />
                </div>
                <div className="about-image-card about-image-card--right-bottom">
                  <img src="/images/car4.jpg" alt="Car 4" />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-details">
                <h3 className="about-heading">
                  PakClassified is a comprehensive online platform where users can browse, buy, sell, and compare cars
                </h3>

                <p className="about-description">
                  Welcome to PakClassified, your premier destination for all things automotive in Pakistan.
                  Our platform is designed to offer a seamless experience for users looking to browse,
                  buy, sell, and compare cars. Whether you are a car enthusiast or a first-time buyer,
                  PakClassified is committed to making your car shopping journey smooth and hassle-free.
                </p>

                <ul className="about-features">
                  <li>Customer Support</li>
                  <li>Technical Assistance</li>
                  <li>Feedback and suggestion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
