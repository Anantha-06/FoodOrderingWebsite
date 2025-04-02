import React from "react";
import { Carousel } from "react-bootstrap";
import "../../App.css";

function HomepageCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={4000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344757/3015488-hd_1920_1080_24fps_bxngj2.gif"
          className="carousel-image"
          alt="Slider Image 1"
        />
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344884/3195347-uhd_3840_2160_25fps_fpmiqw.gif"
          className="carousel-image"
          alt="Slider Image 2"
        />
      </Carousel.Item>
      <Carousel.Item interval={1000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344617/1908426-uhd_3840_2160_25fps_jekqvz.gif"
          className="carousel-image"
          alt="Slider Image 3"
        />
      </Carousel.Item>
      <Carousel.Item interval={1000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743345703/Untitled_design_1_jek4od.gif"
          className="carousel-image"
          alt="Slider Image 4"
        />
      </Carousel.Item>
      <Carousel.Item interval={1000}>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743345857/Untitled_design_2_aybhb8.gif"
          className="carousel-image"
          alt="Slider Image 5"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default HomepageCarousel;
