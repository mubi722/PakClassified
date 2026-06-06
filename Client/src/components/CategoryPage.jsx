import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const toTitleCase = (value) =>
  String(value || "")
    .trim()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const catRes = await axios.get("http://localhost:5000/api/categories");
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || [];
        const match = cats.find((c) => {
          const categorySlug = c.slug || (c.name || "").toLowerCase().replace(/\s+/g, "-");
          return categorySlug === slug;
        });
        const name = match ? match.name || match.slug || toTitleCase(slug) : toTitleCase(slug);
        setCategoryName(name);

        const categoryQuery = match
          ? match.slug || match.name || name
          : slug.replace(/-/g, " ");

        const res = await axios.get("http://localhost:5000/api/ads/search", {
          params: { category: categoryQuery }
        });
        const data = res.data;
        const arr = Array.isArray(data) ? data : data.ads || data.getadd || [];
        setItems(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) return <div className="container py-5 text-center">Loading cars…</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Category: {categoryName}</h3>
          <p className="text-muted mb-0">
            {items.length} car{items.length === 1 ? "" : "s"} found
          </p>
        </div>
        <Link to="/categories" className="btn btn-outline-secondary btn-sm">
          Back to categories
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-info">No cars found in this category.</div>
      ) : (
        <div className="row g-4">
          {items.map((it) => (
            <div className="col-md-4" key={it._id || it.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={it.images?.[0] || "/images/car1.jpg"}
                  className="card-img-top"
                  style={{ height: 180, objectFit: "cover" }}
                  alt={it.name || it.title || "Car image"}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{it.name || it.title}</h5>
                  <p className="text-muted mb-2">{(it.description || "").slice(0, 80)}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong className="text-success">{it.price ? `PKR ${it.price}` : ""}</strong>
                    <Link to={`/details/${it._id || it.id}`} className="btn btn-sm btn-outline-primary">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
