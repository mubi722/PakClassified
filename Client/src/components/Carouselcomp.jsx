import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import "./carousel.css";
import PostAdModal from "./PostAdModal.jsx";

const Carouselcomp = () => {
  const [showPostAd, setShowPostAd] = useState(false);
  
  return (
    <div className="carousel-wrapper">
      <Carousel interval={3000}>
        {/* ===== SLIDE 1 WITH TEXT ===== */}
        <Carousel.Item>
          <img className="d-block w-100 carosule-img" src="/images/car5.jpg" alt="car-img-01" />

          <div className="overlay-text">
            <h1>Shift Into Gear:</h1>
            <h2>Your Destination for Car Excellence</h2>
            <p>Drive Your Dream: Find Your Perfect Car Today</p>

            <div className="mt-3">
              <button className="btn btn-success me-2"
                 data-bs-toggle="collapse"
          data-bs-target="#searchBox"
          >
                Search A Car
              </button>

              <button onClick={() => setShowPostAd(true)} className="btn btn-primary">
                Post Advertisement
              </button>
            </div>
          </div>
        </Carousel.Item>

        {/* ===== SLIDE 2 ===== */}
        <Carousel.Item>
          <img className="d-block w-100 carosule-img" src="/images/car2.jpg" alt="car-img-02" />
        </Carousel.Item>

        {/* ===== SLIDE 3 ===== */}
        <Carousel.Item>
          <img className="d-block w-100 carosule-img" src="/images/car3.jpg" alt="car-img-03" />
        </Carousel.Item>
      </Carousel>
      <PostAdModal show={showPostAd} handleClose={() => setShowPostAd(false)} />
    </div>
  );
};

export default Carouselcomp;
