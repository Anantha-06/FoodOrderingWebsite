import React, { useState } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetch from "../../Hooks/UseFetch.jsx";

const CouponCard = () => {
  const [data,isLoading,error] =useFetch("/coupon/avaiable")
const coupon = data?.data
if (isLoading) return <p>Loading products...</p>;
if (error) {
  console.error("Fetch Error:", error);
  return <p>{error.message}</p>;
}


  return (
    <Container className="d-flex justify-content-center mt-4">
      <Card className="text-center p-3 shadow" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title className="fw-bold">Avilable Offers!</Card.Title>
          <Card.Text className="text-muted">Get 20% off on your next purchase</Card.Text>
          <Row className="align-items-center border p-2 rounded">
            <Col className="fw-bold">Coupon Code</Col>
            <Col>
              <Button variant="primary" >
                Apply Coupon
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CouponCard;
