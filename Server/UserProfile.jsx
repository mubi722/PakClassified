import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const ads = [
    {
      title: "Mercedes-Benz C-Class Cabriolet",
      price: "68000",
      city: "Pishin Valley",
      img: "/images/car1.jpg",
    },
    {
      title: "Subaru Forester",
      price: "47000",
      city: "Jiwani",
      img: "/images/car2.jpg",
    },
    {
      title: "Nissan Rogue",
      price: "45000",
      city: "Malirpur",
      img: "/images/car3.jpg",
    },
    {
      title: "Honda CR-V",
      price: "50000",
      city: "Lahore",
      img: "/images/car4.jpg",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Profile Sidebar */}
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <img
              src="/images/profile.jpg"
              className="rounded-circle mb-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <h6 className="fw-bold">Abdul Mannan</h6>
            <p className="small mb-1">Email: imranism666@gmail.com</p>
            <p className="small mb-1">Contact Number: 03007837156</p>
            <p className="small">Birth Date: 2024-08-02</p>

            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-success btn-sm">Edit Info</button>
              <button className="btn btn-primary btn-sm">Logout</button>
            </div>
          </div>
        </div>

        {/* Ads Section */}
        <div className="col-md-9">
          <h5 className="fw-bold text-success mb-3">Posted Advertisements</h5>

          {ads.map((ad, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <img src={ad.img} className="img-fluid rounded" alt={ad.title} />
                </div>
                <div className="col-md-8">
                  <h6 className="fw-bold">{ad.title}</h6>
                  <p className="small text-muted">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>

                  <p className="small mb-1">
                    <strong>Price:</strong> {ad.price}
                  </p>
                  <p className="small">
                    <strong>City Area:</strong> {ad.city}
                  </p>

                  <div className="d-flex gap-2">
                    <button className="btn btn-danger btn-sm">Delete</button>
                    <button className="btn btn-success btn-sm">Edit</button>
                    <button className="btn btn-info btn-sm text-white">View More</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
