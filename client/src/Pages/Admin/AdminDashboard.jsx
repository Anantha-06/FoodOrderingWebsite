import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  Table,
  Button,
  Form,
  Alert,
  Container,
} from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [unverifiedRestaurants, setUnverifiedRestaurants] = useState([]);
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    minOrderVal: "",
    maxDiscValue: "",
    expiryDate: "",
    isAvailable: true,
  });
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/all");
      if (Array.isArray(response.data.restaurant)) {
        setRestaurants(response.data.restaurant);
        setUnverifiedRestaurants(
          response.data.restaurant.filter((r) => !r.isVerified)
        );
      }
    } catch (error) {
      setRestaurants([]);
      setUnverifiedRestaurants([]);
    }
  };

  const approveRestaurant = async (id) => {
    try {
      await axiosInstance.put(`/admin/verify/${id}`);
      fetchRestaurants();
    } catch (error) {}
  };

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
    if (e.target.name === "expiryDate") {
      validateDate(e.target.value);
    }
  };

  const validateDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate < today) {
      setDateError("Expiry date must be in the future.");
    } else {
      setDateError("");
    }
  };

  const createCoupon = async () => {
    if (dateError) return;
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
    } catch (error) {}
  };

  return (
    <Container className="mt-4">
      <div className="text-center mb-4">
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
          alt="Admin Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </div>
      <h1 className="text-center">Admin Dashboard</h1>
      <Tabs
        defaultActiveKey="restaurants"
        id="admin-dashboard-tabs"
        className="mb-3 "
        justify
      >
        <Tab
          eventKey="restaurants"
          title="All Restaurants"
          className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5"
        >
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.email}</td>
                  <td>{restaurant.isVerified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab
          eventKey="unverified"
          title="Unverified Restaurants"
          className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5"
        >
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unverifiedRestaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.phone}</td>
                  <td>{restaurant.email}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => approveRestaurant(restaurant._id)}
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab
          eventKey="coupon"
          title="Create Coupon"
          className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5"
        >
          <Form>
            <Form.Group controlId="code">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={coupon.code}
                onChange={handleCouponChange}
              />
            </Form.Group>
            <Form.Group controlId="discountPercentage">
              <Form.Label>Discount %</Form.Label>
              <Form.Control
                type="number"
                name="discountPercentage"
                value={coupon.discountPercentage}
                onChange={handleCouponChange}
              />
            </Form.Group>
            <Form.Group controlId="minOrderVal">
              <Form.Label>Min Order Value</Form.Label>
              <Form.Control
                type="number"
                name="minOrderVal"
                value={coupon.minOrderVal}
                onChange={handleCouponChange}
              />
            </Form.Group>
            <Form.Group controlId="maxDiscValue">
              <Form.Label>Max Discount Value</Form.Label>
              <Form.Control
                type="number"
                name="maxDiscValue"
                value={coupon.maxDiscValue}
                onChange={handleCouponChange}
              />
            </Form.Group>
            <Form.Group controlId="expiryDate">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={coupon.expiryDate}
                onChange={handleCouponChange}
              />
              {dateError && (
                <Alert variant="danger" className="mt-2">
                  {dateError}
                </Alert>
              )}
            </Form.Group>
            <Button
              variant="primary"
              className="mt-2"
              onClick={createCoupon}
              disabled={!!dateError}
            >
              Create Coupon
            </Button>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
