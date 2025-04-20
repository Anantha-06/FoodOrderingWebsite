import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import Cookies from "js-cookie";
import axiosInstance from "../../Axios/axiosInstance.js";
import styled from "styled-components";

// Styled Components
const LoginContainer = styled(Container)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 400px;
  width: 100%;
`;

const FormInput = styled(Form.Control)`
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  margin-bottom: 1.25rem;

  &:focus {
    border-color: #ffc107;
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 12px;
  font-weight: 500;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Illustration = styled(motion.img)`
  max-height: 80vh;
  object-fit: contain;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ErrorAlert = styled.div`
  border-radius: 8px;
  padding: 12px 16px;
  background-color: #f8d7da;
  color: #721c24;
  margin-bottom: 1.5rem;
`;

const SuccessModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
`;

function AdminLogin() {
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
      const response = await axiosInstance.post("/admin/login", formData);
      const { token } = response.data;
      if (token) {
        Cookies.set("authTokenAdmin", token, { expires: 1/24,secure:true,sameSite:"Strict" });
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
    <LoginContainer fluid>
      <Row className="g-4" style={{ maxWidth: "1200px" }}>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginCard className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-3">Admin Login</h2>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
                    borderRadius: '2px'
                  }} />
                </div>
                <p className="text-muted">Access your admin dashboard</p>
              </div>

              {error && (
                <ErrorAlert>
                  <p className="mb-0">{error}</p>
                </ErrorAlert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <FormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <FormInput
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </Form.Group>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <SubmitButton 
                    variant="warning" 
                    type="submit" 
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Logging In...
                      </>
                    ) : (
                      <>
                        Login <FiLogIn />
                      </>
                    )}
                  </SubmitButton>
                </motion.div>
              </Form>
            </LoginCard>
          </motion.div>
        </Col>

        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center">
          <Illustration
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.17.42_-_A_minimalistic_portrait_of_a_food_item_featuring_a_stylishly_plated_dish_with_vibrant_colors._The_dish_is_elegantly_arranged_on_a_white_plate_with_a_iumbg0.webp"
            alt="Admin Login Illustration"
          />
        </Col>
      </Row>

      <SuccessModal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#28a745"/>
            </svg>
            <h4 className="fw-bold mb-3">Login Successful!</h4>
            <p className="mb-4">You'll be redirected to the dashboard shortly.</p>
            <Spinner animation="border" variant="success" />
          </motion.div>
        </Modal.Body>
      </SuccessModal>
    </LoginContainer>
  );
}

export default AdminLogin;