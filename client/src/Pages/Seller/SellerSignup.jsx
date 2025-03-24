import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import "../../App.css";

function SellerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    password: "",
    contactEmail: "",
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axiosInstance.post("/restaurant/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/seller/homepage");
      }, 2000);
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="loginBackground min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <motion.div className="background-effect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}></motion.div>
      <Row className="w-100">
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="text-center border-0 shadow-lg p-4 mb-5 bg-body-tertiary rounded-4 animated-card w-100" style={{ maxWidth: '400px' }}>
              <motion.p className="fs-4 fw-bold text-primary">SELLER SIGNUP</motion.p>
              {error && <motion.p className="text-danger">{error}</motion.p>}
              <Form onSubmit={handleSubmit} className="inputBox-width">
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Business Name" name="name" value={formData.name} onChange={handleChange} required className="rounded-pill py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required className="rounded-pill py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required className="rounded-pill py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Contact Email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="rounded-pill py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="file" name="image" onChange={handleFileChange} required className="rounded-pill py-2" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required className="rounded-pill py-2" />
                </Form.Group>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="warning" type="submit" className="py-2 px-4 fs-6 inputBox-width shadow-lg rounded-pill" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </motion.div>
              </Form>
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756879/Food%20Order%20Website/eyqxjirzit2trvcv5sv4.png" 
            className="img-fluid loginImage" 
            alt="Signup Illustration" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
      </Row>
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center">
          <motion.p className="fs-5 fw-bold text-warning">Signup successful!</motion.p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SellerSignup;