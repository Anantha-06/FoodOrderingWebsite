import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import CouponCard from "../../Components/User/CouponCard.jsx";
import ShowAddress from "../../Components/User/ShowAddress.jsx";

function CheckoutPage(){
    return(
        <>
        <Container fluid>
          <Row>
            <div className="text-center">
                <p className="fw-bold fs-1">Cart Items</p>
            </div>
            <div>
                <CartItemCard/>
                <ShowAddress/>
                <CouponCard/>
            </div>
          </Row>
        </Container>
      </>
    )
}

export default CheckoutPage