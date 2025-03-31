import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import { motion } from "framer-motion";

function RestaurantPage() {
  let { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || [];

  return (
    <Container fluid>
      
        <div className="d-flex flex-row justify-content-around align-items-center shadow-lg bg-outlined rounded-4 my-5 p-3">
          <div
                    className="d-flex justify-content-center align-items-center "
          >
            <img
              src={restaurant.image}
              className="restaurant-image rounded"
              alt={restaurant.name}
            />
          </div>
          <div
     
            className="d-flex flex-column justify-content-center align-items-start"
          >
            <div
            >
              <p className="fs-2 fw-bold">{restaurant.name}</p>
            </div>
            <div
              className="d-flex flex-row flex-nowrap gap-3"
            >
              <p className="fs-5">{restaurant.rating}</p>
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742377549/Food%20Order%20Website/crk2gldxuwtl8rqp5afi.png"
                className="page-review"
              />
          
          </div>
        </div>
      </div>

      <div
        className=""
      >
        <div className="">
          <p className="fs-1 fw-bold text-center secondHeader">
            Best In The BYTEEATS
          </p>
        </div>
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center my-5 flex-wrap gap-2">
            {restaurant.menu?.length > 0 ? (
              restaurant.menu.map((item, index) => (
                <RestaurantPageItemCard
                  image={item.image}
                  desc={item.description}
                  price={item.price}
                  ProductCard={item.name}
                  foodId={item._id}
                  restaurantId={restaurant._id}
                  key={item._id}
                />
              ))
            ) : (
              <p className="text-center">No menu items available</p>
            )}
          </div>
        </Container>
      </div>
    </Container>
  );
}

export default RestaurantPage;
