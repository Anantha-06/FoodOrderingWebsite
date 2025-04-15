import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
  max-height: 800px;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin: 2rem 0;

  @media (max-width: 768px) {
    height: 50vh;
    border-radius: 0;
    margin: 0;
  }
`;

const Slide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: ${fadeIn} 0.5s ease-in;

  &.active {
    opacity: 1;
    z-index: 1;
  }
`;

const SlideContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SlideTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SlideDescription = styled.p`
  font-size: 1.2rem;
  max-width: 60%;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 1rem;
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 3;
  padding: 0 1rem;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
`;

const Indicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: white;
    transform: scale(1.2);
  }

  &:hover {
    background: white;
  }

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const slides = [
  {
    id: 1,
    imageUrl: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344757/3015488-hd_1920_1080_24fps_bxngj2.gif",
    title: "Delicious Food Delivered Fast",
    description: "Get your favorite meals in under 30 minutes or it's free!"
  },
  {
    id: 2,
    imageUrl: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344884/3195347-uhd_3840_2160_25fps_fpmiqw.gif",
    title: "Exclusive Chef Specials",
    description: "Try our limited-time dishes created by top chefs"
  },
  {
    id: 3,
    imageUrl: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743344617/1908426-uhd_3840_2160_25fps_jekqvz.gif",
    title: "Healthy Meal Options",
    description: "Discover our nutritious and delicious healthy menu"
  },
  {
    id: 4,
    imageUrl: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743345703/Untitled_design_1_jek4od.gif",
    title: "Family Feast Deals",
    description: "Special discounts for family-sized orders"
  },
  {
    id: 5,
    imageUrl: "https://res.cloudinary.com/dzmymp0yf/image/upload/v1743345857/Untitled_design_2_aybhb8.gif",
    title: "24/7 Delivery Service",
    description: "Craving something at 3am? We've got you covered"
  }
];

function HomepageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const startAutoPlay = () => {
    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => {
      goToNext();
    }, 4000);
    setIntervalId(id);
  };

  const stopAutoPlay = () => {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
  };

  React.useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [currentSlide, isAutoPlaying]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <CarouselContainer
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <Slide
          key={slide.id}
          className={index === currentSlide ? "active" : ""}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <SlideContent>
            <SlideTitle>{slide.title}</SlideTitle>
            <SlideDescription>{slide.description}</SlideDescription>
          </SlideContent>
        </Slide>
      ))}

      <Controls>
        <ControlButton onClick={goToPrev}>
          <FaChevronLeft size={24} />
        </ControlButton>
        <ControlButton onClick={goToNext}>
          <FaChevronRight size={24} />
        </ControlButton>
      </Controls>

      <Indicators>
        {slides.map((slide, index) => (
          <Indicator
            key={slide.id}
            className={index === currentSlide ? "active" : ""}
            onClick={() => goToSlide(index)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
}

export default HomepageCarousel;