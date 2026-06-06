import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./AdvertisementListing.css";

const AdvertisementListing = () => {
  const { slug } = useParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryName = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Hatchback";

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryQuery = slug ? slug.replace(/-/g, " ") : "";
        const url = categoryQuery
          ? `http://localhost:5000/api/ads/search?category=${encodeURIComponent(categoryQuery)}`
          : "http://localhost:5000/api/ads";

        const res = await axios.get(url);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.ads || res.data.getadd || [];

        setAds(data);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setError("Failed to load advertisements");
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [slug]);

  return (
    <>
      {/* Hero Section */}
      <div className="ad-listing-hero d-flex align-items-center">
        <div className="ad-listing-overlay"></div>

        <div className="container position-relative">
          <h2 className="ad-listing-hero-title">Advertisement Categories</h2>
        </div>
      </div>

      <div className="container text-center my-4">
        <h1 className="ad-category-heading">{categoryName}</h1>
      </div>

      {/* Advertisement Cards */}
      <div className="container mb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : ads.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            No advertisements available.
          </div>
        ) : (
          ads.map((ad) => (
            <div key={ad._id || ad.id} className="ad-card mb-3">
              <div className="row g-0 align-items-center">
                <div className="col-md-3">
                  <img
                    src={ad.images?.[0] || ad.image || "/images/car1.jpg"}
                    alt={ad.name || ad.title}
                    className="ad-image img-fluid w-100"
                  />
                </div>
                <div className="col-md-9">
                  <div className="ad-card-body">
                    <h5 className="ad-card-title">
                      {ad.name || ad.title}
                    </h5>
                    <p className="ad-card-description">
                      {ad.description || ad.features || "No details provided."}
                    </p>
                    <Link
                      to={`/details/${ad._id || ad.id}`}
                      className="btn btn-success btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </>
  );
};

export default AdvertisementListing;