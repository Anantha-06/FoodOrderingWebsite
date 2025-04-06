import React, { useEffect, useState } from "react";
import { Button, Card, Table, Toast, ToastContainer } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../App.css";

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/order/get/all")
      .then(response => {
        if (response.data.orders.length > 0) {
          const latestOrder = response.data.orders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          setOrder(latestOrder);
        }
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
        showToast("Failed to fetch order data", "error");
      });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handlePayment = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      showToast("Please log in to proceed with the payment", "error");
      setTimeout(() => {
        navigate("/user/login");
      }, 1500);
      return;
    }

    if (!order) return;

    if (typeof window.Razorpay === "undefined") {
      showToast("Razorpay SDK not loaded. Please try again later.", "error");
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/payment/create/${order._id}`);

      if (!data || !data.razorpayOrder) {
        showToast("Failed to initiate payment", "error");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: order.restaurant.name,
        description: `Order #${order._id}`,
        image:
          "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axiosInstance.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast(verifyResponse.data.message, "success");
            setShowLoader(true);
            setTimeout(() => {
              navigate("/user/orders");
            }, 4000);
          } catch (err) {
            console.error("Payment verification failed:", err);
            showToast("Payment verification failed!", "error");
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
      showToast("Error initiating payment. Please try again.", "error");
    }
  };

  if (showLoader) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p className="fs-3 fw-bold text-success">Thanks for the order with Byteeats!!</p>
        <div className="paymentd"></div>
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
                  <tr key={item._id}>
                    <td><img src={item.foodImage} alt={item.foodName} width="50" className="rounded-5" /></td>
                    <td>{item.foodName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.totalItemPrice}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-secondary" onClick={() => navigate("/user/checkout")}>Cancel</Button>
              <Button variant="warning" onClick={handlePayment} className="px-5" disabled={showLoader}>
                {showLoader ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading order details...</p>
      )}

      <ToastContainer position="top-center" className="mt-4">
        <Toast show={toast.show} bg={toast.type === "error" ? "danger" : "success"} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white fw-bold text-center">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default PaymentPage;
