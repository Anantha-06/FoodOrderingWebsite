import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx"

function ProfilePage() {
  const [userData, isUserLoading, userError] = useFetch("/user/profile");
  const [addressData, isAddressLoading, addressError] = useFetch("/address/get");
  const [ordersData, isOrdersLoading, ordersError] = useFetch("/order/get/all");

  const profile = userData?.user || {};
  const address = addressData?.address || null;
  const orders = ordersData?.orders || [];

  if (isUserLoading || isAddressLoading || isOrdersLoading) return <p>Loading...</p>;

  return (
    <Container fluid>
      <div className="fs-1 fw-bold text-center">Profile</div>
      <Row className="my-5">
        <Col xs={12} sm={6} md={3} lg={3} className="d-flex justify-content-center">
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
            className="profilepage-image"
          />
        </Col>
        <Col xs={12} sm={6} md={9} lg={9} className="d-flex align-items-center">
          <div className="d-flex flex-column">
            <div className="d-flex gap-3">
              <p>Name :</p>
              <p>{profile.name || "N/A"}</p>
            </div>
            <div className="d-flex gap-3">
              <p>Email :</p>
              <p>{profile.email || "N/A"}</p>
            </div>
          </div>
        </Col>
      </Row>

      <hr />

      <div className="tabHeight shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
        <Tabs defaultActiveKey="Orders" id="profile-tabs" className="mb-3" fill>
          <Tab eventKey="Orders" title="Recent Orders" className="d-flex align-items-center justify-content-center">
            {ordersError || orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul>
                {orders.map((order, index) => (
                  <li key={index}>Order #{order.id} - {order.status}</li>
                ))}
              </ul>
            )}
          </Tab>

          <Tab eventKey="address" title="Address" className="d-flex align-items-center">
            {addressError || !address ? (
              <p>No address found.</p>
            ) : (
              <div className="d-flex flex-column">
                <div className="d-flex gap-2"><p>Name :</p> <p>{address.name}</p></div>
                <div className="d-flex gap-2"><p>House Name :</p> <p>{address.houseName}</p></div>
                <div className="d-flex gap-2"><p>Landmark :</p> <p>{address.landmark}</p></div>
                <div className="d-flex gap-2"><p>Street Name :</p> <p>{address.streetName}</p></div>
                <div className="d-flex gap-2"><p>City :</p> <p>{address.city}</p></div>
                <div className="d-flex gap-2"><p>State :</p> <p>{address.state}</p></div>
                <div className="d-flex gap-2"><p>Pincode :</p> <p>{address.pincode}</p></div>
                <div className="d-flex gap-2"><p>Phone :</p> <p>{address.phone}</p></div>
                <div><a className="text-decoration-none fw-bold fs-4" href="/address/new">Update Address</a></div>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}

export default ProfilePage;