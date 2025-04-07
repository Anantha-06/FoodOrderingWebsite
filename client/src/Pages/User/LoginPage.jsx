import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axiosInstance from "../../Axios/axiosInstance.js";
import "../../App.css";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const userToken = Cookies.get("authToken");
      const restaurantToken = Cookies.get("restaurantToken");
      const adminToken = Cookies.get("authTokenAdmin");
  
      if (adminToken) {
        navigate("/admin/dashboard");
      } else if (userToken) {
        navigate("/user/homepage");
      } else if (restaurantToken) {
        navigate("/restaurant/dashboard");
      }
    }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/user/login", formData);
      const { token } = response.data;

      if (token) {
        Cookies.set("authToken", token, { expires: 7, secure: true });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/user/homepage");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="login-background d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 d-flex align-items-center justify-content-center">
        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center order-md-1 order-2">
          <Card className="text-center border-0 shadow-lg p-4 bg-body rounded-4" style={{ maxWidth: "400px", width: "90%" }}>
            <div className="text-center mb-4">
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                alt="Admin Logo"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
            <h4 className="text-primary">LOGIN</h4>
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-pill py-2"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="rounded-pill py-2"
                />
              </Form.Group>
              <Button
                variant="warning"
                type="submit"
                className="py-2 px-4 fs-6 w-100 shadow-lg rounded-pill"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Submit"}
              </Button>
            </Form>
            <div className="mt-3">
              <a href="/user/signup" className="text-decoration-none text-primary">Sign Up</a>
            </div>
          </Card>
        </Col>

        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center order-md-2 order-1">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.19.39_-_A_minimalistic_portrait_of_a_gourmet_food_item_featuring_an_elegantly_plated_dish_with_vibrant_colors._The_dish_is_stylishly_arranged_on_a_white_plat_eaagli.webp"
            className="img-fluid d-none d-md-block"
            alt="Login Illustration"
            style={{ maxWidth: "100%", height: "800px", objectFit: "contain", padding: "10px" }} 
          />
        </Col>
      </Row>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 fw-bold text-warning">Logged in successfully!</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default LoginPage;
