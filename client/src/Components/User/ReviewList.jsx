import React from "react";
import styled, { css } from "styled-components";
import { FaStar, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const theme = {
  colors: {
    primary: "#4f46e5",
    textDark: "#1e293b",
    textMedium: "#475569",
    textLight: "#64748b",
    border: "#e2e8f0",
    accent: "#f59e0b",
    background: "#f8fafc",
    white: "#ffffff",
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};

const ReviewContainer = styled(motion.div)`
 background: linear-gradient(135deg, #ffc107 0%,rgb(219, 217, 213) 100%);
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing.xl};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${theme.shadows.lg};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const ReviewHeader = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin: 0;

  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: ${theme.colors.primary};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'%3E%3C/path%3E%3C/svg%3E") no-repeat center;
  }
`;

const WriteReviewButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReviewListWrapper = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
`;

const ReviewItem = styled(motion.div)`
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md} 0;
  display: grid;
  gap: ${theme.spacing.sm};
  grid-template-areas:
    "user rating"
    "comment comment"
    "date date";
  grid-template-columns: 1fr auto;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    grid-template-areas:
      "user"
      "rating"
      "comment"
      "date";
    grid-template-columns: 1fr;
  }
`;

const ReviewUser = styled.span`
  font-weight: 600;
  color: ${theme.colors.textDark};
  grid-area: user;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.accent};
  grid-area: rating;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FaStar)`
  color: ${props => props.$filled ? theme.colors.accent : theme.colors.border};
`;

const ReviewComment = styled.p`
  color: ${theme.colors.textMedium};
  margin: 0;
  grid-area: comment;
  line-height: 1.6;
`;

const ReviewDate = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textLight};
  grid-area: date;
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.textLight};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
`;

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function renderStars(rating) {
  return Array(5).fill(0).map((_, i) => (
    <Star 
      key={i} 
      size={14} 
      $filled={i < Math.floor(rating)}
    />
  ));
}

function ReviewList({ reviews = [], onWriteReview }) {
  const navigate = useNavigate();
  
  const handleWriteReview = () => {
    if (onWriteReview) {
      onWriteReview();
    } else {
      // Default behavior if no handler provided
      navigate("/user/orders");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ReviewContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <HeaderContainer>
        <ReviewHeader>Customer Reviews</ReviewHeader>
        <WriteReviewButton onClick={handleWriteReview}>
          <FaPen size={14} />
          Write a Review
        </WriteReviewButton>
      </HeaderContainer>
      
      <ReviewListWrapper>
        {reviews.length === 0 ? (
          <EmptyState>
            <p>No reviews yet. Be the first to review!</p>
            <WriteReviewButton onClick={handleWriteReview}>
              <FaPen size={14} />
              Write a Review
            </WriteReviewButton>
          </EmptyState>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.2 }}
            >
              <ReviewUser>{review.user?.name || "Anonymous"}</ReviewUser>
              
              <ReviewRating>
                <RatingStars>
                  {renderStars(review.rating)}
                </RatingStars>
                <span>{review.rating.toFixed(1)}</span>
              </ReviewRating>
              
              <ReviewComment>{review.comment}</ReviewComment>
              
              <ReviewDate>
                {formatDate(review.createdAt)}
              </ReviewDate>
            </ReviewItem>
          ))
        )}
      </ReviewListWrapper>
    </ReviewContainer>
  );
}

export default ReviewList;