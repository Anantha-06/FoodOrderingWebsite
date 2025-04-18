import React from "react";
import { Container, Row } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import ReviewList from "../../Components/User/ReviewList.jsx";

function RestaurantPage() {
  const { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || {};

  const [reviewData] = useFetch(`/review/${id}/all`);
  const averageRating = reviewData?.averageRating || 0;
  const totalReviews = reviewData?.totalReviews || 0;

  return (
    <Container  className="py-4">
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-around align-items-center  rounded-4 my-5 p-4 restaurant-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={restaurant.image}
          className="restaurant-image rounded mb-3 mb-md-0"
          alt={restaurant.name}
          style={{ width: "250px", height: "auto", objectFit: "cover" }}
        />

        <div className="d-flex flex-column align-items-start gap-2 px-3">
          <p className="fs-2 fw-bold text-wrap">{restaurant.name}</p>
          <p className="mb-0">📧 Support: {restaurant.contactEmail || "N/A"}</p>
          <p className="mb-0 fw-bold">📝 Menus: {restaurant.menu?.length || 0}</p>

          <div className="d-flex align-items-center gap-2">
            <FaStar style={{ color: "#f6ad55" }} />
            <span className="fs-5 fw-semibold">{averageRating.toFixed(1)}</span>
            {totalReviews > 0 && (
              <span className="text-muted fs-6">({totalReviews} reviews)</span>
            )}
           
          </div>
        </div>
      </motion.div>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="fs-1 fw-bold secondHeader">🔥 Best In The BYTEEATS 🔥</p>
      </motion.div>

      <Container fluid>
        <Row className="gap-4">
          <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-2">
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
      <Container fluid className="my-4">
  <ReviewList reviews={reviewData?.reviews || []} />
</Container>
    </Container>
  );
}

export default RestaurantPage;
