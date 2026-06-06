import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Categories.css";

const IMAGES = [
  "/images/car1.jpg",
  "/images/car2.jpg",
  "/images/car3.jpg",
  "/images/car4.jpg",
  "/images/car5.jpg",
  "/images/car6.jpg",
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ads/categories/all");
        const cats = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(cats);

        // Try to read counts from API response; if not available, call /api/search to compute counts
        const needsCountFetch = cats.filter(
          (c) => typeof c.count !== "number" && typeof c.total !== "number"
        );

        if (needsCountFetch.length === 0) {
          const countsObj = {};
          cats.forEach((c) => {
            const key = c._id ?? c.name;
            countsObj[key] = c.count ?? c.total ?? 0;
          });
          setCounts(countsObj);
        } else {
          // fetch counts in parallel using the ads search endpoint
          const promises = cats.map((c) =>
            axios
              .get("http://localhost:5000/api/ads/search", { params: { category: c.name } })
              .then((r) => {
                const data = r.data;
                const arr = Array.isArray(data) ? data : data.ads || data.getadd || [];
                return { key: c._id ?? c.name, count: Array.isArray(arr) ? arr.length : 0 };
              })
              .catch(() => ({ key: c._id ?? c.name, count: 0 }))
          );

          const results = await Promise.all(promises);
          const countsObj = {};
          results.forEach((r) => (countsObj[r.key] = r.count));
          setCounts(countsObj);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-5">Loading categories…</div>;

  return (
    <section className="categories-section container my-5">
      <h2 className="text-center text-success mb-4">Explore By Categories</h2>
      <div className="row g-4">
        {categories.map((cat, idx) => {
          const img = IMAGES[idx % IMAGES.length];
          const slug = cat.slug ?? (cat.name || "").toLowerCase().replace(/\s+/g, "-");
          const key = cat._id ?? cat.name;
          const count = counts[key] ?? cat.count ?? 0;

          return (
            <div className="col-6 col-md-3" key={key}>
              <Link to={`/category/${slug}`} className="card h-100 text-decoration-none text-dark category-card shadow-sm">
                <div className="card-img-wrap">
                  <img src={cat.image || img} className="card-img-top" alt={cat.name} />
                </div>
                <div className="card-body py-3">
                  <h6 className="card-title mb-1">{cat.name}</h6>
                  <small className="text-success">{count} Cars</small>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
