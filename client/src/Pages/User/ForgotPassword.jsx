import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", phone: "", newPassword: "" });
  const [fieldError, setFieldError] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldError({ ...fieldError, [e.target.name]: "" });
  };

  const validateStep = () => {
    const errors = {};
    if (step === 1 && !formData.email) errors.email = "Email is required";
    if (step === 2 && !formData.phone) errors.phone = "Phone is required";
    if (step === 3 && !formData.newPassword) errors.newPassword = "Password is required";
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
    } else {
      try {
        await axiosInstance.put("/user/update-password", formData);
        setSuccess(true);
        setTimeout(() => {
          navigate("/user/login");
        }, 2000);
      } catch (error) {
        const msg = error.response?.data?.message || "Something went wrong";
        if (msg.includes("email")) {
          setStep(1);
          setFieldError({ email: msg });
        } else if (msg.includes("phone")) {
          setStep(2);
          setFieldError({ phone: msg });
        } else {
          setFieldError({ newPassword: msg });
        }
      }
    }
  };

  return (
    <Container fluid className="login-background d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 d-flex align-items-center justify-content-center">
        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
          <Card className="text-center border-0 shadow-lg p-4 bg-body rounded-4" style={{ maxWidth: "400px", width: "90%" }}>
            <div className="text-center mb-4">
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                alt="Brand Logo"
                style={{ maxWidth: "180px", height: "auto" }}
              />
            </div>
            <h4 className="text-primary mb-4">Forgot Password</h4>
            <Form>
              {step === 1 && (
                <Form.Group className="mb-3 text-center">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter registered email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-pill py-2"
                  />
                  {fieldError.email && <div className="text-danger mt-1 small">{fieldError.email}</div>}
                </Form.Group>
              )}

              {step === 2 && (
                <Form.Group className="mb-3 text-center">
                  <Form.Label className="fw-semibold">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter registered phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="rounded-pill py-2"
                  />
                  {fieldError.phone && <div className="text-danger mt-1 small">{fieldError.phone}</div>}
                </Form.Group>
              )}

              {step === 3 && (
                <Form.Group className="mb-3 text-center">
                  <Form.Label className="fw-semibold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="rounded-pill py-2"
                  />
                  {fieldError.newPassword && <div className="text-danger mt-1 small">{fieldError.newPassword}</div>}
                </Form.Group>
              )}

              <div className="d-flex justify-content-between">
                {step > 1 && (
                  <Button variant="outline-secondary" onClick={handlePrevious} className="py-2 px-4 fs-6 shadow-lg rounded-pill">
                    Back
                  </Button>
                )}

                <Button
                  variant="warning"
                  className="py-2 px-4 fs-6 w-100 shadow-lg rounded-pill"
                  onClick={step === 3 ? handleSubmit : handleNext}
                >
                  {step === 3 ? "Reset Password" : "Next"}
                </Button>
              </div>
            </Form>

            <div className="mt-3">
              <Button
                variant="link"
                className="text-decoration-none text-primary"
                onClick={() => navigate("/user/login")}
              >
                Back to Login
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={12} md={6} className="d-none d-md-flex justify-content-center align-items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1744435346/Food%20Order%20Website/Password/b3a21zvhv0cbgsxjlkca.jpg"
            className="img-fluid"
            alt="Forgot Password Illustration"
            style={{ maxWidth: "100%", height: "800px", objectFit: "contain", padding: "10px" }}
          />
        </Col>
      </Row>

      <Modal show={success} onHide={() => setSuccess(false)} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 fw-bold text-success">Password updated successfully!</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ForgotPassword;
