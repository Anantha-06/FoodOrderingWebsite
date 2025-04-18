import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, Image, Card, Badge, Table, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import styled from "styled-components";
import axiosInstance from "../../../Axios/axiosInstance.js";
import { FaEnvelope, FaPhone, FaStar, FaClock, FaUtensils, FaEdit, FaUser } from "react-icons/fa";

// Styled Components
const ProfileContainer = styled(Container)`
  max-width: 1200px;
  padding: 2rem;
`;

const RestaurantHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    border-radius: 2px;
  }
`;

const InfoCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const MenuTable = styled(Table)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  thead th {
    background-color: #2c3e50;
    color: white;
    border-bottom: none;
  }
  
  tbody tr {
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(248, 249, 250, 0.7);
    }
  }
`;

const StatusBadge = styled(Badge)`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 500;
`;

const ReviewCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    const fetchRestaurantProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/restaurant/profile");
        setRestaurant(response.data.restaurant);
      } catch (err) {
        console.error("Error fetching restaurant profile:", err);
        setError("Failed to fetch restaurant profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantProfile();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!restaurant) return;
      
      try {
        setReviewsLoading(true);
        const response = await axiosInstance.get(`/review/${restaurant._id}/all`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("Failed to fetch reviews. Please try again.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [restaurant]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
        <Button 
          variant="primary" 
          className="mt-3"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">No restaurant data available</Alert>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileContainer>
        <RestaurantHeader>
          {restaurant.image && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ display: 'inline-block' }}
            >
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                width="150"
                height="150"
                roundedCircle
                className="mb-3 border"
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          )}
          <h2>{restaurant.name}</h2>
          <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
            <StatusBadge bg={restaurant.isOpen ? "success" : "danger"}>
              {restaurant.isOpen ? "Open" : "Closed"}
            </StatusBadge>
            <StatusBadge bg="warning" text="dark">
              <FaStar className="me-1" />
              {reviews?.averageRating?.toFixed(1) || restaurant.rating || "No ratings yet"}
              {reviews?.totalReviews && (
                <small className="text-muted ms-1">({reviews.totalReviews})</small>
              )}
            </StatusBadge>
          </div>
        </RestaurantHeader>

        <Row className="g-4 mb-4">
          <Col md={6}>
            <InfoCard>
              <Card.Header className="bg-white">
                <h5 className="mb-0">Contact Information</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td width="40"><FaEnvelope size={20} /></td>
                      <td>
                        <strong>Email</strong>
                        <div>{restaurant.email}</div>
                      </td>
                    </tr>
                    <tr>
                      <td><FaPhone size={20} /></td>
                      <td>
                        <strong>Phone</strong>
                        <div>{restaurant.phone}</div>
                      </td>
                    </tr>
                    <tr>
                      <td><FaEnvelope size={20} /></td>
                      <td>
                        <strong>Contact Email</strong>
                        <div>{restaurant.contactEmail}</div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </InfoCard>
          </Col>
          <Col md={6}>
            <InfoCard>
              <Card.Header className="bg-white">
                <h5 className="mb-0">Restaurant Details</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td width="40"><FaUtensils size={20} /></td>
                      <td>
                        <strong>Menu Items</strong>
                        <div>{restaurant.menu?.length || 0} items</div>
                      </td>
                    </tr>
                    <tr>
                      <td><FaStar size={20} /></td>
                      <td>
                        <strong>Rating</strong>
                        <div>
                          {reviews?.averageRating?.toFixed(1) || "Not rated yet"}
                          {reviews?.totalReviews && (
                            <small className="text-muted ms-1">({reviews.totalReviews} reviews)</small>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><FaClock size={20} /></td>
                      <td>
                        <strong>Status</strong>
                        <div>
                          <Badge bg={restaurant.isOpen ? "success" : "danger"}>
                            {restaurant.isOpen ? "Currently Open" : "Currently Closed"}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </InfoCard>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Menu Items</h5>
          </Card.Header>
          <Card.Body>
            {restaurant.menu?.length > 0 ? (
              <MenuTable hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurant.menu.map((item) => (
                    <motion.tr
                      key={item._id}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <td>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width="60"
                          height="60"
                          rounded
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-bold">{item.name}</td>
                      <td>
                        <Badge bg="secondary">{item.category}</Badge>
                      </td>
                      <td className="fw-bold">₹{item.price}</td>
                      <td>
                        <small className="text-muted">
                          {item.description || "No description"}
                        </small>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </MenuTable>
            ) : (
              <Alert variant="info" className="text-center">
                No menu items found. Add items to your menu to get started.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Reviews Section */}
        <Card className="mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Customer Reviews
              {reviews?.totalReviews && (
                <Badge bg="secondary" className="ms-2">
                  {reviews.totalReviews}
                </Badge>
              )}
            </h5>
            {reviewsLoading && <Spinner animation="border" size="sm" />}
          </Card.Header>
          <Card.Body>
            {reviewsError && (
              <Alert variant="danger" className="text-center">
                {reviewsError}
              </Alert>
            )}

            {reviewsLoading && !reviews && (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            )}

            {!reviewsLoading && reviews?.reviews?.length > 0 ? (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {reviews.reviews.map((review) => (
                  <ReviewCard key={review._id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FaUser className="me-2 text-muted" />
                          <strong>
                            {review.user?.name || "Anonymous User"}
                          </strong>
                        </div>
                        <Badge bg="warning" text="dark">
                          {review.rating} <FaStar size={12} />
                        </Badge>
                      </div>
                      <p className="mb-2">{review.comment}</p>
                      <small className="text-muted">
                        Posted on: {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </Card.Body>
                  </ReviewCard>
                ))}
              </div>
            ) : (
              !reviewsLoading && (
                <Alert variant="info" className="text-center">
                  No reviews yet. Be the first to review!
                </Alert>
              )
            )}
          </Card.Body>
        </Card>
      </ProfileContainer>
    </motion.div>
  );
}

export default RestaurantProfile;