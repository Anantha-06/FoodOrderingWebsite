import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import "../../App.css";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import { motion } from "framer-motion";

function RestaurantPage() {
  let { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || [];

  return (
    <Container fluid>
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="my-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded-5"
      >
        <Row>
          <Col sm={6} className="d-flex justify-content-center align-items-center">
            <motion.img
              src={restaurant.image}
              className="restaurant-image rounded-4"
              alt={restaurant.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </Col>
          <Col sm={6} className="d-flex flex-column justify-content-center align-items-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <p className="fs-2 fw-bold">{restaurant.name}</p>
            </motion.div>
            <motion.div className="d-flex flex-row flex-nowrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="fs-5">{restaurant.rating}</p>
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742377549/Food%20Order%20Website/crk2gldxuwtl8rqp5afi.png"
                className="page-review"
              />
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
        <div className="my-5">
          <p className="fs-1 fw-bold text-center secondHeader">Best In The BYTEEATS</p>
        </div>
        <Container>
          {restaurant.menu?.length > 0 ? (
            restaurant.menu.map((item, index) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <RestaurantPageItemCard
                  image={item.image}
                  desc={item.description}
                  price={item.price}
                  heading={item.name}
                  foodId={item._id}
                  restaurantId={restaurant._id}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center">No menu items available</p>
          )}
        </Container>
      </motion.div>
    </Container>
  );
}

export default RestaurantPage;