import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";

function CheckoutPage() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    console.log("handleCheckout called");

    setError("");

    if (!cartId || !selectedAddressId) {
      console.log("Missing cartId or selectedAddressId");
      setError("Please select an address and add items to the cart.");
      return;
    }

    setLoading(true);
    const requestBody = {
      restaurant: "67da8656b1e6fb6f2bf7e97d",
      cartId: cartId,
      coupon: selectedCoupon || "",
      deliveryAddress: selectedAddressId,
    };

    try {
      console.log("Sending request to /order/update", requestBody);
      const response = await axiosInstance.post("/order/update", requestBody);
      console.log("Response received:", response);

      if (response.status === 200 || response.status === 201) {
        console.log("Order placed successfully, setting showAlert to true");
        setShowAlert(true);
      } else {
        console.error("Unexpected response status:", response.status);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Checkout failed:", error.response?.data || error.message);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAlert) {
      console.log("showAlert is true, navigating to /user/order");
      setTimeout(() => {
        navigate("/user/payment", { replace: true });
      }, 2000);
    }
  }, [showAlert, navigate]);

  return (
    <Container fluid className="p-4">
     
      <Row className="mb-4">
        <Col xs={12} className="text-center">
          <h1 className="fw-bold display-4">Cart Items</h1>
        </Col>
      </Row>

      <Row>
      
        <Col xs={12} lg={9} md={12} className="mb-4">
          <CartItemCard setCartId={setCartId} />
        </Col>

       
        <Col xs={12} lg={3} md={6} >
          <Row>
            <Col xs={12}  className="mb-4">
              <CouponCard
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
              <div className="mb-3 shadow-lg p-3 bg-body-tertiary rounded-4 my-5">
                <div className="bg-light.bg-gradient">
                  {error && <p className="text-danger">{error}</p>}
                  <p className="fs-5 fw-bold">
                    To proceed further, click on the Checkout Button
                  </p>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="warning"
                      className="px-5 py-2 rounded-3 fw-bold shadow-lg"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Check Out"}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Address Selection */}
        <Row>
          <Col xs={12}>
            <ShowAddress
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />
          </Col>
        </Row>
      </Row>

      {/* Custom Alert Modal */}
      <Modal show={showAlert} centered>
        <Modal.Body className="text-center">
          <p className="fs-5 fw-bold text-success">
            ✅ Order placed successfully!
          </p>
          <Button variant="warning" className="px-4 "onClick={() => setShowAlert(false)}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CheckoutPage;
