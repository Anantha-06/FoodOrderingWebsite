import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";

function RestaurantSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    password: "",
    contactEmail: ""
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
      const userToken = Cookies.get("authToken");
      const restaurantToken = Cookies.get("restaurantToken");
      const adminToken = Cookies.get("adminauthToken")
    
      if (userToken) {
        navigate("/user/homepage");
      } else if (restaurantToken) {
        navigate("/restaurant/dashboard");
      }else if (adminToken) {
        navigate("/admin/dashboard");
      }
      
    }, [navigate]);
    

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await axiosInstance.post("/restaurant/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/restaurant/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center order-md-1 order-2">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
              <h3 className="text-center text-primary">Restaurant Signup</h3>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Restaurant Name" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="tel" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="file" name="image" onChange={handleFileChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" placeholder="Contact Email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>
         <Col xs={12} md={6} lg={6} className="d-flex justify-content-center align-items-center order-md-2 order-1">
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 1 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.21.07_-_A_minimalistic_portrait_of_a_gourmet_food_item_featuring_a_beautifully_plated_dish_with_vibrant_colors._The_dish_is_elegantly_arranged_on_a_white_pla_cuuzsm.webp" 
                    className="img-fluid loginImage" 
                    alt="Login Illustration" 
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Col>
      </Row>
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 text-success">Signup successful!</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RestaurantSignup;
