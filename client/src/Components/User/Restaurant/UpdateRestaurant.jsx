import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Spinner, Image, Card, Badge, Row, Col } from "react-bootstrap";
import { FiEdit2, FiSave, FiUpload, FiClock, FiStar, FiPhone, FiMail, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "../../../Axios/axiosInstance.js";
import styled from "styled-components";

// Styled Components
const UpdateContainer = styled(Container)`
  max-width: 800px;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #f39c12, #e74c3c);
    border-radius: 2px;
    margin: 1rem auto 0;
  }
`;

const FormInput = styled(Form.Control)`
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #f39c12;
    box-shadow: 0 0 0 0.25rem rgba(243, 156, 18, 0.15);
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f39c12, #e74c3c);
  border: none;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(243, 156, 18, 0.25);
  }
  
  &:disabled {
    background: #bdc3c7;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #f39c12;
  }
`;

const ImagePreview = styled(Image)`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
`;

function UpdateRestaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "",
    image: null,
    isOpen: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState({
    fetch: true,
    submit: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/profile");
        const { name, email, phone, rating, image, isOpen } = response.data.restaurant;

        setRestaurant(response.data.restaurant);
        setFormData({
          name: name || "",
          email: email || "",
          phone: phone || "",
          rating: rating || "",
          isOpen: isOpen ?? true,
          image: null,
        });
        setImagePreview(image || "");
      } catch (err) {
        setError("Failed to load restaurant details. Please try again.");
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchRestaurantProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "isOpen" ? value === "true" : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(prev => ({ ...prev, submit: true }));

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("email", formData.email);
    updateData.append("phone", formData.phone);
    updateData.append("rating", formData.rating);
    updateData.append("isOpen", formData.isOpen);
    if (formData.image) {
      updateData.append("image", formData.image);
    }

    try {
      const response = await axiosInstance.put("/restaurant/update", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Restaurant details updated successfully!");
      setRestaurant(response.data.updatedRestaurant);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update restaurant. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (loading.fetch) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error && !restaurant) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <UpdateContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormHeader>
          <FormTitle>Update Restaurant</FormTitle>
          <p className="text-muted">Edit your restaurant details</p>
        </FormHeader>

        {success && (
          <Alert variant="success" className="d-flex align-items-center gap-2">
            <FiCheckCircle size={20} />
            {success}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center gap-2">
            <FiAlertTriangle size={20} />
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  <FiEdit2 /> Restaurant Name
                </Form.Label>
                <FormInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  <FiMail /> Email
                </Form.Label>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  <FiPhone /> Phone
                </Form.Label>
                <FormInput
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  <FiStar /> Rating
                </Form.Label>
                <FormInput
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Enter rating (1-5)"
                  required
                />
              </Form.Group>
            </Col> */}
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  <FiClock /> Status
                </Form.Label>
                <Form.Select 
                  name="isOpen" 
                  value={formData.isOpen} 
                  onChange={handleChange}
                  className="py-3"
                >
                  <option value={true}>Open</option>
                  <option value={false}>Closed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Restaurant Image</Form.Label>
                <ImageUploadArea>
                  {imagePreview ? (
                    <>
                      <ImagePreview src={imagePreview} />
                      <small className="text-muted mt-2">Click to change image</small>
                    </>
                  ) : (
                    <>
                      <FiUpload size={32} className="mb-2 text-muted" />
                      <p className="mb-1">Upload Restaurant Image</p>
                      <small className="text-muted">Max 5MB</small>
                    </>
                  )}
                  <FileInput 
                    type="file" 
                    onChange={handleImageChange} 
                    accept="image/*"
                  />
                </ImageUploadArea>
              </Form.Group>
            </Col>
          </Row>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SubmitButton
              type="submit"
              disabled={loading.submit}
            >
              {loading.submit ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave /> Update Restaurant
                </>
              )}
            </SubmitButton>
          </motion.div>
        </Form>
      </motion.div>
    </UpdateContainer>
  );
}

export default UpdateRestaurant;
