import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Image, Spinner ,Row, Col} from "react-bootstrap";
import { motion } from "framer-motion";
import styled from "styled-components";
import axiosInstance from "../../../Axios/axiosInstance.js";

// Styled Components
const FormContainer = styled(Container)`
  max-width: 600px;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const FormTitle = styled.h2`
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #f39c12, #e74c3c);
    border-radius: 2px;
  }
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

const ImagePreviewContainer = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #f39c12;
  }
`;

function CreateMenu() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/profile");
        setRestaurantId(response.data.restaurant._id);
      } catch (err) {
        console.error("Error fetching restaurant profile:", err);
        setError("Failed to fetch restaurant details. Please try again.");
      }
    };
    fetchRestaurant();
  }, []);

  const handleChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }
      setMenuData({ ...menuData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setIsLoading(true);

    if (!restaurantId) {
      setError("Restaurant ID not found. Please try again.");
      setIsLoading(false);
      return;
    }

    if (!menuData.name || !menuData.description || !menuData.price || !menuData.image) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("description", menuData.description);
    formData.append("price", menuData.price);
    formData.append("category", menuData.category);
    formData.append("image", menuData.image);

    try {
      const response = await axiosInstance.post(
        `/menu/create/${restaurantId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess("Menu item added successfully!");
      setMenuData({
        name: "",
        description: "",
        price: "",
        image: null,
        category: "",
      });
      setImagePreview("");
    } catch (err) {
      console.error("Error creating menu item:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add menu item. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FormContainer className="mt-5 mb-5">
        <FormTitle>Add New Menu Item</FormTitle>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="success" className="text-center">
              {success}
            </Alert>
          </motion.div>
        )}

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
            <Form.Label>Item Name *</Form.Label>
            <FormInput
              type="text"
              name="name"
              value={menuData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </Form.Group>

          <Form.Group className="d-flex flex-column mb-4">
            <Form.Label>Description *</Form.Label>
            <FormInput
              as="textarea"
              rows={3}
              name="description"
              value={menuData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              required
            />
          </Form.Group>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price (₹) *</Form.Label>
                <FormInput
                  type="number"
                  name="price"
                  value={menuData.price}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter price"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="d-flex flex-column flex-nowrap mb-4">
                <Form.Label>Category *</Form.Label>
                <FormInput
                  as="select"
                  name="category"
                  value={menuData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Specials">Specials</option>
                </FormInput>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Item Image *</Form.Label>
            <FormInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview ? (
              <ImagePreviewContainer>
                <Image
                  src={imagePreview}
                  rounded
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <small className="text-muted mt-2">
                  Image Preview (Click to change)
                </small>
              </ImagePreviewContainer>
            ) : (
              <ImagePreviewContainer>
                <div className="text-center">
                  <p className="text-muted mb-2">
                    No image selected
                  </p>
                  <small className="text-muted">
                    Recommended size: 800x600px
                  </small>
                </div>
              </ImagePreviewContainer>
            )}
          </Form.Group>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SubmitButton
              type="submit"
              className="w-100"
              disabled={!restaurantId || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Adding Item...
                </>
              ) : (
                "Add Menu Item"
              )}
            </SubmitButton>
          </motion.div>
        </Form>
      </FormContainer>
    </motion.div>
  );
}

export default CreateMenu;