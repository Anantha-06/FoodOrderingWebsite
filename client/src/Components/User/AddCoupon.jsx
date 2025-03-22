import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CouponComponent = () => {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  const handleApplyCoupon = () => {
    if (coupon.trim() === "") {
      setError("Please enter a coupon code.");
      return;
    }
    setAppliedCoupon(coupon);
    setCoupon("");
    setError("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "400px" }}>
      <h4>Apply Coupon</h4>
      {appliedCoupon ? (
        <Alert variant="success">
          Coupon Applied: <strong>{appliedCoupon}</strong>
          <Button 
            variant="danger" 
            size="sm" 
            className="ms-2" 
            onClick={handleRemoveCoupon}
          >
            Remove
          </Button>
        </Alert>
      ) : (
        <>
          <Form.Control
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          {error && <small className="text-danger">{error}</small>}
          <Button className="mt-2" variant="primary" onClick={handleApplyCoupon}>
            Apply
          </Button>
        </>
      )}
    </Container>
  );
};

export default CouponComponent;
