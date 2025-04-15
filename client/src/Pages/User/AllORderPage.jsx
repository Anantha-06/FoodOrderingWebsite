import React, { useEffect, useState } from "react";
import { Table, Container, Button, Accordion, Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import useFetch from "../../Hooks/UseFetch.jsx";
import axiosInstance from "../../Axios/axiosInstance.js";
import { FiShoppingBag, FiTruck, FiHome, FiDollarSign, FiXCircle } from "react-icons/fi";
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
      confirmed: { bg: "success", icon: "✓" },
      pending: { bg: "warning", icon: "⏳" },
      cancelled: { bg: "danger", icon: "✕" },
      "out for delivery": { bg: "info", icon: "🚚" },
    };
    
    const statusConfig = statusMap[status] || { bg: "secondary", icon: "" };
    
    return (
      <Badge 
        bg={statusConfig.bg} 
        className="text-capitalize d-flex align-items-center gap-1"
        pill
      >
        <span>{statusConfig.icon}</span>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FiXCircle size={48} className="text-danger mb-3" />
        <h5 className="text-center text-muted">No orders found</h5>
        <p className="text-danger text-center">{error.message}</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FiShoppingBag size={48} className="text-muted mb-3" />
        <h5 className="text-center text-muted">No orders yet</h5>
        <p className="text-center">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <Container className="py-4 px-3 px-md-4">
      <motion.div
        className="d-flex flex-column align-items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex align-items-center gap-3 mb-2">
          <FiShoppingBag size={32} className="text-primary" />
          <h2 className="fw-bold mb-0">Your Recent Orders</h2>
        </div>
        <p className="text-muted text-center">Track and manage your food orders</p>
      </motion.div>

      <Accordion activeKey={activeKey} className="orders-accordion">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-3"
          >
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
              <Accordion.Item eventKey={order._id} className="border-0">
                <Accordion.Header 
                  onClick={() => toggleAccordion(order._id)}
                  className="p-0"
                >
                  <Card.Header className="w-100 bg-white">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center w-100 gap-2">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold">#{order._id.slice(-6)}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <small className="text-muted">
                          Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                      <div className="d-flex flex-column text-md-end">
                        <span className="fw-semibold">₹{order.finalPrice.toFixed(2)}</span>
                        <small className="text-muted">{order.cartId.items.length} item(s)</small>
                      </div>
                    </div>
                  </Card.Header>
                </Accordion.Header>
                <Accordion.Body className="p-0">
                  <Card.Body>
                    <div className="row gy-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <FiHome size={20} className="text-primary" />
                          <h5 className="mb-0 fw-semibold">Restaurant Details</h5>
                        </div>
                        <div className="ps-4">
                          <p className="mb-1">
                            <span className="fw-medium">Name:</span> {order.restaurant.name}
                          </p>
                          <p className="mb-1">
                            <span className="fw-medium">Location:</span> {order.restaurant.city}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <FiTruck size={20} className="text-primary" />
                          <h5 className="mb-0 fw-semibold">Delivery Address</h5>
                        </div>
                        <div className="ps-4">
                          <p className="mb-1">{order.deliveryAddress.street}</p>
                          <p className="mb-1">
                            {order.deliveryAddress.city}, {order.deliveryAddress.state}
                          </p>
                          <p className="mb-1">Pincode: {order.deliveryAddress.pincode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="fw-semibold mb-3">Order Items</h5>
                      <div className="table-responsive">
                        <Table borderless className="order-items-table">
                          <thead>
                            <tr className="border-bottom">
                              <th className="text-start ps-0">Item</th>
                              <th className="text-center">Image</th>
                              <th className="text-center">Qty</th>
                              <th className="text-end pe-0">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.cartId.items.map((item, index) => (
                              <tr key={index} className="border-bottom">
                                <td className="text-start ps-0">
                                  <div className="d-flex flex-column">
                                    <span className="fw-medium">{item.foodName}</span>
                                    <small className="text-muted">₹{(item.totalItemPrice / item.quantity).toFixed(2)} each</small>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center">
                                    <img
                                      src={item.foodImage}
                                      alt={item.foodName}
                                      className="rounded"
                                      style={{ 
                                        width: 50, 
                                        height: 50, 
                                        objectFit: "cover" 
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end pe-0 fw-medium">
                                  ₹{item.totalItemPrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <FiDollarSign size={20} className="text-primary" />
                          <h5 className="mb-0 fw-semibold">Order Summary</h5>
                        </div>
                        <div className="ps-4">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Subtotal:</span>
                            <span>₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                          {order.coupon && (
                            <div className="d-flex justify-content-between mb-1 text-success">
                              <span>Coupon Discount ({order.coupon.discountPercentage}%):</span>
                              <span>-₹{(order.totalAmount - order.finalPrice).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between mt-2 pt-2 border-top fw-bold">
                            <span>Total:</span>
                            <span>₹{order.finalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex align-items-end justify-content-end mt-3 mt-md-0">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Button
                            variant={order.status === "cancelled" ? "outline-secondary" : "outline-danger"}
                            disabled={order.status === "cancelled" || updatingOrderId === order._id}
                            onClick={() => handleCancelOrder(order)}
                            className="rounded-pill px-4 d-flex align-items-center gap-2"
                          >
                            {updatingOrderId === order._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <FiXCircle size={18} />
                                {order.status === "cancelled" ? "Order Cancelled" : "Cancel Order"}
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card.Body>
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