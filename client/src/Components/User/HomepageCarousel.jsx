import React from "react";
import { Carousel } from "react-bootstrap";
import "../../App.css";

function HomepageCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742383616/Food%20Order%20Website/qjusdvpze3heuim4svg3.jpg"
          className="carousel-image"
          alt="Slider Image 1"
        />
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742383616/Food%20Order%20Website/jhvy6ffy9hr2lex4hrnu.jpg"
          className="carousel-image"
          alt="Slider Image 2"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742383617/Food%20Order%20Website/jefiatfmwtyvzcivxfha.jpg"
          className="carousel-image"
          alt="Slider Image 3"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default HomepageCarousel;
