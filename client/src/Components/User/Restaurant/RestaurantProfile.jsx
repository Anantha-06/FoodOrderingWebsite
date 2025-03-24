import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert, Image } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/profile");
        setRestaurant(response.data.restaurant);
      } catch (err) {
        setError("Failed to fetch restaurant profile");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, []);

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

  if (!restaurant) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">No restaurant data available</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center">{restaurant.name}</h2>
      <Table striped bordered hover responsive className="mt-3">
        <tbody>
          <tr>
            <td>📧 Email</td>
            <td>{restaurant.email}</td>
          </tr>
          <tr>
            <td>📞 Phone</td>
            <td>{restaurant.phone}</td>
          </tr>
          <tr>
            <td>📬 Contact Email</td>
            <td>{restaurant.contactEmail}</td>
          </tr>
          <tr>
            <td>⭐ Rating</td>
            <td>{restaurant.rating}</td>
          </tr>
          <tr>
            <td>🕒 Status</td>
            <td>{restaurant.isOpen ? "Open" : "Closed"}</td>
          </tr>
        </tbody>
      </Table>
      {restaurant.image && (
        <div className="text-center my-4">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            width="150"
            height="150"
            rounded
          />
        </div>
      )}

      <h3 className="mt-4">📜 Menu</h3>
      <Table striped bordered hover responsive className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Item</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {restaurant.menu?.map((item) => (
            <tr key={item._id}>
              <td>
                <Image
                  src={item.image}
                  alt={item.name}
                  width="50"
                  height="50"
                  rounded
                />
              </td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default RestaurantProfile;
