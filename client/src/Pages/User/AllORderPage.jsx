import React, { useEffect, useState } from "react";
import { Table, Container, Button, Accordion, Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import useFetch from "../../Hooks/UseFetch.jsx";
import axiosInstance from "../../Axios/axiosInstance.js";
import "../../App.css";
import Loading from "../../Components/User/Loading.jsx";

function AllOrderPage() {
  const [data, isLoading, error] = useFetch("/order/get/all");
  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (data?.orders) {
      setOrders(data.orders);
    }
  }, [data]);

  const handleCancelOrder = async (order) => {
    try {
      setUpdatingOrderId(order._id);

      const payload = {
        status: "cancelled",
        ...(order.deliveryAddress?._id && { deliveryAddress: order.deliveryAddress._id }),
        ...(order.coupon?.code && { coupon: order.coupon.code }),
      };

      console.log("Sending cancel payload:", payload);

      await axiosInstance.put(`/order/update/${order._id}`, payload);

      const updatedOrders = orders.map((o) =>
        o._id === order._id ? { ...o, status: "cancelled" } : o
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("Failed to cancel order:", err.response?.data || err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleAccordion = (orderId) => {
    setActiveKey(activeKey === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      confirmed: "success",
      pending: "warning",
      cancelled: "danger",
      "out for delivery": "info",
    };
    return (
      <Badge bg={statusMap[status] || "secondary"} className="text-capitalize">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
     <Loading/>
    );
  }

  if (error) {
    return <p className="text-danger text-center mt-5">No Order Found or {error.message}</p>;
  }

  return (
    <Container className="py-4">
      <motion.h2
        className="text-center fw-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🛍️ Your Recent Orders
      </motion.h2>

      <Accordion activeKey={activeKey}>
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-sm mb-3 border-0 rounded-4 order-card">
              <Accordion.Item eventKey={order._id}>
                <Accordion.Header onClick={() => toggleAccordion(order._id)}>
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between">
                      <span><strong>Order ID:</strong> {order._id}</span>
                      <span><strong>Status:</strong> {getStatusBadge(order.status)}</span>
                    </div>
                    <small className="text-muted">Order Date: {new Date(order.createdAt).toLocaleString()}</small>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h5 className="fw-semibold">🏪 Restaurant</h5>
                      <p><strong>Name:</strong> {order.restaurant.name}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h5 className="fw-semibold">🚚 Delivery Address</h5>
                      <p><strong>City:</strong> {order.deliveryAddress.city}</p>
                      <p><strong>State:</strong> {order.deliveryAddress.state}</p>
                    </div>
                  </div>

                  <h5 className="fw-semibold mt-4">🍽️ Ordered Items</h5>
                  <Table striped bordered responsive className="align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>Item</th>
                        <th>Image</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.cartId.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.foodName}</td>
                          <td>
                            <img
                              src={item.foodImage}
                              alt={item.foodName}
                              className="rounded"
                              style={{ width: 50, height: 50, objectFit: "cover" }}
                            />
                          </td>
                          <td>{item.quantity}</td>
                          <td>₹{(item.totalItemPrice / item.quantity).toFixed(2)}</td>
                          <td>₹{item.totalItemPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-between align-items-start mt-4 flex-wrap">
                    <div>
                      <h5 className="fw-semibold">💰 Pricing</h5>
                      <p><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                      {order.coupon && (
                        <p>
                          <strong>Coupon:</strong> {order.coupon.code} ({order.coupon.discountPercentage}% OFF)
                        </p>
                      )}
                      <p className="text-success fw-bold">
                        Final Price: ₹{order.finalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Button
                          variant="outline-danger"
                          disabled={order.status === "cancelled" || updatingOrderId === order._id}
                          onClick={() => handleCancelOrder(order)}
                          className="rounded-pill px-4"
                        >
                          {updatingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          </motion.div>
        ))}
      </Accordion>
    </Container>
  );
}

export default AllOrderPage;
