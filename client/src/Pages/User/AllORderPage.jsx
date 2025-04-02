import React, { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import useFetch from "../../Hooks/UseFetch.jsx";
import "../../App.css"


function AllOrderPage() {
  const [data, isLoading, error] = useFetch("/order/get/all");
  const orders = data?.orders || [];

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
  if (error) {
    console.error("Fetch Error:", error);
    return <p className="text-danger text-center">No Order Found or {error.message}</p>;
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center " fluid>
      <div className="fs-3 fw-bold my-2">Recent Orders</div>
      <div className="w-75">
        <Table striped bordered hover responsive className="text-center my-5 ">
          <thead >
            <tr >
              <th>Order ID</th>
              <th>Restaurant</th>
              <th>City</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.restaurant.name}</td>
                <td>{order.deliveryAddress.city}</td>
                <td>{order.status}</td>
                <td>₹{order.totalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default AllOrderPage;