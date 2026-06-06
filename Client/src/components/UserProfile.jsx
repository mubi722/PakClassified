import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";
import EditUserModal from "./EditUserModal.jsx";
import EditAdModal from "./EditAdModal.jsx";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditAdModal, setShowEditAdModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    birthDate: "",
  });

  const fetchUserData = async (userId) => {
    const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
    const user = userRes.data?.singleuser || userRes.data || {};
    const fallbackImage = localStorage.getItem("userImage");
    const userWithImage = {
      ...user,
      image: user.image || fallbackImage || "",
    };

    if (!fallbackImage && userWithImage.image) {
      localStorage.setItem("userImage", userWithImage.image);
    }

    setUserData(userWithImage);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchUserData(userId);

        const adsRes = await axios.get(`http://localhost:5000/api/ads?userId=${userId}`);
        const adsData = Array.isArray(adsRes.data)
          ? adsRes.data
          : Array.isArray(adsRes.data?.ads)
          ? adsRes.data.ads
          : [];

        setAdvertisements(adsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    navigate("/");
  };

  const handleViewDetails = (ad) => {
    navigate(`/details/${ad._id || ad.id}`);
  };

  const handleEditAdClick = (ad) => {
    setSelectedAd(ad);
    setShowEditAdModal(true);
  };

  const handleEditClick = () => {
    if (userData) {
      setEditForm({
        name: userData.name || "",
        email: userData.email || "",
        contactNumber: userData.contactNumber || "",
        birthDate: userData.birthDate || "",
      });
      setShowEditModal(true);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/user/${userData._id}`, {
        name: editForm.name,
        email: editForm.email,
        contactNumber: editForm.contactNumber,
        birthDate: editForm.birthDate,
      });

      const updatedUserFromApi = res.data?.updateduser || res.data || {};
      const updatedUser = {
        ...userData,
        ...updatedUserFromApi,
      };

      if (!updatedUser.image && userData?.image) {
        updatedUser.image = userData.image;
      }

      if (updatedUser.image) {
        localStorage.setItem("userImage", updatedUser.image);
      }
      localStorage.setItem("userName", editForm.name);
      localStorage.setItem("userEmail", editForm.email);
      localStorage.setItem("userPhone", editForm.contactNumber);
      localStorage.setItem("userBirthDate", editForm.birthDate);
      setShowEditModal(false);
      await fetchUserData(userData._id);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm("Delete this advertisement?")) {
      await axios.delete(`http://localhost:5000/api/ads/${id}`);
      setAdvertisements(advertisements.filter((ad) => ad._id !== id));
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container-fluid p-0 user-dashboard">
      <div className="bg-dark bg-opacity-75 p-5 dashboard-header">
        <div className="d-flex align-items-center h-100">
          <div>
            <div className="d-flex align-items-center">
              <div className="me-3 header-accent-bar"></div>
              <h2 className="text-white fw-bold m-0">User Dashboard</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card rounded-3 shadow-sm">
              <div className="card-body text-center">
                {userData?.image ? (
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="rounded-circle border border-4 profile-image"
                  />
                ) : (
                  <div className="rounded-circle border border-4 d-flex align-items-center justify-content-center mx-auto profile-placeholder">
                    <i className="bi bi-person-fill profile-icon"></i>
                  </div>
                )}

                <h5 className="fw-bold mt-2">{userData?.name}</h5>
                <p className="small text-muted mb-1">
                  Email: {userData?.email}
                </p>
                <p className="small text-muted mb-3">
                  Contact: {userData?.contactNumber}
                </p>

                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-success btn-sm px-3" onClick={handleEditClick}>
                    Edit Info
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <h4 className="fw-bold ps-3 border-start border-4 mb-4 ads-title">Posted Advertisements</h4>

            {advertisements.length === 0 ? (
              <div className="alert alert-info">
                No advertisements posted yet.
              </div>
            ) : (
              advertisements.map((ad) => (
                <div className="card rounded-3 shadow-sm mb-3" key={ad._id}>
                  <div className="row g-0">
                    <div className="col-md-4 overflow-hidden">
                      {ad.images?.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.name}
                          className="ad-card-image"
                        />
                      ) : (
                        <div className="ad-card-placeholder" />
                      )}
                    </div>

                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="fw-bold">{ad.name}</h5>
                        <p className="text-muted small">
                          {ad.description}
                        </p>
                        <p className="fw-semibold">
                          Price: Rs. {ad.price}
                        </p>
                        <p className="fw-semibold">
                          City Area: {ad.city}
                        </p>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => handleDeleteAd(ad._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-success btn-sm px-3"
                            onClick={() => handleEditAdClick(ad)}
                          >
                            Edit
                          </button>
                          <button className="btn btn-primary btn-sm px-3"
                            onClick={() => handleViewDetails(ad)}
                          >
                            View More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        editForm={editForm}
        handleFormChange={handleFormChange}
        handleSaveChanges={handleSaveChanges}
      />

      <EditAdModal
        show={showEditAdModal}
        handleClose={() => setShowEditAdModal(false)}
        ad={selectedAd}
        onSave={(updatedAd) => {
          setAdvertisements((prev) => prev.map((item) => (item._id === updatedAd._id ? updatedAd : item)));
          setSelectedAd(updatedAd);
          setShowEditAdModal(false);
        }}
      />

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Advertisement Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAd && (
            <>
              <h5>{selectedAd.name}</h5>
              <p className="text-success fw-bold">
                Rs. {selectedAd.price}
              </p>
              <p>{selectedAd.description}</p>
              <p>City: {selectedAd.city}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserProfile;
