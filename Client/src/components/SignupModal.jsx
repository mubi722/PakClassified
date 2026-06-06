import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const SignupModal = ({ show, handleClose, navigate }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        apikey: "",
        loginId: "",
        password: "",
        securityQuestion: "",
        securityAnswer: "",
        birthDate: "",
        contactNumber: "",
        image: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Client-side validation
        const { name, email, loginId, password, contactNumber } = formData;
        if (!name || !email || !loginId || !password || !contactNumber) {
            alert("Please fill in all required fields: Name, Email, Login ID, Password, and Contact Number.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        if (!/^\d{10,}$/.test(contactNumber)) {
            alert("Contact Number must be at least 10 digits.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                data.append(key, value);
            }
        });

        try {            
            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // Don't store user data in localStorage yet - wait for OTP verification
            alert("Signup successful! Please check your email for OTP verification.");
            setFormData({
                name: "",
                email: "",
                apikey: "",
                loginId: "",
                password: "",
                securityQuestion: "",
                securityAnswer: "",
                birthDate: "",
                contactNumber: "",
                image: null
            });
            handleClose();

            // Redirect to OTP verification page using React Router
            if (navigate) {
                navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
            } else {
                window.location.href = `/verify-otp?email=${encodeURIComponent(formData.email)}`;
            }

        } catch (err) {
            
            // Handle specific error messages from backend
            const statusCode = err.response?.status;
            const responseMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data?.msg;

            if (statusCode === 400) {
                alert(`❌ Signup failed: ${responseMessage || "Invalid data provided. Please check your inputs."}`);
            } else if (statusCode === 409) {
                alert("❌ User already exists with this email or login ID.");
            } else if (err.message === "Network Error") {
                alert("❌ Network error. Please check your internet connection.");
            } else {
                alert(`❌ Signup failed: ${responseMessage || "Please try again."}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <input className="form-control mb-2" name="name" placeholder="Name"
                        onChange={handleChange} />

                    {/* Email */}
                    <input className="form-control mb-2" name="email" type="email"
                        placeholder="Email" onChange={handleChange} />

                    {/* API Key */}
                    <input className="form-control mb-2" name="apikey"
                        placeholder="API Key" onChange={handleChange} />

                    {/* Login ID */}
                    <input className="form-control mb-2" name="loginId"
                        placeholder="Login ID" onChange={handleChange} />

                    {/* Password */}
                    <input className="form-control mb-2" name="password"
                        type="password" placeholder="Password" onChange={handleChange} />

                    {/* Security Question */}
                    <input className="form-control mb-2" name="securityQuestion"
                        placeholder="Security Question" onChange={handleChange} />

                    {/* Security Answer */}
                    <input className="form-control mb-2" name="securityAnswer"
                        placeholder="Security Answer" onChange={handleChange} />

                    {/* Birth Date */}
                    <input className="form-control mb-2" name="birthDate" placeholder="Date of Birth"
                        type="date" onChange={handleChange} />

                    {/* Contact Number */}
                    <input className="form-control mb-2" name="contactNumber"
                        placeholder="Contact Number" onChange={handleChange} />

                    {/* Image */}
                    <input className="form-control mb-3" type="file" name="image"
                        onChange={handleChange} />

                    <Button type="submit" className="w-100 btn btn-primary" disabled={loading}>
                        {loading ? 'Signing up…' : 'Sign Up'}
                    </Button>

                </form>
            </Modal.Body>
        </Modal>
    );
};

export default SignupModal;
