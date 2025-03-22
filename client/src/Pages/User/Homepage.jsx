import React from "react";
import HomepageCarousel from "../../Components/User/HomepageCarousel.jsx";
import BestSellerSlider from "../../Components/User/BestSellerSlider.jsx";
import RestaurantCard from "../../Components/User/RestaurantCard.jsx";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";

function Homepage() {
  const [data, isLoading, error] = useFetch("/restaurant/all");
  const restaurants = data?.restaurant || [];
  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <p className="text-danger">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="backgroundGradient">
        <HomepageCarousel />
        <BestSellerSlider />
        <Container fluid>
          <Row>
            <p className="text-center my-5 fs-1 fw-bold">Restaurants</p>
            {restaurants.map((item) => (
              <Col xs={12} sm={6} md={4} lg={3} key={item._id}>
                <RestaurantCard
                  title={item.name}
                  image={item.image}
                  status={item.isOpen ? "Open" : "Closed"}
                  id={item._id}
                  rating={item.rating}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Homepage;
