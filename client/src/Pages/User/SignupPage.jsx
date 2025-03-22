import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import "../../App.css";
import axiosInstance from "../../Axios/axiosInstance";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
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
      const response = await axiosInstance.post("/user/signup", formData);
      
      if (response.status === 201 || response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="signup-Background">
      <Row>
        <Col xs={12} sm={12} md={9} lg={9} className="d-flex flex-column justify-content-center align-items-center">
          <Card className="d-flex text-center border border-0 shadow-lg p-3 mb-5 bg-body-tertiary rounded-3">
            <div>
              <p className="fs-4 fw-bold">SIGNUP</p>
              {error && <p className="text-danger">{error}</p>}
              <Form className="inputBox-width" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
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
                  />
                </Form.Group>
                <Button variant="warning" type="submit" className="py-2 px-4 fs-6 inputBox-width" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
                </Button>
              </Form>
            </div>
          </Card>
          <p className="fs-6">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
        </Col>
        <Col xs={12} sm={12} md={3} lg={3} className="d-flex justify-content-end m-0 p-0">
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/hn0jwlxetvu0rf2tskkt.png"
            className="loginImage"
            alt="Signup Illustration"
          />
        </Col>
      </Row>
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 fw-bold text-warning">Signed up successfully!</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SignUpPage;
