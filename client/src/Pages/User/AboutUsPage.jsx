import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaUtensils, 
  FaRocket, 
  FaPercent, 
  FaMapMarkerAlt, 
  FaHeadset,
  FaShieldAlt,
  FaCreditCard,
  FaCheckCircle,
  FaUserShield,
  FaTruck
} from "react-icons/fa";

const AboutContainer = styled.div`
  padding: 4rem 0;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 3rem;
  transition: all 0.3s ease;
`;

const FeatureImage = styled.div`
  width: 100%;
  height: 400px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${FeatureCard}:hover & img {
    transform: scale(1.05);
  }
`;

const FeatureContent = styled.div`
  padding: 2.5rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
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

const Description = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: #4a5568;
  padding: 0.8rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-3px);
  }

  svg {
    color: #3b82f6;
    font-size: 1.5rem;
  }
`;

const CTAButton = styled(motion.button)`
  background: #ffc107;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const AboutUs = () => {
  return (
    <AboutContainer>
      <SectionContainer>
        {/* Welcome Section */}
        <FeatureCard
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FeatureImage>
            <img 
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/mclfsqrveij9wxrgs0pg.jpg" 
              alt="About Byteeats" 
            />
          </FeatureImage>
          <FeatureContent>
            <Title>Welcome to Byteeats</Title>
            <Description>
              Your ultimate destination for delicious and convenient food delivery. 
              Satisfy your cravings with just a few clicks and experience hassle-free 
              ordering from top restaurants near you!
            </Description>
            <Link to="/user/homepage">
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Now
              </CTAButton>
            </Link>
          </FeatureContent>
        </FeatureCard>

        {/* Why Choose Us Section */}
        <FeatureCard
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FeatureImage>
            <img 
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/hklcq94veofa8tcw2osh.jpg" 
              alt="Our Services" 
            />
          </FeatureImage>
          <FeatureContent>
            <Title>Why Choose Byteeats?</Title>
            <Description>
              Enjoy top-quality services with the best food delivery experience.
            </Description>
            <FeatureList>
              <FeatureItem>
                <FaUtensils />
                <span>Wide variety of cuisines</span>
              </FeatureItem>
              <FeatureItem>
                <FaRocket />
                <span>Super-fast delivery</span>
              </FeatureItem>
              <FeatureItem>
                <FaPercent />
                <span>Exclusive discounts</span>
              </FeatureItem>
              <FeatureItem>
                <FaMapMarkerAlt />
                <span>Real-time tracking</span>
              </FeatureItem>
              <FeatureItem>
                <FaHeadset />
                <span>24/7 support</span>
              </FeatureItem>
            </FeatureList>
            <Link to="/user/homepage">
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Restaurants
              </CTAButton>
            </Link>
          </FeatureContent>
        </FeatureCard>

        {/* Fast & Secure Section */}
        <FeatureCard
          whileHover={{ y: -5 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FeatureImage>
            <img 
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/f4idwgcvk5du11cgcwe5.jpg" 
              alt="Fast & Secure" 
            />
          </FeatureImage>
          <FeatureContent>
            <Title>Fast & Secure Ordering</Title>
            <Description>
              Your safety and convenience are our top priorities:
            </Description>
            <FeatureList>
              <FeatureItem>
                <FaTruck />
                <span>Quick checkout</span>
              </FeatureItem>
              <FeatureItem>
                <FaCreditCard />
                <span>Secure payments</span>
              </FeatureItem>
              <FeatureItem>
                <FaCheckCircle />
                <span>Verified restaurants</span>
              </FeatureItem>
              <FeatureItem>
                <FaUserShield />
                <span>Data protection</span>
              </FeatureItem>
              <FeatureItem>
                <FaShieldAlt />
                <span>Contactless delivery</span>
              </FeatureItem>
            </FeatureList>
            <Link to="/user/homepage">
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Ordering
              </CTAButton>
            </Link>
          </FeatureContent>
        </FeatureCard>
      </SectionContainer>
    </AboutContainer>
  );
};

export default AboutUs;