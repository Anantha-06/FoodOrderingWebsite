import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetch from "../../Hooks/UseFetch.jsx";

const Container = styled.div`
  padding: 3rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: #3b82f6;
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 1rem;
  
  transition: all 0.3s ease;
  text-align: center;
  height: 100%;
  &:hover {
    transform: translateY(-5px);
   
  }
`;

const ProductImage = styled.div`
  width: 180px;
  height: 180px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid;
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${ProductCard}:hover & {
    border-color: #3b82f6;
    transform: scale(1.05);
  }
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  color: #f59e0b;
  margin-bottom: 1rem;
`;

const AddToCartButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;
  color: #3b82f6;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  &.next {
    right: -20px;
  }

  &.prev {
    left: -20px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ef4444;
  padding: 2rem;
  font-size: 1.1rem;
`;

const BestSellerSlider = () => {
  const [data, isLoading, error] = useFetch("/menu/all");
  const productList = data?.menuItems || [];

  const NextArrow = ({ onClick }) => (
    <ArrowButton className="next" onClick={onClick}>
      <FaArrowRight />
    </ArrowButton>
  );

  const PrevArrow = ({ onClick }) => (
    <ArrowButton className="prev" onClick={onClick}>
      <FaArrowLeft />
    </ArrowButton>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (error) {
    console.error("Fetch Error:", error);
    return <ErrorMessage>Error loading best sellers: {error.message}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <Title>Our Best Sellers</Title>
        <Subtitle>Discover our most loved menu items that customers keep coming back for</Subtitle>
      </Header>

      {productList.length > 0 ? (
        <Slider {...settings}>
          {productList.map((item) => (
            <ProductCard key={item._id}>
              <ProductImage>
                <img src={item.image} alt={item.name} />
              </ProductImage>
              <ProductName>{item.name}</ProductName>
            </ProductCard>
          ))}
        </Slider>
      ) : (
        <ErrorMessage>No bestsellers available at the moment.</ErrorMessage>
      )}
    </Container>
  );
};

export default BestSellerSlider;