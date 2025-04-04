import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import { motion } from "framer-motion";

function RestaurantPage() {
  const { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || {};

  const defaultImage =
    "https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png";

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-around align-items-center shadow-lg bg-body-tertiary rounded-4 my-5 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={restaurant.image || defaultImage}
          className="restaurant-image rounded mb-3 mb-md-0"
          alt={restaurant.name}
          style={{ width: "250px", height: "auto", objectFit: "cover" }}
        />

        <div className="d-flex flex-column align-items-start gap-2 px-3">
          <p className="fs-2 fw-bold text-wrap">{restaurant.name}</p>
          <p className="mb-0">📧 Support: {restaurant.contactEmail || "N/A"}</p>
          <p className="mb-0 fw-bold">
            📝 Menus: {restaurant.menu?.length || 0}
          </p>
          <div className="d-flex align-items-center gap-2">
            <p className="fs-5 mb-0">⭐ {restaurant.rating || "N/A"}</p>
            <img
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742377549/Food%20Order%20Website/crk2gldxuwtl8rqp5afi.png"
              className="page-review"
              style={{ width: "25px", height: "25px" }}
              alt="Rating"
            />
          </div>
        </div>
      </motion.div>

      {/* Menu Title */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="fs-1 fw-bold secondHeader">🔥 Best In The BYTEEATS 🔥</p>
      </motion.div>

      {/* Menu Items */}
      <Container fluid>
        <Row className="  gap-4">
          <div className="d-flex flex-row  flex-wrap justify-content-center align-items-center gap-2">
          {restaurant.menu?.length > 0 ? (
            restaurant.menu.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <RestaurantPageItemCard
                  image={item.image}
                  desc={item.description}
                  price={item.price}
                  ProductCard={item.name}
                  foodId={item._id}
                  restaurantId={restaurant._id}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted">No menu items available</p>
          )}
          </div>
        </Row>
      </Container>
    </Container>
  );
}

export default RestaurantPage;
