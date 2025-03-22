import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AddNewAddress from "../../Components/User/AddNewAddress.jsx"
import CartItemCard from "../../Components/User/CartItemCard.jsx";
import AddCoupon from "../../Components/User/AddCoupon.jsx";

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
                <AddCoupon/>
                <AddNewAddress/>
            </div>
          </Row>
        </Container>
      </>
    )
}

export default CheckoutPage