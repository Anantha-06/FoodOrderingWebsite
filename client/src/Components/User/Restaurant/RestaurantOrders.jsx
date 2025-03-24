import React, { useEffect, useState } from "react";
import { Table, Button, Container, Image, Badge, Form } from "react-bootstrap";
import axiosInstance from "../../../Axios/axiosInstance.js";

const ORDER_STATUS = [
  "pending",
  "confirmed",
  "preparing",
  "out for delivery",
  "delivered",
  "cancelled",
];

function RestaurantOrders() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const res = await axiosInstance.get("/restaurant/profile");
      const restaurant = res.data.restaurant;
      setRestaurantId(restaurant._id);
      fetchOrders(restaurant._id);
    } catch (err) {
      console.error("Error fetching restaurant data:", err);
    }
  };

  const fetchOrders = async (id) => {
    try {
      const res = await axiosInstance.get(`/order/restaurant-order/${id}`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/order/update/status/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Restaurant Orders</h2>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total Price (₹)</th>
            <th>Delivery Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  <strong>{order.user.name}</strong> <br />
                  <small>{order.user.email}</small> <br />
                  <small>{order.user.phone}</small>
                </td>
                <td>
                  {order.cartId.items.map((item) => (
                    <div key={item.foodId} className="d-flex align-items-center mb-2">
                      <Image src={item.foodImage} width="50" height="50" rounded />
                      <span className="ms-2">{item.foodName} x {item.quantity}</span>
                    </div>
                  ))}
                </td>
                <td>₹{order.finalPrice}</td>
                <td>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </td>
                <td>
                  <Badge bg={order.status === "pending" ? "warning" : order.status === "delivered" ? "success" : "primary"}>
                    {order.status}
                  </Badge>
                </td>
                <td>
                  <Form.Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {ORDER_STATUS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default RestaurantOrders;
