import React, { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../../App.css"

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/order/get/all")
      .then(response => {
        if (response.data.orders.length > 0) {
          setOrder(response.data.orders[0]);
        }
      })
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  const handlePayment = async () => {
    if (!order) return;
  
    try {
      const { data } = await axiosInstance.post(`/payment/create/${order._id}`);
  
      if (!data || !data.razorpayOrder) {
        console.error("Failed to initiate payment");
        return;
      }
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, 
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: order.restaurant.name,
        description: `Order #${order._id}`,
        image:
          "https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png",
        order_id: data.razorpayOrder.id, 
        handler: async function (response) {
          try {
            const verifyResponse = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
  
            alert(verifyResponse.data.message);
            setShowLoader(true);
            setTimeout(() => {
              navigate("/user/homepage");
            }, 4000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed!");
          }
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
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };
  
  if (showLoader) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }} >
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">

        <p className="fs-3 fw-bold text-success ">Thanks for the order with Byteeats!!</p>
        <div className="paymentd"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {order ? (
        <Card className="shadow-lg p-1 bg-light rounded-5 my-5">
          <Card.Body className="my-2">
            <Card.Title className="fs-3 fw-bold">Order Details</Card.Title>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Restaurant Name:</strong> {order.restaurant.name}</p>
            <p className="fw-bold"><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            <p className="fw-bold"><strong>Final Amount:</strong> ₹{order.finalPrice}</p>
            <Table striped bordered hover>
              <thead>
                <tr className="mb-3 shadow-lg p-1 bg-light rounded-5">
                  <th></th>
                  <th>Food Items</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.cartId.items.map(item => (
                  <tr key={item._id} className="mb-3 shadow-lg p-1 bg-light rounded-5">
                    <td><img src={item.foodImage} alt={item.foodName} width="50" className="rounded-5"/></td>
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