import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "./PostAdModal.css";

const PostAdModal = ({ show, handleClose, modalTitle = "Post Advertisement", submitLabel = "Post Advertisement" }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        features: "",
        startDate: "",
        endDate: "",
        category: "",
        city: "",
        type: "",
        images: []
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "images") {
            setFormData({
                ...formData,
                images: files ? Array.from(files) : []
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Please log in before posting an advertisement.");
            return;
        }

        const data = new FormData();
        
        // Add form fields
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("features", formData.features);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("category", formData.category);
        data.append("city", formData.city);
        data.append("type", formData.type);

        // Add images
        formData.images.forEach((image) => {
            data.append("images", image);
        });

        try {
            
            const res = await axios.post(
                "http://localhost:5000/api/ads",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "user-id": userId
                    }
                }
            );

            alert("Advertisement posted successfully!");
            setFormData({
                name: "",
                price: "",
                description: "",
                features: "",
                startDate: "",
                endDate: "",
                category: "",
                city: "",
                type: "",
                images: []
            });
            handleClose();

        } catch (err) {
            alert(err.response?.data?.message || "Failed to post advertisement");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" dialogClassName="edit-ad-modal-dialog" contentClassName="edit-ad-modal">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="edit-ad-modal-title">
                    {modalTitle}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                            className="form-control"
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            placeholder="Enter product description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Features */}
                    <div className="mb-3">
                        <label className="form-label">Features</label>
                        <textarea
                            className="form-control"
                            name="features"
                            placeholder="Enter product features"
                            rows="2"
                            value={formData.features}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Start Date and End Date */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Starts On</label>
                            <input
                                className="form-control"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Ends On</label>
                            <input
                                className="form-control"
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Category, City, Type */}
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="suv">SUV</option>
                                <option value="sedan">Sedan</option>
                                <option value="crossover">Crossover</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="wagon">Wagon</option>
                                <option value="sports">Sports</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="electric">Electric</option>
                                <option value="convertible">Convertible</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">City Area</label>
                                    <select
                                className="form-select select-pill"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select City Area</option>
                                <option value="karachi">Karachi</option>
                                <option value="lahore">Lahore</option>
                                <option value="islamabad">Islamabad</option>
                                <option value="rawalpindi">Rawalpindi</option>
                                <option value="multan">Multan</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Type</label>
                            <select
                                className="form-select select-pill"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                                <option value="rent">Rent</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input
                            className="form-control"
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {formData.images.length > 0 && (
                            <small className="text-muted d-block mt-2">
                                {formData.images.length} file(s) selected
                            </small>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-100"
                        style={{ backgroundColor: "#2563EB", border: "none" }}
                    >
                        Post Advertisement
                    </Button>

                </form>
            </Modal.Body>
        </Modal>
    );
};

export default PostAdModal;
