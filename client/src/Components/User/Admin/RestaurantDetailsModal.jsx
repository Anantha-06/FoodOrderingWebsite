import React from "react";
import { Modal, Row, Col, Button, Badge, Spinner } from "react-bootstrap";
import { 
  FaStar, FaCheck, FaTimes, FaPhone, FaEnvelope, FaTrash, FaUser 
} from "react-icons/fa";
import useFetch from "../../../Hooks/UseFetch.jsx"; 

const RestaurantDetailsModal = ({ 
  show, 
  onHide, 
  restaurant, 
  loading, 
  approveRestaurant, 
  deleteRestaurant 
}) => {
  const [reviewsData, reviewsLoading, reviewsError, fetchReviews] = useFetch(
    restaurant ? `/review/${restaurant._id}/all` : null
  );

  if (!restaurant) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{restaurant.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="img-fluid rounded mb-3"
            />
            <div className="d-flex align-items-center mb-2">
              <FaStar className="me-2 text-warning" />
              <span>
                Rating: {reviewsData?.averageRating?.toFixed(1) || restaurant.rating || "N/A"}
                {reviewsData?.totalReviews && (
                  <small className="text-muted"> ({reviewsData.totalReviews} reviews)</small>
                )}
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              {restaurant.isVerified ? (
                <>
                  <FaCheck className="me-2 text-success" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <FaTimes className="me-2 text-danger" />
                  <span>Not Verified</span>
                </>
              )}
            </div>
            <div className="d-flex align-items-center mb-2">
              {restaurant.isOpen ? (
                <>
                  <FaCheck className="me-2 text-success" />
                  <span>Currently Open</span>
                </>
              ) : (
                <>
                  <FaTimes className="me-2 text-danger" />
                  <span>Currently Closed</span>
                </>
              )}
            </div>
            {!restaurant.isVerified && (
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={() => {
                  approveRestaurant(restaurant._id);
                  onHide();
                }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaCheck className="me-1" /> Approve Restaurant
                  </>
                )}
              </Button>
            )}
          </Col>
          <Col md={8}>
            <h5>Contact Information</h5>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              <span>{restaurant.email}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2" />
              <span>{restaurant.phone}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              <span>Contact Email: {restaurant.contactEmail}</span>
            </div>
            
            <h5 className="mt-4">Menu Items ({restaurant.menu?.length || 0})</h5>
            {restaurant.menu?.length > 0 ? (
              <div className="menu-items-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {restaurant.menu.map((item) => (
                  <div key={item._id} className="menu-item p-3 mb-3 border rounded">
                    <div className="d-flex">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="img-thumbnail me-3"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6>{item.name}</h6>
                        <p className="text-muted">{item.description}</p>
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">₹{item.price}</span>
                          <span className="badge bg-secondary">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No menu items available</p>
            )}

            <h5 className="mt-4">
              Reviews ({reviewsData?.totalReviews || 0})
              {reviewsLoading && <Spinner animation="border" size="sm" className="ms-2" />}
            </h5>
            
            {reviewsError && (
              <div className="alert alert-danger">
                Failed to load reviews: {reviewsError.message}
              </div>
            )}

            {reviewsData?.reviews?.length > 0 ? (
              <div className="reviews-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {reviewsData.reviews.map((review) => (
                  <div key={review._id} className="review-item p-3 mb-3 border rounded">
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-2">
                        {review.user ? (
                          <div className="d-flex align-items-center">
                            <FaUser className="me-1" />
                            <span>{review.user.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted">Anonymous User</span>
                        )}
                      </div>
                      <div className="ms-auto">
                        <Badge bg="warning" text="dark">
                          {review.rating} <FaStar size={12} />
                        </Badge>
                      </div>
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">
                      Posted on: {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              !reviewsLoading && <p>No reviews yet</p>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="danger" 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this restaurant?')) {
              deleteRestaurant(restaurant._id);
              onHide();
            }
          }}
        >
          <FaTrash className="me-1" /> Delete Restaurant
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantDetailsModal;