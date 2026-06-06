import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const inputsRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get("email") || "";
    setEmail(emailFromUrl);

    if (!emailFromUrl) {
      setError("Email not provided. Please sign up first.");
    }

    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }

    setCountdown(20);
    setResendDisabled(true);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleChange = (index, value) => {
    console.log("Changing OTP at index", index, "to", value);
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    const key = event.key;
    console.log("Key pressed:", key);

    if (key === "Backspace") {
      if (otp[index]) {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (key === "ArrowRight" && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text").trim();
    console.log("Pasted text:", pastedText);
    if (!/^\d+$/.test(pastedText)) return;

    const pastedDigits = pastedText.slice(0, 6).split("");
    const nextOtp = [...otp];

    for (let i = 0; i < pastedDigits.length && i < nextOtp.length; i += 1) {
      nextOtp[i] = pastedDigits[i];
    }

    setOtp(nextOtp);
    const focusIndex = Math.min(pastedDigits.length, inputsRef.current.length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = otp.join("");
    console.log("Submitting OTP:", code);

    if (code.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: code,
      });

      if (response.data.success || response.status === 200) {
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${response.data.userId || ''}`);
          const userData = userResponse.data?.singleuser || userResponse.data;

          if (userData) {
            localStorage.setItem("userId", userData._id);
            localStorage.setItem("userName", userData.name || "");
            localStorage.setItem("userEmail", userData.email || "");
            localStorage.setItem("userPhone", userData.contactNumber || "");
            localStorage.setItem("userImage", userData.image || "");
          }
        } catch (userError) {
          console.error("Error fetching user data after OTP verification:", userError);
        }

        alert("Email verified successfully! Welcome to PakClassified! ... now login to access your account.");
        window.location.href = "/";
      } else {
        setError(response.data.message || "OTP verification failed.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid OTP. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setCountdown(20);
      setResendDisabled(true);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="email-verification-page">
      <div className="email-verification-hero d-flex align-items-center text-white">
        <div className="email-verification-hero-overlay w-100 h-100 d-flex align-items-center">
          <div className="email-verification-title ms-4 ps-3">
            <h2 className="fw-bold mb-0">Email Verification</h2>
          </div>
        </div>
      </div>

      <div className="container text-center mt-5 verify-otp-section">
        <h5 className="mb-4">Enter OTP</h5>
        {email && (
          <p className="text-muted mb-3">
            Verification code sent to <strong>{email}</strong>
          </p>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center otp-input-row mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => (inputsRef.current[index] = element)}
                type="text"
                maxLength="1"
                className="form-control text-center otp-input"
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                disabled={loading}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || otp.some((digit) => digit === "")}>
            {loading ? "Verifying…" : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted small mb-2">Didn't receive the OTP?</p>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleResendOtp}
            disabled={resendLoading || resendDisabled || countdown > 0}
          >
            {resendLoading ? "Sending…" : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

