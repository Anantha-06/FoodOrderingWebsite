import React from "react";
import { Col, Container, Row, Tab, Tabs, Card, ListGroup } from "react-bootstrap";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ProfilePage() {
  const [userData, isUserLoading, userError] = useFetch("/user/profile");
  const [addressData, isAddressLoading, addressError] = useFetch("/address/get");
  const [ordersData, isOrdersLoading, ordersError] = useFetch("/order/get/all");

  const profile = userData?.user || {};
  const address = addressData?.address || null;
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];

  if (isUserLoading || isAddressLoading || isOrdersLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="loader"></div>
      </div>
    );

  return (
    <Container fluid>
      <motion.div
        className="fs-1 fw-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        👤 Profile
      </motion.div>

      <Row className="my-5">
        <Col xs={12} sm={6} md={3} className="d-flex justify-content-center">
          <motion.img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
            className="profilepage-image rounded-circle shadow"
            alt="Profile"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: 120, height: 120 }}
          />
        </Col>

        <Col xs={12} sm={6} md={9} className="d-flex align-items-center">
          <div className="d-flex flex-column gap-2 fs-5">
            <div><strong>Name:</strong> {profile.name || "N/A"}</div>
            <div><strong>Email:</strong> {profile.email || "N/A"}</div>
          </div>
        </Col>
      </Row>

      <hr />

      <motion.div
        className="tabHeight rounded-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultActiveKey="Orders" id="profile-tabs" className="mb-3" fill>
          {/* ORDERS TAB */}
          <Tab eventKey="Orders" title="🛍 Recent Orders">
            {ordersError || orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="mb-3 rounded-5 shadow bg-body-secondary p-3 border-0">
                    <Card.Body>
                      <Card.Title className="fw-semibold">Order No: {order._id}</Card.Title>
                      <Card.Text>Status: <span className="text-capitalize">{order.status}</span></Card.Text>
                      <ListGroup variant="flush">
                        {order.cartId?.items?.map((item, idx) => (
                          <ListGroup.Item key={idx} className="d-flex align-items-center gap-2">
                            <img
                              src={item.foodImage}
                              alt={item.foodName}
                              className="rounded"
                              style={{ height: "50px", width: "50px", objectFit: "cover" }}
                            />
                            <div>
                              <strong>{item.foodName}</strong><br />
                              Qty: {item.quantity} - ₹{item.totalItemPrice}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))
            )}
          </Tab>

          {/* ADDRESS TAB */}
          <Tab eventKey="address" title="📍 Address">
            {addressError || !address ? (
              <p>No address found.</p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 shadow-sm border-0 rounded-4 ">
                  <Card.Body>
                    <Card.Title className="text-center mb-3 fw-bold">Saved Address</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item><strong>Name:</strong> {address.name}</ListGroup.Item>
                      <ListGroup.Item><strong>House Name:</strong> {address.houseName}</ListGroup.Item>
                      <ListGroup.Item><strong>Landmark:</strong> {address.landmark}</ListGroup.Item>
                      <ListGroup.Item><strong>Street:</strong> {address.streetName}</ListGroup.Item>
                      <ListGroup.Item><strong>City:</strong> {address.city}</ListGroup.Item>
                      <ListGroup.Item><strong>State:</strong> {address.state}</ListGroup.Item>
                      <ListGroup.Item><strong>Pincode:</strong> {address.pincode}</ListGroup.Item>
                      <ListGroup.Item><strong>Phone:</strong> {address.phone}</ListGroup.Item>
                    </ListGroup>
                    <div className="text-center mt-3">
                      <Link to="/user/address/new" className="btn btn-warning rounded-pill px-4">
                        Update Address
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </Tab>
        </Tabs>
      </motion.div>
    </Container>
  );
}

export default ProfilePage;
