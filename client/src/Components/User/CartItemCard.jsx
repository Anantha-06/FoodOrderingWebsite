import React from "react";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";
import axiosInstance from "../../Axios/axiosInstance.js";

function CartItemCard() {
  const [data, isLoading, error, refetch] = useFetch("/cart/all");
  const cart = data?.data || {};
  const items = cart.items || [];

  const handleQuantityUpdate = async (foodId, action) => {
    try {
      const response = await axiosInstance.put("/cart/itemupdate", {
        foodId,
        action,
      });

      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (isLoading) return <p>Loading cart items...</p>;
  if (error) return <p className="d-flex flex-wrap mb-3 shadow-lg p-3 bg-body-tertiary rounded-5 fs-3 fw-bold">No Items Added To The Cart Or Failed To Fetch Cart</p>;
  if (items.length === 0) return <p>No items added to the cart.</p>;

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-8">
          {items.map((item) => (
            <div key={item.foodId} className="d-flex flex-wrap mb-3 shadow-lg p-3 bg-body-tertiary rounded-5">
              <div className="me-auto p-2">
                <div className="d-flex flex-row gap-2">
                  <div>
                    <img
                      src={item.foodImage || "https://via.placeholder.com/150"}
                      alt={item.foodName}
                      className="checkoutCartImage rounded-5 img-fluid"
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
              <div className="p-2 ">
                <div className="d-flex justify-content-end ">
                  <div className="d-flex flex-nowrap flex-column  align-items-center">
                    <p className="p-0 m-0 fw-bold">Add One More</p>
                    <button 
                      className="cartbutton-checkout rounded-3 bg-warning "
                      onClick={() => handleQuantityUpdate(item.foodId, "increment")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="d-flex justify-content-end">
                  <div className="d-flex flex-nowrap flex-column align-items-center">
                    <p className="p-0 m-0 fw-bold">Remove</p>
                    <button 
                      className="cartbutton-checkout rounded-3 bg-warning"
                      onClick={() => handleQuantityUpdate(item.foodId, "decrement")}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
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
        </div>
        <div className="col-md-4">
          <div className="d-flex flex-column align-items-center shadow-lg p-3 bg-body-tertiary rounded-4">
          <div className="d-flex flex-nowrap"><p className="fs-4 fw-bold">Total Price :</p>
            <p className="fs-4 fw-bold">₹{cart?.totalPrice}</p></div>
            <div className="d-flex flex-nowrap"><p className="fw-bold fs-3">Final Price :</p>
            <p className="fs-3 fw-bold">₹{cart?.totalPrice}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;