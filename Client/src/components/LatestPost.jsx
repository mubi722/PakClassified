import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./LatestPost.css";

const LatestPosting = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ads");

        const sortedAds = response.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAds(sortedAds.slice(0, 4)); // Show only the latest 4 ads
      } catch (error) {
        console.error("Error fetching latest ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAds();
  }, []);

  return (
    <div className="latest-posting-section py-5">
      <div className="container">
        {/* Section Title */}
        <h3 className="text-center text-success fw-bold mb-5">
          Latest Posting
        </h3>

        {/* Loading State */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : (
          <div className="row">
            {ads.map((ad) => (
              <div key={ad._id} className="col-md-6 mb-4">
                <div className="card latest-card h-100">
                  <img
                    src={ad.image || ad.images?.[0] || ''}
                    className="card-img-top latest-card-img"
                    alt={ad.title}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{ad.title}</h5>
                    <p className="card-text text-muted small">
                      {ad.description}
                    </p>
                    <Link
                      to={`/details/${ad._id}`}
                      className="btn btn-success btn-sm mt-auto align-self-start"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPosting;