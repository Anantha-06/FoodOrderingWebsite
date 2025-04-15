import React, { useEffect, useState } from "react";
import { Table, Button, Container, Image, Modal, Spinner, Alert, Card, Badge } from "react-bootstrap";
import { FiTrash2, FiEdit, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "../../../Axios/axiosInstance.js";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
      transform: translateY(-2px);
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

const ConfirmModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
`;

function DeleteMenu() {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState({
    fetch: true,
    delete: false
  });
  const [error, setError] = useState(null);

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

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem || !restaurantId) return;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      await axiosInstance.delete(`/menu/${restaurantId}/delete/${selectedItem._id}`);
      setMenuItems(menuItems.filter((item) => item._id !== selectedItem._id));
      setShowConfirm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError("Failed to delete menu item. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
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
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Manage Menu</h2>
           
            </div>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
            <FiAlertTriangle className="me-2" /> {error}
          </Alert>
        )}

        {menuItems.length === 0 ? (
          <Card className="text-center p-5 border-0 shadow-sm">
            <h4 className="text-muted">No menu items found</h4>
            <p>Add your first menu item to get started</p>
            <Button variant="primary" onClick={() => navigate("/restaurant/menu/add")}>
              Add Menu Item
            </Button>
          </Card>
        ) : (
          <MenuTable striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <motion.tr 
                  key={item._id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <td>
                    <MenuImage src={item.image} thumbnail />
                  </td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.description}</td>
                  <td className="align-middle">₹{item.price}</td>
                  <td className="align-middle">
                    <Badge bg="secondary">{item.category}</Badge>
                  </td>
                  <td className="align-middle">
                    <div className="d-flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }}>
                       
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <ActionButton 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <FiTrash2 /> Delete
                        </ActionButton>
                      </motion.div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </MenuTable>
        )}

        <ConfirmModal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex align-items-center gap-2">
              <FiAlertTriangle size={24} className="text-danger" />
              Confirm Delete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete <strong>"{selectedItem?.name}"</strong>?
              This action cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleConfirmDelete}
              disabled={loading.delete}
            >
              {loading.delete ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </Modal.Footer>
        </ConfirmModal>
      </motion.div>
    </MenuContainer>
  );
}

export default DeleteMenu;