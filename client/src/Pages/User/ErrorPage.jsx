import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../PageStyle/ErrorPage.css'; 

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container className="error-page text-center py-5">
      <div className="error-content">
        <img 
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20Login/zjbubfxtliury2rhjoif.png" 
          alt="Brand Logo" 
          className="brand-logo mb-4 shake-animation"
        />
        <h1 className="display-1 text-danger mb-3 fade-in">404</h1>
        <h2 className="mb-3 slide-in">Oops! Page Not Found</h2>
        <p className="lead mb-4 bounce-in">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => navigate('/')}
          className="pulse-animation"
        >
          Go Back Home
        </Button>
        <p className="mt-3 text-muted">
          You will be automatically redirected in 8 seconds...
        </p>
      </div>
    </Container>
  );
};

export default ErrorPage;