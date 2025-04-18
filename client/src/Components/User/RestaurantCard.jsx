import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import useFetch from "../../Hooks/UseFetch.jsx"; // Adjust the path as needed

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => props.theme === 'veg' ? '#4CAF50' : '#F44336'};
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  color: #718096;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  background: #f7fafc;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  margin-right: 0.8rem;
`;

const RatingIcon = styled(FaStar)`
  color: #f6ad55;
  margin-right: 0.3rem;
`;

const RatingText = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

const Tag = styled.span`
  background: #edf2f7;
  color: #4a5568;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

function RestaurantCard({ id, image, title, cuisine, deliveryTime, distance, isVeg, status }) {
  const [reviewsData, isLoading, error] = useFetch(`/review/${id}/all`);
  const isOpen = status === "Open";
  const CardWrapper = isOpen ? CardLink : 'div';

  const averageRating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || 0;

  return (
    <CardWrapper to={isOpen ? `/user/restaurant/${id}` : undefined} style={{ cursor: isOpen ? "pointer" : "not-allowed" }}>
      <CardContainer style={{ opacity: isOpen ? 1 : 0.5 }}>
        <ImageContainer>
          <CardImage src={image} alt={title} />
          {!isOpen && (
            <Badge>
              <Tag style={{ background: "#e53e3e", color: "white", marginTop: "1rem", textAlign: "center", width: "fit-content" }}>
                Closed
              </Tag>
            </Badge>
          )}
        </ImageContainer>

        <CardContent>
          <CardTitle>{title}</CardTitle>

          <MetaContainer>
            <Rating>
              <RatingIcon />
              <RatingText>{averageRating.toFixed(1)}</RatingText>
              {totalReviews > 0 && (
                <span style={{ marginLeft: '0.5rem', color: '#718096', fontSize: '0.8rem' }}>
                  ({totalReviews} reviews)
                </span>
              )}
            </Rating>
          </MetaContainer>
        </CardContent>
      </CardContainer>
    </CardWrapper>
  );
}

export default RestaurantCard;
