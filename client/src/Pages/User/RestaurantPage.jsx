import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import RestaurantPageItemCard from "../../Components/User/RestaurantPageItemCard.jsx";
import { useParams } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import { motion } from "framer-motion";
import { FiStar, FiMail, FiMenu } from "react-icons/fi";

// Styled components
const RestaurantContainer = styled(Container)`
  padding: 2rem 1rem;
  max-width: 1400px;
`;

const RestaurantHeader = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const RestaurantImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  
  @media (min-width: 768px) {
    width: 300px;
    height: auto;
  }
`;

const RestaurantInfo = styled.div`
  padding: 2rem;
  flex: 1;
`;

const RestaurantName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const RestaurantDetail = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const RatingText = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffc107;
`;

const MenuTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #2d3748;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: #ffc107;
    border-radius: 2px;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const EmptyMenu = styled.p`
  text-align: center;
  color: #718096;
  grid-column: 1 / -1;
  padding: 2rem;
`;

function RestaurantPage() {
  const { id } = useParams();
  const [datarest, isLoading, error] = useFetch(`/restaurant/id/${id}`);
  const restaurant = datarest?.findRestaurant || {};

  if (isLoading) {
    return (
      <RestaurantContainer className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </RestaurantContainer>
    );
  }

  if (error) {
    return (
      <RestaurantContainer className="text-center py-5">
        <p className="text-danger">Error loading restaurant: {error.message}</p>
      </RestaurantContainer>
    );
  }

  return (
    <RestaurantContainer fluid>
      {/* Restaurant Header */}
      <RestaurantHeader
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RestaurantImage
          src={restaurant.image}
          alt={restaurant.name}
        />
        
        <RestaurantInfo>
          <RestaurantName>{restaurant.name}</RestaurantName>
          
          <RestaurantDetail>
            <FiMail /> Support: {restaurant.contactEmail || "N/A"}
          </RestaurantDetail>
          
          <RestaurantDetail>
            <FiMenu /> Menu Items: {restaurant.menu?.length || 0}
          </RestaurantDetail>
          
          <RatingContainer>
            <FiStar color="#ffc107" size={20} />
            <RatingText>{restaurant.rating || "N/A"}</RatingText>
          </RatingContainer>
        </RestaurantInfo>
      </RestaurantHeader>

      {/* Menu Section */}
      <MenuTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Our Menu
      </MenuTitle>

      <MenuGrid>
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
          <EmptyMenu>No menu items available</EmptyMenu>
        )}
      </MenuGrid>
    </RestaurantContainer>
  );
}

export default RestaurantPage;