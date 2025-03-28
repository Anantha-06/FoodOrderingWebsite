import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, Image, Spinner, Alert } from "react-bootstrap";
import useFetch from "../../Hooks/UseFetch.jsx";
import axiosInstance from "../../Axios/axiosInstance.js";
import "../../App.css"

function CartItemCard({ setCartId }) {
  const [data, isLoading, error, refetch] = useFetch("/cart/all");
  const cart = data?.data || {};
  const items = cart.items || [];

  useEffect(() => {
    if (cart._id) {
      setCartId(cart._id);
    }
  }, [cart, setCartId]);

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
      console.log("Deleting cart with ID:", cart._id);
      const response = await axiosInstance.delete(`/cart/delete_cart/${cart._id}`);

      if (response.status === 200) {
        alert("Cart deleted successfully");
        refetch(); // Refresh cart data
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
      alert("Failed to delete cart. Please try again.");
    }
  };

  if (isLoading)  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      <div className="loader"></div>
    </div>
  );
  if (error) return <Alert variant="danger">No Items Added To The Cart Or Failed To Fetch Cart</Alert>;
  if (items.length === 0) return <Alert variant="warning">No items added to the cart.</Alert>;

  return (
    <Container>
      <Row className="my-4">
        <Col md={8}>
          {items.map((item) => (
            <Card key={item.foodId} className="mb-3 shadow-lg p-1 bg-light rounded-5">
              <Card.Body className="d-flex flex-wrap align-items-center">
                <Image
                  src={item.foodImage || "https://via.placeholder.com/150"}
                  alt={item.foodName}
                  className="rounded-5 me-3"
                  width={100}
                  height={100}
                />
                <div className="flex-grow-1">
                  <h6 className="fw-bold">{item.foodName}</h6>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="text-center">
                  <p className="fw-bold mb-1">Add One More</p>
                  <Button variant="warning" className="px-4" size="sm" onClick={() => handleQuantityUpdate(item.foodId, "increment")}>
                    +
                  </Button>
                </div>
                <div className="text-center ms-3">
                  <p className="fw-bold mb-1">Remove</p>
                  <Button variant="danger" className="px-4" size="sm" onClick={() => handleQuantityUpdate(item.foodId, "decrement")}>
                    -
                  </Button>
                </div>
                <div className="text-end ms-3">
                  <h5 className="fw-bold">₹{item.totalItemPrice}</h5>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={4}>
          <Card className="shadow-lg p-3 bg-light rounded-5 text-center">
            <Card.Body>
              <h4 className="fw-bold">Total Price: ₹{cart?.totalPrice}</h4>
              <h3 className="fw-bold text-primary">Final Price: ₹{cart?.finalPrice}</h3>
              <Button variant="danger" onClick={handleDeleteCart}>Delete Cart</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CartItemCard;