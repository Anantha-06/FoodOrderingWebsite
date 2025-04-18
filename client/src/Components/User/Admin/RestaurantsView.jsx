// RestaurantsView.js
import React from "react";
import { Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import RestaurantCard from "./RestaurantCard.jsx";

const RestaurantsView = ({ loading, restaurants, viewRestaurantDetails, deleteRestaurant }) => {
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
                <Badge bg={restaurant.isVerified ? "success" : "danger"}>
                  {restaurant.isVerified ? "Verified" : "Unverified"}
                </Badge>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this restaurant?')) {
                      deleteRestaurant(restaurant._id);
                    }
                  }}
                >
                  <FaTrash />
                </Button>
              </div>
            </Card.Body>
          </RestaurantCard>
        </Col>
      ))}
    </Row>
  );
};

export default RestaurantsView;