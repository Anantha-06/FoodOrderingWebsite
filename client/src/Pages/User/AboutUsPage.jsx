import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <Container className="bg-warning p-5 rounded" fluid>
      <Row className="justify-content-center">
        <Col md={8}>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-lg border-0 rounded text-center p-4 bg-light">
              <Card.Img
                variant="top"
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/mclfsqrveij9wxrgs0pg.jpg" 
                alt="About Byteeats"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-dark fw-bold display-5">Welcome to Byteeats</Card.Title>
                <Card.Text className="text-muted fs-5">
                  Your ultimate destination for delicious and convenient food delivery.
                  Satisfy your cravings with just a few clicks and experience hassle-free ordering
                  from top restaurants near you!
                </Card.Text>
                <Button variant="dark" size="lg" className="rounded-pill shadow-sm" href="/">Order Now</Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Our Services Section */}
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-lg border-0 rounded text-center p-4 bg-light">
              <Card.Img
                variant="top"
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/hklcq94veofa8tcw2osh.jpg"
                alt="Our Services"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-dark fw-bold display-5">Why Choose Byteeats?</Card.Title>
                <Card.Text className="text-muted fs-5">
                  <ul className="list-unstyled">
                    <li>🍽️ Wide variety of cuisines</li>
                    <li>🚀 Super-fast delivery</li>
                    <li>💰 Exclusive discounts and deals</li>
                    <li>📍 Real-time order tracking</li>
                    <li>📞 24/7 customer support</li>
                  </ul>
                </Card.Text>
                <Button variant="dark" size="lg" className="rounded-pill shadow-sm" href="/">Explore Restaurants</Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Faster & Secure Section */}
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 1.1 }}
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-lg border-0 rounded text-center p-4 bg-light">
              <Card.Img
                variant="top"
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742453667/Food%20Order%20Website/About%20Us/f4idwgcvk5du11cgcwe5.jpg"
                alt="Faster & Secure"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-dark fw-bold display-5">Fast & Secure Ordering</Card.Title>
                <Card.Text className="text-muted fs-5">
                  Your safety and convenience are our top priorities:
                  <ul className="list-unstyled">
                    <li>⚡ Quick and seamless checkout</li>
                    <li>🔒 Secure payment gateways</li>
                    <li>✅ Verified restaurants for quality assurance</li>
                    <li>🛡️ Advanced data protection</li>
                    <li>📦 Contactless delivery options</li>
                  </ul>
                </Card.Text>
                <Button variant="dark" size="lg" className="rounded-pill shadow-sm" href="/">Start Ordering</Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
