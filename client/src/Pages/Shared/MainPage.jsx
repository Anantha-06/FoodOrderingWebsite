import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MainPage = () => {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <GradientBackground>
      <StyledContainer>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-100"
        >
          <Row className="justify-content-center">
            <Col xs={12} className="text-center mb-5">
              <StyledLogo>
                <motion.img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                  alt="Logo"
                  className="logo-img"
                  variants={itemVariants}
                />
              </StyledLogo>
              <motion.h1 className="mt-3 text-white" variants={itemVariants}>
                Welcome to FoodExpress
              </motion.h1>
              <motion.p className="lead text-light" variants={itemVariants}>
                Choose your role to continue
              </motion.p>
            </Col>
          </Row>

          <Row className="g-4 justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <motion.div variants={itemVariants}>
                <StyledLink to="/user/landingpage">
                  <ActionButton
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    bg="#FF9F1C"
                  >
                    <IconWrapper>
                      <i className="fas fa-user"></i>
                    </IconWrapper>
                    <ButtonText>User</ButtonText>
                  </ActionButton>
                </StyledLink>
              </motion.div>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <motion.div variants={itemVariants}>
                <StyledLink to="/admin/login">
                  <ActionButton
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    bg="#2EC4B6"
                  >
                    <IconWrapper>
                      <i className="fas fa-lock"></i>
                    </IconWrapper>
                    <ButtonText>Admin</ButtonText>
                  </ActionButton>
                </StyledLink>
              </motion.div>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <motion.div variants={itemVariants}>
                <StyledLink to="/restaurant/login">
                  <ActionButton
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    bg="#E71D36"
                  >
                    <IconWrapper>
                      <i className="fas fa-store"></i>
                    </IconWrapper>
                    <ButtonText>Seller</ButtonText>
                  </ActionButton>
                </StyledLink>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </StyledContainer>
    </GradientBackground>
  );
};

// Styled Components
const GradientBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #011627 0%, #2EC4B6 100%);
  display: flex;
  align-items: center;
`;

const StyledContainer = styled(Container)`
  padding: 2rem;
`;

const StyledLogo = styled.div`
  width: 100%;
  img {
    max-width: 100%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.bg};
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ButtonText = styled.span`
  font-size: 1.1rem;
`;

export default MainPage;
