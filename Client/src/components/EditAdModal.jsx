import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import "./EditAdModal.css";

export default function EditAdModal({ show, handleClose, ad, onSave }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    features: "",
    startDate: "",
    endDate: "",
    category: "",
    city: "",
    type: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileLabel, setFileLabel] = useState("Choose files");

  useEffect(() => {
    if (!show) return;

    const loadOptions = async () => {
      setLoading(true);
      try {
        const [catRes, cityRes, typeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/ads/categories/all"),
          axios.get("http://localhost:5000/api/ads/cities"),
          axios.get("http://localhost:5000/api/ads/types"),
        ]);

        setCategories(catRes.data.categories || []);
        setCities(cityRes.data.cities || []);
        setTypes(typeRes.data.types || []);
      } catch (error) {
        console.error(
          "Failed to load edit modal options:",
          error.response?.data || error.message || error
        );
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [show]);

  useEffect(() => {
    if (!ad) return;

    setForm({
      name: ad.name || "",
      price: ad.price || "",
      description: ad.description || "",
      features: ad.features || "",
      startDate: ad.startDate ? ad.startDate.slice(0, 10) : "",
      endDate: ad.endDate ? ad.endDate.slice(0, 10) : "",
      category: ad.category || "",
      city: ad.city || "",
      type: ad.type || "",
      images: [],
    });
    setFileLabel("Choose files");
  }, [ad]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setForm((prev) => ({ ...prev, images: files }));
    setFileLabel(files.length ? files.map((file) => file.name).join(", ") : "Choose files");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!ad?._id) return;

    setSaving(true);
    try {
      const userId = localStorage.getItem("userId");
      const hasNewImages = Array.isArray(form.images) && form.images.length > 0;
      let response;
      const headers = userId ? { "user-id": userId } : {};

      if (hasNewImages) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", Number(form.price));
        formData.append("description", form.description);
        formData.append("features", form.features);
        formData.append("startDate", form.startDate);
        formData.append("endDate", form.endDate);
        formData.append("category", form.category);
        formData.append("city", form.city);
        formData.append("type", form.type);
        if (userId) {
          formData.append("userId", userId);
        }

        form.images.forEach((file) => {
          formData.append("images", file);
        });

        response = await axios.put(
          `http://localhost:5000/api/ads/${ad._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...headers,
            },
          }
        );
      } else {
        const payload = {
          name: form.name,
          price: Number(form.price),
          description: form.description,
          features: form.features,
          startDate: form.startDate,
          endDate: form.endDate,
          category: form.category,
          city: form.city,
          type: form.type,
        };

        response = await axios.put(
          `http://localhost:5000/api/ads/${ad._id}`,
          payload,
          { headers }
        );
      }

      const updatedAd = response.data?.updatead || response.data || ad;
      if (onSave) onSave(updatedAd);
    } catch (error) {
      console.error("Failed to save advertisement:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="edit-ad-modal-dialog"
      className="edit-ad-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Advertisement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <form className="edit-ad-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Advertisement name"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  placeholder="Write a short description"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Features</label>
                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                  placeholder="List features"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Starts On</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Ends On</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select
                  className="form-select custom-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((option, idx) => (
                    <option key={option._id || option.id || option.name || idx} value={option.name || option.id}>
                      {option.name || option.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">City Area</label>
                <select
                  className="form-select custom-select"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((option, idx) => (
                    <option key={option._id || option.id || option.name || idx} value={option.name || option.id}>
                      {option.name || option.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select
                  className="form-select custom-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map((option, idx) => (
                    <option key={option._id || option.id || option.name || idx} value={option.name || option.id}>
                      {option.name || option.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Replace Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="form-text text-muted">
                  {fileLabel}
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving || loading}>
          {saving ? (
            <>
              <Spinner animation="border" size="sm" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
