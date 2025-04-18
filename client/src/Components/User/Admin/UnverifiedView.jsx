// UnverifiedView.js
import React from "react";
import { Row, Col, Button, Spinner,Card,Badge } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard";

const UnverifiedView = ({ loading, restaurants, viewRestaurantDetails, approveRestaurant }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {restaurants.map((restaurant) => (
        <Col key={restaurant._id}>
          <RestaurantCard onClick={() => viewRestaurantDetails(restaurant)}>
            <Card.Img 
              variant="top" 
              src={restaurant.image} 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <Card.Body>
              <Card.Title>{restaurant.name}</Card.Title>
              <Card.Text>
                <small className="text-muted">
                  {restaurant.email}
                </small>
              </Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg="warning">Pending Verification</Badge>
                <Button 
                  size="sm" 
                  variant="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    approveRestaurant(restaurant._id);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <FaCheck className="me-1" /> Approve
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </RestaurantCard>
        </Col>
      ))}
    </Row>
  );
};

export default UnverifiedView;