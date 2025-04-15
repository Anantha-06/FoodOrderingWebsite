import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axiosInstance from "../../Axios/axiosInstance.js";
import styled from "styled-components";

// Styled Components
const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const FormInput = styled(Form.Control)`
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #f39c12;
    box-shadow: 0 0 0 0.25rem rgba(243, 156, 18, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #f39c12, #e74c3c);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    transform: none !important;
  }
`;

const Illustration = styled(motion.img)`
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const AuthLink = styled.a`
  color: #f39c12;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #e74c3c;
    text-decoration: underline;
  }
`;

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
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer fluid>
      <Row className="w-100 align-items-center">
        {/* Illustration Column - Hidden on mobile */}
        <Col md={6} className="d-none d-md-flex justify-content-center">
          <Illustration
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.19.39_-_A_minimalistic_portrait_of_a_gourmet_food_item_featuring_an_elegantly_plated_dish_with_vibrant_colors._The_dish_is_stylishly_arranged_on_a_white_plat_eaagli.webp"
            alt="Food Illustration"
            style={{
              height: '100vh',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'cover'
            }}
          />
        </Col>

        {/* Login Form Column */}
        <Col xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <LoginCard>
              <div className="text-center mb-4">
                <motion.img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                  alt="Logo"
                  style={{ maxWidth: "180px" }}
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1 }}
                />
                <h2 className="mt-3 fw-bold" style={{ color: "#2c3e50" }}>
                  Welcome Back
                </h2>
                <p className="text-muted">Sign in to continue to your account</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-danger"
                >
                  {error}
                </motion.div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Email Address</Form.Label>
                  <FormInput
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <FormInput
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SubmitButton
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </SubmitButton>
                </motion.div>

                <div className="d-flex justify-content-between mt-4">
                  <AuthLink href="/user/signup">Create Account</AuthLink>
                  <AuthLink href="/user/update-password">Forgot Password?</AuthLink>
                </div>
              </Form>
            </LoginCard>
          </motion.div>
        </Col>
      </Row>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-5 rounded-3 text-center"
            style={{ maxWidth: "400px" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <span style={{ fontSize: "3rem" }}>🎉</span>
            </motion.div>
            <h4 className="mt-3 fw-bold text-success">Login Successful!</h4>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </motion.div>
        </motion.div>
      )}
    </LoginContainer>
  );
}

export default LoginPage;