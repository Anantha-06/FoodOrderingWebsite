import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axiosInstance from "../../Axios/axiosInstance.js";

function AdminLogin() {
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
      const response = await axiosInstance.post("/admin/login", formData);
      const { token } = response.data;
      if (token) {
        Cookies.set("authToken", token, { expires: 1 });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/admin/dashboard");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,rgb(255, 255, 255),rgb(118, 118, 118))" }}>
      <Row className="w-100" style={{ maxWidth: "900px" }}>
        <Col xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card style={{ textAlign: "center", border: "none", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", padding: "2rem", borderRadius: "15px", maxWidth: "400px", width: "100%" }}>
              <motion.p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>ADMIN LOGIN</motion.p>
              {error && <motion.p style={{ color: "red" }}>{error}</motion.p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required style={{ borderRadius: "25px", padding: "10px" }} />
                </Form.Group>
                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ borderRadius: "25px", padding: "10px" }} />
                </Form.Group>
                <Button variant="warning" type="submit" style={{ width: "100%", padding: "10px", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold" }} disabled={loading}>
                  {loading ? "Logging in..." : "Submit"}
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} whileHover={{ scale: 1.05, rotate: 2 }} src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.17.42_-_A_minimalistic_portrait_of_a_food_item_featuring_a_stylishly_plated_dish_with_vibrant_colors._The_dish_is_elegantly_arranged_on_a_white_plate_with_a_iumbg0.webp" alt="Login Illustration" style={{ maxWidth: "100%", height: "auto", objectFit: "contain", padding: "10px" }} />
        </Col>
      </Row>
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body style={{ textAlign: "center" }}>
          <motion.p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffc107" }} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>Logged in successfully!</motion.p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminLogin;
