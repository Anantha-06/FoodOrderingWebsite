import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";
import { useState } from "react";

function CheckoutPage() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
console.log(selectedAddressId,selectedCoupon)
  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col xs={12} className="text-center">
          <h1 className="fw-bold display-4">Cart Items</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={9} className="mb-4">
          <CartItemCard />
        </Col>
        <Col xs={12} lg={3}>
          <Row>
            <Col xs={12} className="mb-4">
              <CouponCard
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
            </Col>
          </Row>
        </Col>
            <Col xs={12}>
              <ShowAddress
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
              />
            </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;