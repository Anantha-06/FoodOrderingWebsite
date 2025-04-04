import React from "react";
import HomepageCarousel from "../../Components/User/HomepageCarousel.jsx";
import BestSellerSlider from "../../Components/User/BestSellerSlider.jsx";
import RestaurantCard from "../../Components/User/RestaurantCard.jsx";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";

function Homepage() {
  const [data, isLoading, error] = useFetch("/restaurant/all");
  const restaurants = data?.restaurant || [];

  if (isLoading) {
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="loader"></div>
  </div>
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <p className="text-danger">⚠️ Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="backgroundGradient">
      <HomepageCarousel />
      <BestSellerSlider />

      <Container fluid className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center fs-1 fw-bold mb-4">🍽️ Restaurants</p>
        </motion.div>

        <Row className="g-4">
          {restaurants.map((item, index) => (
            <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <RestaurantCard
                  title={item.name}
                  image={item.image}
                  status={item.isOpen ? "Open" : "Closed"}
                  id={item._id}
                  rating={item.rating}
                />
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
