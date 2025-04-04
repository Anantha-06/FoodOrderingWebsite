import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";

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
      const response = await axiosInstance.post("/order/update", requestBody);
      if (response.status === 200 || response.status === 201) {
        setShowAlert(true);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        navigate("/user/payment", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, navigate]);

  return (
    <Container fluid className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row>
          <Col xs={12} className="text-center">
            <h1 className="fw-bold display-4 mb-4">🛒 Cart Items</h1>
          </Col>
        </Row>
      </motion.div>

      <Row>
        <Col xs={12} lg={9} md={12} className="mb-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <CartItemCard setCartId={setCartId} setRestaurantId={setRestaurantId} />
          </motion.div>
        </Col>

        <Col xs={12} lg={3} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Row>
              <Col xs={12} className="mb-4">
                <CouponCard selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />

                <div className="shadow-lg p-4 bg-body-tertiary rounded-4 mt-5">
                  {error && (
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  )}

                  <p className="fs-5 fw-bold text-center mb-3">
                    🧾 Ready to place your order?
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="warning"
                      className="w-100 py-2 rounded-3 fw-bold shadow-lg"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "✅ Check Out"}
                    </Button>
                  </motion.div>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Row className="mt-4">
          <Col xs={12}>
            <ShowAddress selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} />
          </Col>
        </Row>
      </motion.div>

      <Modal show={showAlert} centered>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Modal.Body className="text-center p-4">
            <p className="fs-5 fw-bold text-success mb-3">🎉 Order placed successfully!</p>
          </Modal.Body>
        </motion.div>
      </Modal>
    </Container>
  );
}

export default CheckoutPage;
