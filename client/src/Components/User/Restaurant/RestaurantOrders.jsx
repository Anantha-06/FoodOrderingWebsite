import React, { useEffect, useState } from "react";
import { Table, Container, Image, Badge, Form, Spinner, Alert, Card,Row,Col } from "react-bootstrap";
import { motion } from "framer-motion";
import styled from "styled-components";
import axiosInstance from "../../../Axios/axiosInstance.js";
import { FaSearch, FaClock, FaCheckCircle, FaMotorcycle, FaBoxOpen, FaTimesCircle } from "react-icons/fa";

// Styled Components
const OrdersContainer = styled(Container)`
  padding: 2rem;
  max-width: 1400px;
`;

const StatusBadge = styled(Badge)`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
`;

const OrderTable = styled(Table)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  thead th {
    background-color: #2c3e50;
    color: white;
    border-bottom: none;
  }
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(248, 249, 250, 0.7);
    }
  }
`;

const StatusSelect = styled(Form.Select)`
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #f39c12;
    box-shadow: 0 0 0 0.25rem rgba(243, 156, 18, 0.25);
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ORDER_STATUS = [
  { value: "pending", label: "Pending", icon: <FaClock className="me-2" />, color: "warning" },
  { value: "confirmed", label: "Confirmed", icon: <FaCheckCircle className="me-2" />, color: "primary" },
  { value: "preparing", label: "Preparing", icon: <FaClock className="me-2" />, color: "info" },
  { value: "out for delivery", label: "Out for Delivery", icon: <FaMotorcycle className="me-2" />, color: "secondary" },
  { value: "delivered", label: "Delivered", icon: <FaBoxOpen className="me-2" />, color: "success" },
  { value: "cancelled", label: "Cancelled", icon: <FaTimesCircle className="me-2" />, color: "danger" },
];

function RestaurantOrders() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/restaurant/profile");
      const restaurant = res.data.restaurant;
      setRestaurantId(restaurant._id);
      await fetchOrders(restaurant._id);
    } catch (err) {
      console.error("Error fetching restaurant data:", err);
      setError("Failed to load restaurant data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (id) => {
    try {
      const res = await axiosInstance.get(`/order/restaurant-order/${id}`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/order/update/status/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err.response ? err.response.data : err.message);
      setError("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchTermLower) ||
      (order.user?.name?.toLowerCase().includes(searchTermLower)) ||
      (order.user?.email?.toLowerCase().includes(searchTermLower)) ||
      (order.status.toLowerCase().includes(searchTermLower))
    );
  });

  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : "secondary";
  };

  const getStatusIcon = (status) => {
    const statusObj = ORDER_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.icon : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <OrdersContainer>
        <h2 className="text-center mb-4">Manage Orders</h2>

        {loading && !orders.length ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading orders...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <>
            <Card className="mb-4 p-3 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                
                <div className="d-flex gap-2">
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    Total Orders: {orders.length}
                  </Badge>
                  <Badge bg="success" text="white" className="px-3 py-2">
                    Delivered: {orders.filter(o => o.status === "delivered").length}
                  </Badge>
                </div>
              </div>
            </Card>

            <OrderTable striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>
                        <small className="text-muted">#{order._id.slice(-8)}</small>
                      </td>
                      <td>
                        <strong>{order.user?.name || "Guest"}</strong>
                        <br />
                        <small className="text-muted">{order.user?.email}</small>
                        <br />
                        <small>{order.user?.phone}</small>
                      </td>
                      <td>
                        {order.cartId?.items?.length ? (
                          order.cartId.items.map((item) => (
                            <OrderItem key={item.foodId}>
                              <Image 
                                src={item.foodImage} 
                                width="50" 
                                height="50" 
                                rounded 
                                className="me-3"
                                style={{ objectFit: "cover" }}
                              />
                              <div>
                                <div>{item.foodName}</div>
                                <small className="text-muted">
                                  ₹{item.totalItemPrice} × {item.quantity}
                                </small>
                              </div>
                            </OrderItem>
                          ))
                        ) : (
                          <small className="text-muted">No items found</small>
                        )}
                      </td>
                      <td className="fw-bold">₹{order.finalPrice}</td>
                      <td>
                        {order.deliveryAddress ? (
                          <>
                            <div>{order.deliveryAddress.houseName}</div>
                            <div>{order.deliveryAddress.city}</div>
                            <small className="text-muted">
                              {order.deliveryAddress.pincode}
                            </small>
                          </>
                        ) : (
                          <small className="text-muted">No address</small>
                        )}
                      </td>
                      <td>
                        <StatusBadge bg={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </StatusBadge>
                      </td>
                      <td>
                        <StatusSelect
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={loading}
                        >
                          {ORDER_STATUS.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </StatusSelect>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {searchTerm ? (
                        <div>
                          <FaSearch className="display-4 text-muted mb-3" />
                          <h5>No orders match your search</h5>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => setSearchTerm("")}
                          >
                            Clear search
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <FaBoxOpen className="display-4 text-muted mb-3" />
                          <h5>No orders found</h5>
                          <p className="text-muted">New orders will appear here</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </OrderTable>
          </>
        )}
      </OrdersContainer>
    </motion.div>
  );
}

export default RestaurantOrders;