import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CarDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/ads/${id}`);
        console.log("Ad data received:", JSON.stringify(res.data, null, 2));
        setAd(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ad:", err);
        setError("Advertisement not found or failed to load");
        setAd(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAd();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading ad details...</p>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Advertisement not found"}
        </div>
      </div>
    );
  }

  const rawSellerName = ad.postedBy?.name || ad.postedBy?.loginId || "Seller";
  const sellerName = String(rawSellerName)
    .split(" ")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const postedDate = ad.startDate ? new Date(ad.startDate).toLocaleDateString('en-GB') : "N/A";
  const location = ad.city || "Location not specified";
  const priceValue = ad.price ? `Rs. ${ad.price.toLocaleString()}` : "N/A";
  const adContactNumber = ad.postedBy?.contactNumber || "Not available";

  return (
    <>
      <div
        className="position-relative text-white d-flex align-items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "170px"
        }}
      >
        {/* Overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

        {/* Title */}
        <div className="container position-relative">
          <h2 className="fw-bold border-start border-4 border-success ps-3">
            Car Details
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-4">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Car Title */}
            <div className="mb-3 d-flex align-items-center">
              {ad.images && ad.images.length > 0 && (
                <img
                  src={ad.images[0]}
                  alt={ad.name || ad.title}
                  className="me-3 rounded"
                  style={{ width: '100px', height: '75px', objectFit: 'cover' }}
                />
              )}
              <div>
                <h5 className="fw-bold text-success mb-1">{ad.name || ad.title}</h5>
                <div className="text-muted small">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {ad.city || "Not specified"}
                  <span className="ms-3 fw-semibold text-dark">
                    Rs. {ad.price ? ad.price.toLocaleString() : "Price on request"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-bold border-bottom pb-2">Car Description</h6>
              <p className="text-muted">{ad.description || "No description available"}</p>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h6 className="fw-bold border-bottom pb-2">Features</h6>
              <div className="d-flex flex-column gap-2">
                {(() => {
                  const features = ad.features
                    ? Array.isArray(ad.features)
                      ? ad.features
                      : typeof ad.features === 'string'
                        ? ad.features.split(/(?:\d+\.|[,;\n])/).map(item => item.trim()).filter(Boolean)
                        : []
                    : [];

                  if (features.length > 0) {
                    return features.map((feature, index) => (
                      <div key={index} className="d-flex align-items-start">
                        <span className="me-2" style={{ color: '#6f42c1', fontSize: '1rem', lineHeight: '1.3' }}>
                          ✔
                        </span>
                        <span className="text-muted small">{feature}</span>
                      </div>
                    ));
                  }

                  return <p className="text-muted">No features available</p>;
                })()}
              </div>
            </div>
          </div>

          {/* Right Column - Advertisement Summary */}
          <div className="col-lg-4">
            <div className="card border-success shadow-sm" style={{ backgroundColor: '#effaf3' }}>
              <div className="card-header fw-bold" style={{ backgroundColor: '#d1f1dc' }}>
                Advertisement Summary
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="text-muted small">Seller name:</div>
                      <div className="text-dark fw-semibold text-end">{sellerName}</div>
                    </div>
                  </li>
                  <li className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="text-muted small">Posted date:</div>
                      <div className="text-dark fw-semibold text-end">{postedDate}</div>
                    </div>
                  </li>
                  <li className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="text-muted small">Location:</div>
                      <div className="text-dark fw-semibold text-end">{location}</div>
                    </div>
                  </li>
                  <li className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="text-muted small">Price:</div>
                      <div className="text-dark fw-semibold text-end">{priceValue}</div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="text-muted small">Contact number:</div>
                      <div className="text-dark fw-semibold text-end">{adContactNumber}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default CarDetails;
