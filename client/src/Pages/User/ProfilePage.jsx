import React from "react";
import { Col, Container, Row, Tab, Tabs, Card, ListGroup } from "react-bootstrap";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [userData, isUserLoading, userError] = useFetch("/user/profile");
  const [addressData, isAddressLoading, addressError] = useFetch("/address/get");
  const [ordersData, isOrdersLoading, ordersError] = useFetch("/order/get/all");

  const profile = userData?.user || {};
  const address = addressData?.address || null;
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];

  if (isUserLoading || isAddressLoading || isOrdersLoading) return <p>Loading...</p>;

  return (
    <Container fluid>
      <div className="fs-1 fw-bold text-center">Profile</div>
      <Row className="my-5">
        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
            className="profilepage-image"
            alt="Profile"
          />
        </Col>
        <Col xs={12} sm={6} md={9} lg={9} className="d-flex align-items-center">
          <div className="d-flex flex-column">
            <div className="d-flex gap-3"><p>Name:</p> <p>{profile.name || "N/A"}</p></div>
            <div className="d-flex gap-3"><p>Email:</p> <p>{profile.email || "N/A"}</p></div>
          </div>
        </Col>
      </Row>
      <hr />

      <div className="tabHeight shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
        <Tabs defaultActiveKey="Orders" id="profile-tabs" className="mb-3" fill>
          
          <Tab eventKey="Orders" title="Recent Orders">
            {ordersError || orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <>
                {orders.map((order) => (
                  <Card key={order._id} className="mb-3">
                    <Card.Body>
                      <Card.Title>Order #{order._id} - {order.status}</Card.Title>
                      <ListGroup variant="flush">
                        {order.cartId?.items?.map((item, idx) => (
                          <ListGroup.Item key={idx}>
                            {item.foodName} - Quantity: {item.quantity} - Price: ₹{item.totalItemPrice}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                ))}
              </>
            )}
          </Tab>

          
          <Tab eventKey="address" title="Address">
            {addressError || !address ? (
              <p>No address found.</p>
            ) : (
              <Card className="p-3">
                <Card.Body>
                  <Card.Title>Saved Address</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Name:</strong> {address.name}</ListGroup.Item>
                    <ListGroup.Item><strong>House Name:</strong> {address.houseName}</ListGroup.Item>
                    <ListGroup.Item><strong>Landmark:</strong> {address.landmark}</ListGroup.Item>
                    <ListGroup.Item><strong>Street Name:</strong> {address.streetName}</ListGroup.Item>
                    <ListGroup.Item><strong>City:</strong> {address.city}</ListGroup.Item>
                    <ListGroup.Item><strong>State:</strong> {address.state}</ListGroup.Item>
                    <ListGroup.Item><strong>Pincode:</strong> {address.pincode}</ListGroup.Item>
                    <ListGroup.Item><strong>Phone:</strong> {address.phone}</ListGroup.Item>
                  </ListGroup>
                  <div className="mt-3 text-center">
                    <Link to="/user/address/new" className="btn btn-warning">Update Address</Link>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}

export default ProfilePage;