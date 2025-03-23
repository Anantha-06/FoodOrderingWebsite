import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";

function CheckoutPage() {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartId, setCartId] = useState(null);

  console.log(selectedAddressId,selectedCoupon,cartId)

  return (
    <Container fluid className="p-4 ">
      <Row className="mb-4 ">
        <Col xs={12} className="text-center">
          <h1 className="fw-bold display-4">Cart Items</h1>
        </Col>
      </Row>
      <Row >
        <Col xs={12} lg={9} className="mb-4">
          <CartItemCard setCartId={setCartId} /> 
        </Col>
        <Col xs={12} lg={3}>
          <Row>
            <Col xs={12} className="mb-4">
              <CouponCard
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
              <div className="mb-3 shadow-lg p-3 bg-body-tertiary rounded-4 my-5">
                <div className="bg-light.bg-gradient">
                  <p className="fs-5 fw-bold">
                    To proceed further, click on the Checkout Button
                  </p>
                  <button className="bg-warning px-5 py-2 rounded-3 fw-bold">
                    Check Out
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Row>
        <Col xs={12} >
          <ShowAddress
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
          />
        </Col>

        </Row>
      </Row>
    </Container>
  );
}

export default CheckoutPage;
