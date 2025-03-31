import React from 'react';
import '../../PageStyle/CardHover.css';
import { Button } from 'react-bootstrap';
import Popup from './Popup.jsx';
import { useState } from "react";

const ProductCard = (props) => {
   const [cart, setCart] = useState({
      foodId: props.foodId,
      restaurantId: props.restaurantId,
      quantity: 1, 
    });
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
  
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
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
  }
  const closePopup = () => {
    setShowSuccess(false);
    setError("");
  };


  return (
    <div className="product-card">
      <div className="product-wrapper">
        <img 
          src={props.image} 
          alt={props.ProductCard} 
          className="product-image" 
          loading="lazy" // Add lazy loading
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{props.ProductCard}</h3>
        <p className="product-description" title={props.desc}>
          {props.desc}
        </p>
        <p className="product-price">${props.price.toFixed(2)}</p>
      </div>
      <Button
            variant="warning"
            className="px-4 add-to-cart-btn"
            id="app"
            onClick={handleAddToCart}
            disabled={loading} 
          >
            {loading ? "Adding..." : "Add To Cart"}
          </Button>
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
    </div>
  );
};

export default ProductCard;