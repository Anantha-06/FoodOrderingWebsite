import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';


const brandLogo = 'https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png';
const sadRobot = 'https://res.cloudinary.com/dzmymp0yf/image/upload/v1743913022/Food%20Order%20Website/New%20Image%20for%20login/wuprnvu6bdkajbaukiq1.jpg';

const ErrorPage = () => {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);

  const handleGoHome = () => {
  
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      startX: Math.random() * window.innerWidth,
      endX: (Math.random() - 0.5) * 200,
      duration: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 75%)`,
      size: Math.random() * 8 + 5,
      borderRadius: Math.random() > 0.5 ? '50%' : '0',
      rotation: Math.random() * 360
    }));
    
    setConfetti(newConfetti);
    navigate("/user/login");
    setTimeout(() => window.location.reload(), 500)
  };

  return (
    <ErrorContainer >
      {confetti.map((piece) => (
        <ConfettiPiece key={piece.id} {...piece} />
      ))}
      
      <BrandLogo src={brandLogo} alt="ByteEats Logo" />
      
      <ErrorCard>
        <ErrorImage src={sadRobot} alt="Sad Robot" className='rounded'/>
        <Title>Oops! Something Went Wrong</Title>
        <Message>
          Our robot chef dropped your order! Don't worry, we've sent our repair bots to fix the issue.
        </Message>
        <Message>
          While we get things back on track, why not return to the homepage?
        </Message>
        <HomeButton onClick={handleGoHome}>Take Me Home</HomeButton>
      </ErrorCard>
    </ErrorContainer>
  );
};

// Styled components
const ErrorContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  background-color: #f5f6fa;
  color: #2d3436;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background-image: radial-gradient(
    circle at 10% 20%,
    rgba(166, 177, 255, 0.1) 0%,
    rgba(166, 177, 255, 0.1) 90%
  );
  position: relative;
  overflow: hidden;
`;

const BrandLogo = styled.img`
  position: absolute;
  top: 30px;
  left: 30px;
  height: 50px;
  width: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 40px;
    top: 20px;
    left: 20px;
  }
`;

const ErrorCard = styled.div`
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: 30px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  }
`;

const ErrorImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
  filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-20px);}
  60% {transform: translateY(-10px);}
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2d3436;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 15px;
  line-height: 1.6;
  color: #636e72;
`;

const shine = keyframes`
  from { left: -100%; }
  to { left: 100%; }
`;

const HomeButton = styled.button`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(108, 92, 231, 0.4);
  }

  &:active {
    transform: translateY(1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    animation: ${shine} 1.5s;
  }
`;

const fall = keyframes`
  from { transform: translateY(0) rotate(0deg); opacity: 1; }
  to { transform: translateY(${window.innerHeight}px) rotate(var(--rotation)); opacity: 0; }
`;

const ConfettiPiece = styled.div.attrs(props => ({
  style: {
    '--rotation': `${props.rotation}deg`,
    '--duration': `${props.duration}s`,
    '--color': props.color,
    '--size': `${props.size}px`,
    '--border-radius': props.borderRadius,
    '--left': `${props.startX}px`,
  },
}))`
  position: absolute;
  left: var(--left);
  top: -10px;
  width: var(--size);
  height: var(--size);
  background-color: var(--color);
  border-radius: var(--border-radius);
  opacity: 1;
  z-index: 0;
  animation: ${fall} var(--duration) cubic-bezier(0.1, 0.8, 0.9, 1) forwards;
`;

export default ErrorPage;