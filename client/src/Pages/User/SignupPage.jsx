import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from "react-icons/fi";
import axiosInstance from "../../Axios/axiosInstance";
import Cookies from "js-cookie";
import styled from "styled-components";

// Styled Components
const SignUpContainer = styled(Container)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%);
  padding: 2rem;
`;

const SignUpCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
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

const ErrorAlert = styled.div`
  border-radius: 8px;
  padding: 12px 16px;
  background-color: #f8d7da;
  color: #721c24;
  margin-bottom: 1.5rem;
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
`;

const SuccessContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Illustration = styled.img`
  max-height: 90vh;
  object-fit: contain;
  @media (max-width: 992px) {
    display: none;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const InputGroup = styled.div`
  position: relative;
`;

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
    const { name, value } = e.target;
    if (name === "phone" && !/^[0-9]*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/user/signup", formData);
      
      if (response.status === 201 || response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/user/login");
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
    <SignUpContainer fluid>
      <Row className="g-0 min-vh-100">
        <Col lg={6} className="d-flex align-items-center justify-content-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignUpCard className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-3">Create Your Account</h2>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
                    borderRadius: '2px'
                  }} />
                </div>
                <p className="text-muted">Join thousands of food lovers today</p>
              </div>

              {error && (
                <ErrorAlert>
                  <p className="mb-0">{error}</p>
                </ErrorAlert>
              )}

              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <InputIcon><FiUser /></InputIcon>
                  <FormInput
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                </InputGroup>

                <InputGroup>
                  <InputIcon><FiMail /></InputIcon>
                  <FormInput
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                </InputGroup>

                <InputGroup>
                  <InputIcon><FiPhone /></InputIcon>
                  <FormInput
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    style={{ paddingLeft: '40px' }}
                  />
                </InputGroup>

                <InputGroup>
                  <InputIcon><FiLock /></InputIcon>
                  <FormInput
                    type="password"
                    placeholder="Password (min 6 characters)"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{ paddingLeft: '40px' }}
                  />
                </InputGroup>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up <FiArrowRight />
                      </>
                    )}
                  </SubmitButton>
                </motion.div>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/user/login")}
                    className="p-0 text-warning fw-medium"
                  >
                    Log in
                  </Button>
                </p>
              </div>

              <div className="text-center mt-3">
                <p className="small text-muted">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </SignUpCard>
          </motion.div>
        </Col>

        <Col lg={6} className="d-none d-lg-flex align-items-center justify-content-center bg-warning bg-opacity-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Illustration
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/hn0jwlxetvu0rf2tskkt.png"
              alt="Signup Illustration"
              className="img-fluid"
            />
          </motion.div>
        </Col>
      </Row>

      {showSuccess && (
        <SuccessModal>
          <SuccessContent>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#28a745"/>
              </svg>
              <h4 className="fw-bold mb-3">Account Created Successfully!</h4>
              <p className="mb-4">You'll be redirected to login page shortly.</p>
              <Spinner animation="border" variant="success" />
            </motion.div>
          </SuccessContent>
        </SuccessModal>
      )}
    </SignUpContainer>
  );
}

export default SignUpPage;