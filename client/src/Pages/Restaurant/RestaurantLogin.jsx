import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import styled from "styled-components";
import axiosInstance from "../../Axios/axiosInstance.js";
import Cookies from "js-cookie";

const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
`;

const LoginCard = styled(Card)`
  border: none;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  max-width: 450px;
  width: 100%;
`;

const LoginIllustration = styled(motion.img)`
  max-width: 100%;
  height: auto;
  object-fit: contain;
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

const LoginButton = styled(Button)`
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

function RestaurantLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 4) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post("/restaurant/login", formData);

      Cookies.set("restaurantToken", response.data.token, {
        expires: 1/24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/restaurant/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setError("Access denied. Please check your credentials.");
        } else {
          setError(
            error.response?.data?.message || "Login failed. Please try again."
          );
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer fluid>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-100"
      >
        <Row className="align-items-center">
          <Col lg={6} className="d-flex justify-content-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <LoginCard>
                <div className="text-center mb-4">
                  <motion.img
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                    alt="Logo"
                    height="80"
                    className="mb-3"
                  />
                  <h2 className="fw-bold">Restaurant Login</h2>
                  <p className="text-muted">
                    Sign in to manage your restaurant
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  </motion.div>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <FormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <FormInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <InputGroup.Text
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LoginButton
                      type="submit"
                      className="w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Logging In...
                        </>
                      ) : (
                        "Login"
                      )}
                    </LoginButton>
                  </motion.div>

                  <div className="text-center">
                    <Link
                      to="/restaurant/signup"
                      className="text-decoration-none"
                    >
                      Don't have an account? <strong>Sign Up</strong>
                    </Link>
                  </div>
                </Form>
              </LoginCard>
            </motion.div>
          </Col>

          <Col lg={6} className="d-none d-lg-flex justify-content-center">
            <LoginIllustration
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.02 }}
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756879/Food%20Order%20Website/eyqxjirzit2trvcv5sv4.png"
              alt="Restaurant Login Illustration"
              style={{
                height: "100vh",
                width: "auto",
                maxWidth: "100%",
                objectFit: "cover",
              }}
            />
          </Col>
        </Row>
      </motion.div>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Modal.Body className="text-center p-5">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.8 }}
            >
              <span className="display-4 text-success">✓</span>
            </motion.div>
            <h4 className="mt-3 fw-bold text-success">Login Successful!</h4>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </Modal.Body>
        </motion.div>
      </Modal>
    </LoginContainer>
  );
}

export default RestaurantLogin;
