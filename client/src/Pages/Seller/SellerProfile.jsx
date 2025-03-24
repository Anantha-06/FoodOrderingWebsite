import React from "react";
import { Card, Container, Row, Col, Image, Tabs, Tab } from "react-bootstrap";
import useFetch from "../../Hooks/UseFetch.jsx";

const SellerProfile = () => {
  const [restaurantData, isLoading, error] = useFetch("/restaurant/id/profile");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const restaurant = restaurantData?.restaurant || {};
  const menu = restaurant.menu || [];

  return (
    <Container className="mt-4">
      <div className="my-5"><h1 className="fw-bold">Welcome Back {restaurant.name}</h1></div>
      <Tabs defaultActiveKey="details" id="seller-profile-tabs" className="mb-3">
        <Tab eventKey="details" title="Restaurant Details">
          <Card className="mb-4 p-3 shadow">
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <Image src={restaurant.image} alt={restaurant.name} rounded fluid />
              </Col>
              <Col md={9}>
                <h2>{restaurant.name}</h2>
                <p>Email: {restaurant.email}</p>
                <p>Contact: {restaurant.phone}</p>
                <p>Verified: {restaurant.isVerified ? "Yes" : "No"}</p>
                <p>Open: {restaurant.isOpen ? "Yes" : "No"}</p>
                <p>Rating: {restaurant.rating} ⭐</p>
              </Col>
            </Row>
          </Card>
        </Tab>
        <Tab eventKey="menu" title="Menu Items">
          <Row>
            {menu.map((item) => (
              <Col md={4} key={item._id} className="mb-4">
                <Card className="shadow">
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
                      <br />
                      <strong>Category:</strong> {item.category}
                      <br />
                      <strong>Price:</strong> ₹{item.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SellerProfile;
