import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance.js";
import "../../App.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", phone: "", newPassword: "" });
  const [fieldError, setFieldError] = useState({ email: "", phone: "", newPassword: "" });
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const validateStep = () => {
    if (step === 1 && formData.email.trim()) return true;
    if (step === 2 && formData.phone.trim()) return true;
    if (step === 3 && formData.newPassword.trim()) return true;
    return false;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldError({ ...fieldError, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldError({ email: "", phone: "", newPassword: "" });

    try {
      const response = await axiosInstance.put("/user/update-password", formData);
      setSuccessMessage(response.data.message);
      setShowModal(true);
      setFormData({ email: "", phone: "", newPassword: "" });
      setTimeout(() => {
        setShowModal(false);
        navigate("/user/login");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";

      if (errorMessage.toLowerCase().includes("email")) {
        setFieldError({ email: errorMessage });
        setStep(1);
      } else if (errorMessage.toLowerCase().includes("phone")) {
        setFieldError({ phone: errorMessage });
        setStep(2);
      } else {
        setFieldError({ newPassword: errorMessage });
        setStep(3);
      }
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
                alt="Forgot Password"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
            <h4 className="text-warning" >Reset Password</h4>
            <Form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form.Group className="mb-3 my-2">
                      <Form.Control
                        type="email"
                        placeholder="Enter registered email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-pill py-2"
                      />
                      {fieldError.email && (
                        <div className="text-danger mt-1 small">{fieldError.email}</div>
                      )}
                    </Form.Group>
                    <Button onClick={handleNext} disabled={!validateStep()} className="w-100 rounded-pill mb-3">
                      Next
                    </Button>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter registered phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="rounded-pill py-2"
                      />
                      {fieldError.phone && (
                        <div className="text-danger mt-1 small">{fieldError.phone}</div>
                      )}
                    </Form.Group>
                    <Button onClick={handleNext} disabled={!validateStep()} className="w-100 rounded-pill mb-3">
                      Next
                    </Button>
                    <Button onClick={handleBack} className="w-100 rounded-pill mb-3 mt-2">
                      Back
                    </Button>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        className="rounded-pill py-2"
                      />
                      {fieldError.newPassword && (
                        <div className="text-danger mt-1 small">{fieldError.newPassword}</div>
                      )}
                    </Form.Group>
                    <Button
                      variant="warning"
                      type="submit"
                      className="py-2 px-4 fs-6 w-100 shadow-lg rounded-pill"
                      disabled={loading || !validateStep()}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                    <Button onClick={handleBack} className="w-100 rounded-pill mb-3 mt-2">
                      Back
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-3">
                <a href="/user/login" className="text-decoration-none text-primary">Back to Login</a>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center order-md-2 order-1">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1744435340/Food%20Order%20Website/Password/nro1dhisavbliqqfmcjm.jpg"
            className="img-fluid d-none d-md-block"
            alt="Reset Illustration"
            style={{ maxWidth: "100%", height: "800px", objectFit: "contain", padding: "10px" }}
          />
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 fw-bold text-warning">{successMessage}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ForgotPassword;
