import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;

  text-align: center;
`;

const BrandLogo = styled(motion.img)`
  width: 100%;
  height: 120px;
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const ErrorContent = styled.div`
  max-width: 600px;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ErrorCode = styled(motion.h1)`
  font-size: 6rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ErrorMessage = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2.5rem;
`;

const RedirectTimer = styled(motion.p)`
  font-size: 0.9rem;
  color: #95a5a6;
  margin-top: 1.5rem;
`;

const ActionButton = styled(Button)`
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <ErrorContainer>
      <ErrorContent>
        <BrandLogo
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20Login/zjbubfxtliury2rhjoif.png"
          alt="Brand Logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1,
            rotate: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            },
          }}
        />

        <ErrorCode
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          404
        </ErrorCode>

        <ErrorMessage
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          Oops! Page Not Found
        </ErrorMessage>

        <ErrorDescription
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          Don't worry, we'll help you get back on track.
        </ErrorDescription>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ActionButton variant="warning" onClick={() => navigate("/")}>
            Take Me Home
          </ActionButton>
        </motion.div>

        <RedirectTimer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          You will be automatically redirected in 8 seconds...
        </RedirectTimer>
      </ErrorContent>
    </ErrorContainer>
  );
};

export default ErrorPage;