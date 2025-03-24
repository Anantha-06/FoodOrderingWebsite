import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert, Spinner, Image } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

function UpdateRestaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/profile");
        setRestaurant(response.data.restaurant);
        setFormData({
          name: response.data.restaurant.name || "",
          email: response.data.restaurant.email || "",
          phone: response.data.restaurant.phone || "",
          rating: response.data.restaurant.rating || "",
        });
        setImagePreview(response.data.restaurant.image || "");
      } catch (err) {
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("email", formData.email);
    updateData.append("phone", formData.phone);
    updateData.append("rating", formData.rating);
    if (formData.image) {
      updateData.append("image", formData.image);
    }

    try {
      const response = await axiosInstance.put("/restaurant/update", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Restaurant updated successfully!");
      setRestaurant(response.data.updatedRestaurant);
    } catch (err) {
      setError("Failed to update restaurant.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center">Update Restaurant</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Restaurant Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Restaurant Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-3">
              <Image src={imagePreview} width="150" height="150" rounded />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Update Restaurant
        </Button>
      </Form>
    </Container>
  );
}

export default UpdateRestaurant;
