import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    // Validate inputs
    if (!email || !password) {
      setError("❌ Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { email }); // Don't log password
      
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      console.log("Login response:", res.data);
      
      // try common response shapes for user id / token
      const userId = res.data?.user?._id || res.data?.userId || res.data?.id || res.data?._id;
      const token = res.data?.token || res.data?.accessToken;
      const userName = res.data?.user?.name || "";
      const userEmail = res.data?.user?.email || res.data?.email || email || "";
      const userImage = res.data?.user?.image || "";
      const userPhone = res.data?.user?.contactNumber || res.data?.user?.phone || "";

      if (userId) localStorage.setItem("userId", userId);
      if (token) localStorage.setItem("token", token);
      if (userName) localStorage.setItem("userName", userName);
      if (userEmail) localStorage.setItem("userEmail", userEmail);
      if (userImage) localStorage.setItem("userImage", userImage);
      if (userPhone) localStorage.setItem("userPhone", userPhone);

      alert("Login successful!");
      setEmail("");
      setPassword("");
      handleClose();
      // reload so UI (PostAd check, etc.) reflects logged-in state
      window.location.reload();
    } catch (err) {
      
      // Handle specific error messages from backend
      const statusCode = err.response?.status;
      const responseMessage = err.response?.data?.message || err.response?.data?.error || err.response?.data?.msg;

      if (statusCode === 404) {
        setError("❌ No user found with this email. Please sign up first to create an account.");
      } else if (statusCode === 401 || statusCode === 400) {
        if (responseMessage?.toLowerCase().includes("password")) {
          setError("❌ Wrong password. Please check and try again.");
        } else if (responseMessage?.toLowerCase().includes("email")) {
          setError("❌ No user found with this email. Please sign up first to create an account.");
        } else {
          setError(`❌ ${responseMessage || "Invalid email or password. Please try again."}`);
        }
      } else if (err.message === "Network Error") {
        setError("❌ Network error. Please check your internet connection.");
      } else {
        setError(`❌ ${responseMessage || "Login failed. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4 pt-0">
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
          <Button type="submit" className="w-100" variant="primary" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
