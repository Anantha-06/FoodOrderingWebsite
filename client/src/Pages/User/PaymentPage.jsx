import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Table } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";

const PaymentPage = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axiosInstance.get("/order/get/all")
      .then(response => {
        if (response.data.orders.length > 0) {
          setOrder(response.data.orders[0]);
        }
      })
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  const handlePayment = () => {
    if (!order) return;
    const options = {
      key: "YOUR_RAZORPAY_KEY", 
      amount: order.totalAmount * 100,
      currency: "INR",
      name: order.restaurant.name,
      description: `Order #${order._id}`,
      image: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png",
      handler: function (response) {
        alert("Payment Successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: order.user.name,
        email: order.user.email,
        contact: order.user.phone,
      },
      theme: {
        color: "#F37254",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="container mt-5">
      {order ? (
        <Card className="shadow-lg p-1 bg-light rounded-5 my-5">
          <Card.Body className="my-2">
            <Card.Title className="fs-3 fw-bold">Order Details</Card.Title>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Restaurant Name:</strong> {order.restaurant.name}</p>
            <p className="fw-bold"><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            <Table striped bordered hover >
              <thead >
                <tr className="mb-3 shadow-lg p-1 bg-light rounded-5">
                  <th></th>
                  <th>Food Items</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody >
                {order.cartId.items.map(item => (
                  <tr key={item._id} className="mb-3 shadow-lg p-1 bg-light rounded-5">
                    <td ><img src={item.foodImage} alt={item.foodName} width="50" className="rounded-5"/></td>
                    <td>{item.foodName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.totalItemPrice}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="warning" onClick={handlePayment} className="px-5">Pay Now</Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default PaymentPage;
