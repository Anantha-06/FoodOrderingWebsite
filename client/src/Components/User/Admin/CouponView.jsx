import React, { useState } from "react";
import { 
  Card, Form, Row, Col, Alert, Button, Spinner 
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import axiosInstance from "../../../Axios/axiosInstance.js";

const CouponView = () => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    minOrderVal: "",
    maxDiscValue: "",
    expiryDate: "",
    isAvailable: true,
  });
  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
    if (e.target.name === "expiryDate") {
      const today = new Date();
      const inputDate = new Date(e.target.value);
      setDateError(inputDate < today ? "Expiry date must be in the future." : "");
    }
  };

  const createCoupon = async () => {
    if (
      !coupon.code ||
      !coupon.discountPercentage ||
      !coupon.minOrderVal ||
      !coupon.maxDiscValue ||
      !coupon.expiryDate
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (dateError) return;

    setLoading(true);
    try {
      await axiosInstance.post("/coupon/create", coupon);
      setCoupon({
        code: "",
        discountPercentage: "",
        minOrderVal: "",
        maxDiscValue: "",
        expiryDate: "",
        isAvailable: true,
      });
      setFormError("");
      setCouponSuccess("Coupon created successfully!");
      setTimeout(() => setCouponSuccess(""), 3000);
    } catch (error) {
      console.error("Error creating coupon:", error);
      setCouponSuccess("");
      setFormError("Failed to create coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header className="bg-white">
        <h5 className="mb-0">Create Coupon</h5>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="couponCode">
                <Form.Label>Coupon Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. SUMMER20"
                  name="code"
                  value={coupon.code}
                  onChange={handleCouponChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="discountPercentage">
                <Form.Label>Discount Percentage</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 20"
                  name="discountPercentage"
                  value={coupon.discountPercentage}
                  onChange={handleCouponChange}
                  min="1"
                  max="100"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="minOrderVal">
                <Form.Label>Minimum Order Value</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  name="minOrderVal"
                  value={coupon.minOrderVal}
                  onChange={handleCouponChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="maxDiscValue">
                <Form.Label>Maximum Discount Value</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 200"
                  name="maxDiscValue"
                  value={coupon.maxDiscValue}
                  onChange={handleCouponChange}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="expiryDate">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  value={coupon.expiryDate}
                  onChange={handleCouponChange}
                  required
                />
                {dateError && <Form.Text className="text-danger">{dateError}</Form.Text>}
              </Form.Group>
            </Col>
          </Row>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {couponSuccess && <Alert variant="success">{couponSuccess}</Alert>}
          <Button 
            variant="primary" 
            onClick={createCoupon} 
            disabled={loading}
            className="d-flex align-items-center"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Create Coupon
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CouponView;