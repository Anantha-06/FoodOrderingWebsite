import React, { useEffect, useState } from "react";
import { Button, Card, Table, Toast, ToastContainer, Row, Col } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/User/Loading.jsx";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components
const PaymentContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const OrderTable = styled(Table)`
  thead th {
    background-color: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
  }

  tbody tr:hover {
    background-color: rgba(248, 249, 250, 0.7);
  }

  img {
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 12px;
  font-weight: 500;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PriceHighlight = styled.div`
  background: linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
`;

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const response = await axiosInstance.get("/order/get/all");
        if (response.data.orders.length > 0) {
          const latestOrder = response.data.orders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          setOrder(latestOrder);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        showToast("Failed to fetch order data", "error");
      }
    };

    fetchLatestOrder();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };

  const handlePayment = async () => {
    if (!order) return;

    if (typeof window.Razorpay === "undefined") {
      showToast("Razorpay SDK not loaded. Please try again later.", "error");
      return;
    }

    try {
      setShowLoader(true);
      const { data } = await axiosInstance.post(`/payment/create/${order._id}`);

      if (!data || !data.razorpayOrder) {
        showToast("Failed to initiate payment", "error");
        setShowLoader(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: order.restaurant.name,
        description: `Order #${order._id}`,
        image: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast(verifyResponse.data.message, "success");
            setTimeout(() => {
              navigate("/user/orders");
            }, 4000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            showToast("Payment verification failed!", "error");
          } finally {
            setShowLoader(false);
          }
        },
        prefill: {
          name: order.user.name,
          email: order.user.email,
          contact: order.user.phone,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: () => {
            setShowLoader(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      showToast("Error initiating payment. Please try again.", "error");
      setShowLoader(false);
    }
  };

  if (showLoader) {
    return <Loading />;
  }

  return (
    <PaymentContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {order ? (
          <StyledCard>
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <Card.Title className="display-5 fw-bold mb-3">Order Summary</Card.Title>
                <div className="d-flex justify-content-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">Order Details</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Restaurant:</strong> {order.restaurant.name}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress?.city || "Not specified"}</p>
                  </Col>
                </Row>
              </div>

              <OrderTable responsive>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}></th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartId.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img 
                          src={item.foodImage} 
                          alt={item.foodName} 
                          width="60" 
                          height="60" 
                          className="rounded-3"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60";
                          }}
                        />
                      </td>
                      <td className="align-middle">{item.foodName}</td>
                      <td className="align-middle">{item.quantity}</td>
                      <td className="align-middle">₹{item.totalItemPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </OrderTable>

              <PriceHighlight>
                <Row className="text-center text-md-start">
                  <Col md={6}>
                    <h5 className="fw-bold">Subtotal: ₹{order.totalAmount}</h5>
                    {order.discount > 0 && (
                      <p className="text-success">Discount: -₹{order.discount}</p>
                    )}
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    <h4 className="fw-bold">Total: ₹{order.finalPrice}</h4>
                  </Col>
                </Row>
              </PriceHighlight>

              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton 
                    variant="outline-secondary" 
                    onClick={() => navigate("/user/checkout")}
                  >
                    Back to Checkout
                  </ActionButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ActionButton 
                    variant="warning" 
                    onClick={handlePayment} 
                    disabled={showLoader}
                    className="px-5"
                  >
                    {showLoader ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing Payment
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </ActionButton>
                </motion.div>
              </div>
            </Card.Body>
          </StyledCard>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        )}

        {/* Toast Notification */}
        <ToastContainer position="top-center" className="mt-4">
          <Toast 
            show={toast.show} 
            bg={toast.type === "error" ? "danger" : "success"} 
            onClose={() => setToast({ ...toast, show: false })}
            delay={5000}
            autohide
          >
            <Toast.Body className="d-flex align-items-center justify-content-between text-white fw-bold">
              <span>{toast.message}</span>
              <button 
                type="button" 
                className="btn-close btn-close-white ms-3" 
                onClick={() => setToast({ ...toast, show: false })}
                aria-label="Close"
              />
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </motion.div>
    </PaymentContainer>
  );
};

export default PaymentPage;