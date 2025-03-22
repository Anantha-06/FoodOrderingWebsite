import React from "react";
import "../../App.css";

function CartItemCard() {
  return (
    <>
      
      <div className="d-flex flex-wrap mb-3 shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
  <div className="me-auto p-2"> 
    <div className="d-flex flex-row gap-4">
    <div>
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742379696/kzrwcmjnkc5yc66xb8x0.jpg"
            className="checkoutCartImage rounded-5"
          />
        </div>
        <div className="d-flex flex-nowrap flex-column text-center">
          <p className="p-0 m-0 fw-bold fs-6">Food Name</p>
          <p className="fs-6">Double Burger</p>
        </div>
        <div className="d-flex flex-nowrap flex-column text-center">
          <p className="p-0 m-0 fw-bold"> Added Quantity</p>
          <p>1</p>
        </div></div>
        </div>
 
  <div className="p-2"><div className="d-flex justify-content-end">
        <div className="d-flex flex-nowrap flex-column text-center">
          <p className="p-0 m-0 fw-bold">Add One More</p>
          <div className="text-center">
          <button className="cartbutton-checkout rounded-3 bg-warning">+</button>
          </div>
        </div>
        </div></div>
        <div className="p-2"><div className="d-flex justify-content-end">
        <div className="d-flex flex-nowrap flex-column text-center">
          <p className="p-0 m-0 fw-bold">Remove</p>
          <div className="text-center">
          <button className="cartbutton-checkout rounded-3 bg-warning">-</button>
          </div>
        </div>
        </div></div>
        <div className="p-2 mx-5"><div className="d-flex justify-content-end">
        <div className="d-flex flex-nowrap flex-column text-center">
          <p className="p-0 m-0 fw-bold fs-5">Price</p>
          <p className="fs-5">200</p>
        </div>
        </div></div>
</div>
     
    </>
  );
}

export default CartItemCard;
