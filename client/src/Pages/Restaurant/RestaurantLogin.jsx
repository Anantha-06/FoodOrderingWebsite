import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import Cookies from "js-cookie"; // Import js-cookie

function RestaurantLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/restaurant/login", formData);
    
      Cookies.set("restaurantToken", response.data.token, { expires: 7 });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/restaurant/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="loginBackground min-vh-100 d-flex align-items-center position-relative overflow-hidden">
      <motion.div className="background-effect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}></motion.div>
      <Row className="w-100">
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center order-md-1 order-2">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="text-center border-0 shadow-lg p-4 mb-5 bg-body-tertiary rounded-4 animated-card w-100" style={{ maxWidth: '400px' }}>
              <motion.p className="fs-4 fw-bold text-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>RESTAURANT LOGIN</motion.p>
              {error && <motion.p className="text-danger" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>{error}</motion.p>}
              <Form className="inputBox-width" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <motion.input
                    whileFocus={{ scale: 1.05, borderColor: "#ffc107", boxShadow: "0px 0px 8px rgba(255,193,7,0.8)" }}
                    type="email" placeholder="Enter email" name="email"
                    value={formData.email} onChange={handleChange} required
                    className="form-control rounded-pill py-2"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <motion.input
                    whileFocus={{ scale: 1.05, borderColor: "#ffc107", boxShadow: "0px 0px 8px rgba(255,193,7,0.8)" }}
                    type="password" placeholder="Password" name="password"
                    value={formData.password} onChange={handleChange} required
                    className="form-control rounded-pill py-2"
                  />
                </Form.Group>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="warning" type="submit" className="py-2 px-4 fs-6 inputBox-width shadow-lg rounded-pill" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </motion.div>
              </Form>
              <div className="d-flex justify-content-end">
                <Link to ={"/restaurant/signup"} className="text-decoration-none my-3">Sign Up</Link>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center order-md-2 order-1">
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756879/Food%20Order%20Website/eyqxjirzit2trvcv5sv4.png" 
            className="img-fluid loginImage" 
            alt="Login Illustration" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
      </Row>
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center">
          <motion.p className="fs-5 fw-bold text-warning" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>Logged in successfully!</motion.p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RestaurantLogin;
