import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form, Image } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

function ManageMenu() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");

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

  const handleEditClick = (item) => {
    setEditingItemId(editingItemId === item._id ? null : item._id); // Toggle form
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || "",
      image: item.image,
    });
    setImagePreview(item.image);
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
    const updatedFormData = new FormData();
    updatedFormData.append("name", formData.name);
    updatedFormData.append("description", formData.description);
    updatedFormData.append("price", formData.price);
    updatedFormData.append("category", formData.category);
    if (formData.image instanceof File) {
      updatedFormData.append("image", formData.image);
    }

    try {
      await axiosInstance.put(`/menu/update/${restaurantId}/menu/${menuItemId}`, updatedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await axiosInstance.get("/restaurant/profile");
      setMenuItems(res.data.restaurant.menu);
      setEditingItemId(null);
    } catch (err) {
      console.error("Error updating menu:", err);
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
            <React.Fragment key={item._id}>
              <tr>
                <td>
                  <Image src={item.image} width="80" height="80" rounded />
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>₹{item.price}</td>
                <td>{item.category}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClick(item)}>
                    {editingItemId === item._id ? "Cancel" : "Update"}
                  </Button>
                </td>
              </tr>
              {editingItemId === item._id && (
                <tr>
                  <td colSpan="6">
                    <Form onSubmit={(e) => handleUpdate(e, item._id)} className="mt-3">
                      <Form.Group className="mb-2">
                        <Form.Label>Item Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
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

                      <Form.Group className="mb-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                        {imagePreview && (
                          <div className="mt-2">
                            <Image src={imagePreview} width="100" height="100" rounded />
                          </div>
                        )}
                      </Form.Group>

                      <Button variant="success" type="submit" className="me-2">
                        Save Changes
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingItemId(null)}>
                        Cancel
                      </Button>
                    </Form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ManageMenu;
