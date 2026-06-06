import React from "react";
import { Modal } from "react-bootstrap";

const EditUserModal = ({ show, handleClose, editForm, handleFormChange, handleSaveChanges }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Edit User Information</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4 pt-0">
        <form className="edit-user-form">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={editForm.name}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={editForm.email}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="text"
              className="form-control"
              value={editForm.contactNumber}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="birthDate" className="form-label">
              Birth Date
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="form-control"
              value={editForm.birthDate}
              onChange={handleFormChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="border-0 px-4 pb-4 pt-0">
        <button type="button" className="btn btn-primary w-100" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
