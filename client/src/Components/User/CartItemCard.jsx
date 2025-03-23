import React from "react";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";

function CartItemCard() {
  const [data, isLoading, error] = useFetch("/cart/all");
  const cart = data?.data || {};
  const items = cart.items || [];

  if (isLoading) return <p>Loading cart items...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {items.map((item) => (
        <div key={item.foodId} className="d-flex flex-wrap mb-3 shadow-lg p-3 bg-body-tertiary rounded-5">
          <div className="me-auto p-2">
            <div className="d-flex flex-row gap-4">
              <div>
                <img
                  src={item.foodImage || "https://via.placeholder.com/150"}
                  alt={item.foodName}
                  className="checkoutCartImage rounded-5"
                />
              </div>
              <div className="d-flex flex-nowrap flex-column text-center">
                <p className="p-0 m-0 fw-bold fs-6">Food Name</p>
                <p className="fs-6">{item.foodName}</p>
              </div>
              <div className="d-flex flex-nowrap flex-column text-center">
                <p className="p-0 m-0 fw-bold">Added Quantity</p>
                <p>{item.quantity}</p>
              </div>
            </div>
          </div>

          {/* Add One More */}
          <div className="p-2">
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-nowrap flex-column text-center">
                <p className="p-0 m-0 fw-bold">Add One More</p>
                <button className="cartbutton-checkout rounded-3 bg-warning">+</button>
              </div>
            </div>
          </div>

          {/* Remove One */}
          <div className="p-2">
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-nowrap flex-column text-center">
                <p className="p-0 m-0 fw-bold">Remove</p>
                <button className="cartbutton-checkout rounded-3 bg-warning">-</button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="p-2 mx-5">
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-nowrap flex-column text-center">
                <p className="p-0 m-0 fw-bold fs-5">Price</p>
                <p className="fs-5">₹{item.totalItemPrice}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default CartItemCard;
