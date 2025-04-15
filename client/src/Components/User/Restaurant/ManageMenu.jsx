import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form, Image, Modal, Spinner, Alert, Badge,Row,Col } from "react-bootstrap";
import { FiEdit, FiSave, FiX, FiUpload, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "../../../Axios/axiosInstance.js";
import styled from "styled-components";

// Styled Components
const MenuContainer = styled(Container)`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MenuTable = styled(Table)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  thead th {
    background-color: #343a40;
    color: white;
    border-bottom: none;
  }
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
`;

const ActionButton = styled(Button)`
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MenuImage = styled(Image)`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const EditForm = styled(Form)`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

function ManageMenu() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState({
    fetch: true,
    update: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        const res = await axiosInstance.get("/restaurant/profile");
        const restaurant = res.data.restaurant;
        setRestaurantId(restaurant._id);
        setMenuItems(restaurant.menu || []);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load menu items. Please try again.");
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    fetchRestaurantData();
  }, []);

  const handleEditClick = (item) => {
    setEditingItemId(editingItemId === item._id ? null : item._id); 
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || "",
      image: item.image
    });
    setImagePreview(item.image);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e, menuItemId) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, update: true }));
    
    const updatedFormData = new FormData();
    updatedFormData.append("name", formData.name);
    updatedFormData.append("description", formData.description);
    updatedFormData.append("price", formData.price);
    updatedFormData.append("category", formData.category);
    if (formData.image instanceof File) {
      updatedFormData.append("image", formData.image);
    }

    try {
      await axiosInstance.put(
        `/menu/update/${restaurantId}/menu/${menuItemId}`,
        updatedFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      const res = await axiosInstance.get("/restaurant/profile");
      setMenuItems(res.data.restaurant.menu);
      setEditingItemId(null);
      setSuccess("Menu item updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating menu:", err);
      setError("Failed to update menu item. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  if (loading.fetch) {
    return (
      <MenuContainer className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </MenuContainer>
    );
  }

  return (
    <MenuContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Menu</h2>
        </div>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible className="mb-4">
            {success}
          </Alert>
        )}

        {menuItems.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">No menu items found</h4>
            <Button variant="primary">Add Your First Menu Item</Button>
          </div>
        ) : (
          <MenuTable striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <React.Fragment key={item._id}>
                  <motion.tr 
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <td>
                      <MenuImage src={item.image} thumbnail />
                    </td>
                    <td className="align-middle">{item.name}</td>
                    <td className="align-middle">
                      <small className="text-muted">{item.description}</small>
                    </td>
                    <td className="align-middle fw-bold">₹{item.price}</td>
                    <td className="align-middle">
                      <Badge bg="secondary">{item.category || "Uncategorized"}</Badge>
                    </td>
                    <td className="align-middle">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <ActionButton 
                          variant={editingItemId === item._id ? "secondary" : "warning"}
                          onClick={() => handleEditClick(item)}
                          size="sm"
                        >
                          {editingItemId === item._id ? (
                            <>
                              <FiX /> Cancel
                            </>
                          ) : (
                            <>
                              <FiEdit /> Edit
                            </>
                          )}
                        </ActionButton>
                      </motion.div>
                    </td>
                  </motion.tr>
                  {editingItemId === item._id && (
                    <tr>
                      <td colSpan="6" className="p-0">
                        <EditForm onSubmit={(e) => handleUpdate(e, item._id)} className="p-4">
                          <h5 className="mb-4">Edit Menu Item</h5>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Price (₹)</Form.Label>
                                <Form.Control
                                  type="number"
                                  name="price"
                                  value={formData.price}
                                  onChange={handleChange}
                                  min="1"
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="category"
                                  value={formData.category}
                                  onChange={handleChange}
                                  placeholder="e.g. Appetizers, Main Course"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Update Image</Form.Label>
                                <Form.Control 
                                  type="file" 
                                  onChange={handleImageChange} 
                                  accept="image/*"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          {imagePreview && (
                            <div className="mb-3 text-center">
                              <Image 
                                src={imagePreview} 
                                width={150} 
                                height={150} 
                                rounded 
                                className="border"
                              />
                            </div>
                          )}
                          
                          <div className="d-flex gap-2">
                            <motion.div whileHover={{ scale: 1.03 }}>
                              <Button 
                                variant="primary" 
                                type="submit"
                                disabled={loading.update}
                                className="d-flex align-items-center gap-2"
                              >
                                {loading.update ? (
                                  <>
                                    <Spinner animation="border" size="sm" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <FiSave /> Save Changes
                                  </>
                                )}
                              </Button>
                            </motion.div>
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setEditingItemId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </EditForm>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </MenuTable>
        )}
      </motion.div>
    </MenuContainer>
  );
}

export default ManageMenu;