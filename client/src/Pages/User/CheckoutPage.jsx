import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";
import styled from "styled-components";
import Cookies from "js-cookie";

// Styled components
const CheckoutContainer = styled(Container)`
  padding: 2rem 1rem;
  max-width: 1400px;
`;

const CheckoutCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const PrimaryButton = styled(Button).attrs({
  variant: "warning"
})`
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    transform: none !important;
  }
`;

const SectionTitle = styled.h2`
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #f39c12, #e74c3c);
    border-radius: 2px;
  }
`;

function CheckoutPage() {
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setError("");

    const token = Cookies.get("authToken"); 
    if (!token) {
      setError("🚨 You must be logged in to place an order.");
      return;
    }

    if (!cartId || !selectedAddressId || !restaurantId) {
      setError("🚨 Please select an address and ensure your cart is not empty.");
      return;
    }

    setLoading(true);
    const requestBody = {
      restaurant: restaurantId,
      cartId: cartId,
      coupon: selectedCoupon || "",
      deliveryAddress: selectedAddressId,
    };

    try {
      const response = await axiosInstance.post("/order/update", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setShowAlert(true);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        navigate("/user/payment", { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAlert, navigate]);

  return (
    <CheckoutContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col xs={12} className="text-center">
            <SectionTitle>Checkout</SectionTitle>
          </Col>
        </Row>
      </motion.div>

      <Row>
        <Col lg={8} md={12} className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckoutCard>
              <h3 className="fw-bold mb-4">Your Cart</h3>
              <CartItemCard
                setCartId={setCartId}
                setRestaurantId={setRestaurantId}
              />
            </CheckoutCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CheckoutCard>
              <h3 className="fw-bold mb-4">Delivery Address</h3>
              <ShowAddress
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
              />
            </CheckoutCard>
          </motion.div>
        </Col>

        <Col lg={4} md={12}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CheckoutCard>
           

              <CouponCard
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />

              <div className="mt-4 pt-3 border-top">
                {error && (
                  <Alert variant="danger" className="text-center mb-3">
                    {error}
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PrimaryButton
                      onClick={handleCheckout}
                      disabled={loading || !restaurantId}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </PrimaryButton>
                  </motion.div>
                </div>

                {!restaurantId && (
                  <p className="text-danger text-center mt-2 small">
                    ⚠️ Please add items to your cart before checkout
                  </p>
                )}
              </div>
            </CheckoutCard>
          </motion.div>
        </Col>
      </Row>

      <Modal show={showAlert} centered backdrop="static">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Modal.Body className="text-center p-5">
            <div className="mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              >
                <span style={{ fontSize: "3rem" }}>🎉</span>
              </motion.div>
            </div>
            <h4 className="fw-bold text-success mb-3">Order Confirmed!</h4>
            <p className="text-muted">Redirecting to payment...</p>
          </Modal.Body>
        </motion.div>
      </Modal>
    </CheckoutContainer>
  );
}

export default CheckoutPage;
