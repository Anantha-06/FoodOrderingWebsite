import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import Popup from "./Popup.jsx"; 
import "../../App.css";
import axiosInstance from "../../Axios/axiosInstance.js";

function RestaurantPageItemCard(props) {
  const [cart, setCart] = useState({
    foodId: props.foodId,
    restaurantId: props.restaurantId,
    quantity: 1, 
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setError("");
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/cart/item", cart);
      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (error.response) {
        console.error("Response data:", error.response.data); 
        console.error("Response status:", error.response.status); 
      }
      setError("Failed to add item to cart please check if any Item from different restaurant is already added to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowSuccess(false);
    setError("");
  };

  return (
    <Container className="zoom-container">
      <Row className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5 zoom-content">
        <Col
          xs={12}
          sm={12}
          md={3}
          lg={3}
          className="d-flex justify-content-center align-items-center"
        >
          <img
            src={props.image}
            className="menuItemimage rounded-4 img-fluid"
            alt={props.heading}
          />
        </Col>
        <Col
          xs={12}
          sm={12}
          md={3}
          lg={3}
          className="d-flex justify-content-center align-items-center text-center text-sm-start"
        >
          <p className="fs-6 fw-bold">{props.heading}</p>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={3}
          lg={3}
          className="d-flex justify-content-center align-items-center text-center text-sm-start"
        >
          <p>{props.desc}</p>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={1}
          lg={1}
          className="d-flex justify-content-center align-items-center"
        >
          <p>Rs {props.price}</p>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={2}
          lg={2}
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            variant="warning fire"
            className="px-4"
            id="app"
            onClick={handleAddToCart}
            disabled={loading} 
          >
            {loading ? "Adding..." : "Add To Cart"}
          </Button>
        </Col>
      </Row>
      {showSuccess && (
        <Popup
          message="Item added to cart successfully!"
          type="success"
          onClose={closePopup}
        />
      )}
      {error && (
        <Popup
          message={error}
          type="error"
          onClose={closePopup}
        />
      )}
    </Container>
  );
}

export default RestaurantPageItemCard;