import React, { useEffect, useState } from "react";
import { Table, Button, Container, Image, Modal } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

function DeleteMenu() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const res = await axiosInstance.get("/restaurant/profile");
        const restaurant = res.data.restaurant;
        setRestaurantId(restaurant._id);
        setMenuItems(restaurant.menu);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
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
      await axiosInstance.delete(`/menu/${restaurantId}/delete/${selectedItem._id}`);
      
      // Update UI by removing deleted item
      setMenuItems(menuItems.filter((item) => item._id !== selectedItem._id));
      
      setShowConfirm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Manage Menu</h2>

      <Table striped bordered hover responsive className="mt-3">
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
            <tr key={item._id}>
              <td>
                <Image src={item.image} width="80" height="80" rounded />
              </td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>₹{item.price}</td>
              <td>{item.category}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteClick(item)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DeleteMenu;
