import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, Spinner, Alert } from "react-bootstrap";
import useFetch from "../../Hooks/UseFetch.jsx";
import axiosInstance from "../../Axios/axiosInstance.js";
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import "../../PageStyle/CartItemCard.css"; 

function CartItemCard({ setCartId, setRestaurantId }) {
  const [data, isLoading, error, refetch] = useFetch("/cart/all");
  const cart = data?.data || {};
  const items = cart.items || [];

  useEffect(() => {
    if (cart._id) {
      setCartId(cart._id);
    }
    if (cart.restaurantId) {
      setRestaurantId(cart.restaurantId);
    }
  }, [cart, setCartId, setRestaurantId]);

  const handleQuantityUpdate = async (foodId, action) => {
    try {
      const response = await axiosInstance.put("/cart/itemupdate", { foodId, action });
      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteCart = async () => {
    if (!cart._id) {
      console.error("Cart ID is undefined");
      alert("Cart ID not found!");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/cart/delete_cart/${cart._id}`);
      if (response.status === 200) {
        alert("Cart deleted successfully");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
      alert("Failed to delete cart. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center my-4">
        <FiShoppingCart className="me-2" />
        No Items Added To The Cart Or Failed To Fetch Cart
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Alert variant="warning" className="text-center my-4">
        <FiShoppingCart className="me-2" />
        Your cart is empty
      </Alert>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
      
          {items.map((item) => (
            <Card key={item.foodId} className="mb-3 shadow-sm border-0 cart-item-card">
              <Card.Body className="d-flex flex-column flex-md-row align-items-center">
                <Image
                  src={item.foodImage || "https://via.placeholder.com/150"}
                  alt={item.foodName}
                  className="rounded-3 me-md-3 mb-3 mb-md-0"
                  width={120}
                  height={120}
                />
                <div className="flex-grow-1 text-center text-md-start">
                  <h5 className="fw-bold mb-2">{item.foodName}</h5>
                  <div className="d-flex justify-content-center justify-content-md-start align-items-center mb-2">
                    <span className="me-3">Quantity:</span>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      className="px-3 quantity-btn"
                      onClick={() => handleQuantityUpdate(item.foodId, "decrement")}
                    >
                      <FiMinus />
                    </Button>
                    <span className="mx-2 fw-bold">{item.quantity}</span>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="px-3 quantity-btn text-white"
                      onClick={() => handleQuantityUpdate(item.foodId, "increment")}
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>
                <div className="ms-md-auto text-center text-md-end">
                  <h5 className="fw-bold text-warning mb-0">₹{item.totalItemPrice}</h5>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 " style={{ top: "20px" }}>
            <Card.Body className="text-center">
              <h4 className="fw-bold mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">₹{cart?.totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Discount:</span>
                <span className="text-success fw-bold">
                  -₹{(cart?.totalPrice - cart?.finalPrice).toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total:</h5>
                <h4 className="fw-bold text-warning">₹{cart?.finalPrice}</h4>
              </div>
              <Button 
                variant="danger" 
                className="w-100 mb-3"
                onClick={handleDeleteCart}
              >
                <FiTrash2 className="me-2" />
                Clear Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartItemCard;