import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";
import { useState } from "react";

function CheckoutPage(){
  
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  console.log(selectedCoupon,selectedAddressId)
    return(
    
        <>
        <Container fluid>
          <Row>
            <div className="text-center">
                <p className="fw-bold fs-1">Cart Items</p>
            </div>
            <div>
                <CartItemCard/>
                <CouponCard selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />
                <ShowAddress selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} />
            </div>
          </Row>
        </Container>
      </>
    )
}

export default CheckoutPage