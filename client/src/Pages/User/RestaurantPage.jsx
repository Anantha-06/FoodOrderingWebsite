import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import "../../App.css";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";

function RestaurantPage() {
  let { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || [];

  return (
    <Container fluid>
      <div className="my-5 shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
        <Row>
          <Col sm={6} className="d-flex justify-content-center align-items-center">
            <img
              src={restaurant.image}
              className="restaurant-image rounded-4"
              alt={restaurant.name}
            />
          </Col>
          <Col sm={6} className="d-flex flex-column justify-content-center align-items-start">
            <div>
              <p className="fs-2 fw-bold">{restaurant.name}</p>
            </div>
            <div className="d-flex flex-row flex-nowrap gap-3">
              <p className="fs-5">{restaurant.rating}</p>
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742377549/Food%20Order%20Website/crk2gldxuwtl8rqp5afi.png"
                className="page-review"
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
        <div className="my-5">
          <p className="fs-1 fw-bold text-center secondHeader">Best In The BYTEEATS</p>
        </div>
        <Container>
          {restaurant.menu?.length > 0 ? (
            restaurant.menu.map((item) => (
              <div key={item._id}>
                <RestaurantPageItemCard
                  image={item.image}
                  desc={item.description}
                  price={item.price}
                  heading={item.name}
                  foodId={item._id}
                  restaurantId={restaurant._id}
                />
              </div>
            ))
          ) : (
            <p className="text-center">No menu items available</p>
          )}
        </Container>
      </div>
    </Container>
  );
}

export default RestaurantPage;