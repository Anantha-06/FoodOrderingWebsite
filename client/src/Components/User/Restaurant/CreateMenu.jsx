import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Image } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

function CreateMenu() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/profile");
        setRestaurantId(response.data.restaurant._id);
      } catch (err) {
        console.error("Error fetching restaurant profile:", err);
        setError("Failed to fetch restaurant details.");
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
      setMenuData({ ...menuData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!restaurantId) {
      setError("Restaurant ID not found. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("description", menuData.description);
    formData.append("price", menuData.price);
    if (menuData.image) {
      formData.append("image", menuData.image);
    }

    try {
      const response = await axiosInstance.post(`/menu/create/${restaurantId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Menu item added successfully!");
      setMenuData({ name: "", description: "", price: "", image: null });
      setImagePreview("");
    } catch (err) {
      setError("Failed to add menu item.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Add Menu Item</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={menuData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={menuData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price (₹)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={menuData.price}
            onChange={handleChange}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-3">
              <Image src={imagePreview} width="150" height="150" rounded />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={!restaurantId}>
          {restaurantId ? "Add Menu Item" : "Loading..."}
        </Button>
      </Form>
    </Container>
  );
}

export default CreateMenu;
