import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";
import Popup from "../../Components/User/Popup.jsx";
import { motion } from "framer-motion";

function UserAddressEdit() {
  const [formData, setFormData] = useState({
    name: "",
    houseName: "",
    streetName: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "phone" || name === "pincode") && !/^\d*$/.test(value)) return;
    if (name === "phone" && value.length > 10) return;
    if (name === "pincode" && value.length > 6) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }
    if (formData.pincode.length !== 6) {
      setError("Pincode must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put("/address/update/new", formData);
      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setError(error.response?.data?.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container fluid>
        <div className="text-center fs-3 fw-bold my-4">Edit Your Address</div>
        <Form onSubmit={handleSubmit} className="my-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="d-flex flex-column gap-3"
          >
            {[
              { label: "Name", name: "name" },
              { label: "House Name", name: "houseName" },
              { label: "Street Name", name: "streetName" },
              { label: "Landmark", name: "landmark" },
              { label: "City Name", name: "city" },
              { label: "State Name", name: "state" },
              { label: "Pincode No", name: "pincode", type: "number" },
              { label: "Phone No", name: "phone", type: "number" },
            ].map((field, index) => (
              <Form.Group key={index} className="d-flex flex-row gap-3 align-items-center">
                <Form.Label className="mb-0 fw-bold" style={{ width: "140px" }}>
                  {field.label}:
                </Form.Label>
                <Form.Control
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
          </motion.div>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <div className="text-center my-4">
            <Button type="submit" variant="warning" className="px-5 my-4" disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </Button>
          </div>
        </Form>

        {showSuccess && <Popup message="Address Updated successfully!" type="success" />}
      </Container>
    </motion.div>
  );
}

export default UserAddressEdit;
