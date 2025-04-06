import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Carousel,
  Navbar,
  Nav,
  Accordion,
  Spinner,
} from "react-bootstrap";
import "../../App.css";
import useFetch from "../../Hooks/UseFetch.jsx";

function LandingPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse restaurants, select your items, and proceed to checkout. You can pay online or choose cash on delivery.",
    },
    {
      question: "What areas do you deliver to?",
      answer:
        "We currently serve all major neighborhoods in the city. Enter your address to check availability.",
    },
    {
      question: "Can I schedule orders in advance?",
      answer:
        "Yes! During checkout, you can select a future date and time for your delivery.",
    },
  ];

  const [data, isLoading, error] = useFetch("/restaurant/all");
  const restaurants = data?.restaurant || [];

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <div className="loader"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center my-5">
        <p className="text-danger">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="sticky-top  shadow-sm bg-white">
        <Navbar expand="lg" className="py-3 bg-warning">
          <Container>
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png" 
                  height="40"
                  className="d-inline-block align-top"
                  alt="Byteeats logo"
                />
              </motion.div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={"/user/login"} className="me-2">
                    <Button
                      variant="outline-dark"
                      className="rounded-pill px-3 px-lg-4"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={"/user/signup"} className="me-2">
                    <Button
                      variant="outline-light"
                      className="rounded-pill px-3 px-lg-4"
                    >
                      Sign up
                    </Button>
                  </Link>
                </motion.div>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Container
        fluid
        className="landing-page flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center position-relative p-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="background-overlay"
        ></motion.div>
        <section className="hero-section w-100 py-5">
          <Container>
            <Row className="w-100 align-items-center">
              <Col
                md={6}
                className="d-flex flex-column justify-content-center align-items-start px-4 text-md-start"
              >
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="fw-bold display-3 mb-4"
                >
                  Savor Every <span className="text-warning">Byte</span> with
                  Byteeats
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="lead mb-4"
                >
                  Discover culinary delights from the best restaurants in town,
                  delivered fast to your doorstep.
                </motion.p>
                <motion.div className="d-flex gap-3 mt-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={"/user/homepage"}>
                      <Button
                        variant="warning"
                        size="lg"
                        className="rounded-pill px-4 shadow-lg fw-bold"
                      >
                        Order Now
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={"/user/homepage"}>
                      <Button
                        variant="outline-light"
                        size="lg"
                        className="rounded-pill px-4 fw-bold"
                      >
                        Browse Restaurants
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </Col>
              <Col
                md={6}
                className="d-flex justify-content-center align-items-center mt-4 mt-md-0"
              >
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  whileHover={{ scale: 1.02 }}
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743142865/photo-1504674900247-0877df9cc836_unpcz0.avif"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Delicious food"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-4 bg-light w-100">
          <Container>
            <Row className="g-4">
              {[
                { number: "10,000+", label: "Happy Customers" },
                { number: "500+", label: "Restaurant Partners" },
                { number: "98%", label: "Positive Reviews" },
                { number: "30min", label: "Avg. Delivery Time" },
              ].map((stat, index) => (
                <Col md={3} sm={6} key={index}>
                  <motion.div whileHover={{ y: -5 }} className="p-3">
                    <h3 className="text-warning fw-bold">{stat.number}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <section className="py-5 w-100">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold text-dark">Featured Restaurants</h2>
                <p className="text-muted">Explore our top-rated partners</p>
              </Col>
            </Row>
            <Row>
              {restaurants.slice(0, 4).map((restaurant) => (
                <Col md={3} sm={6} key={restaurant._id} className="mb-4">
                  <motion.div whileHover={{ y: -10 }}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Img
                        variant="top"
                        src={restaurant.image}
                        alt={restaurant.name}
                      />
                      <Card.Body>
                        <Card.Title>{restaurant.name}</Card.Title>
                        <Card.Text className="text-muted small">
                          ⭐⭐⭐⭐⭐ ({restaurant.reviewsCount || 120} reviews)
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Link to={"/user/homepage"}>
                <Button variant="outline-dark" className="rounded-pill px-4">
                  View All Restaurants →
                </Button>
              </Link>
            </div>
          </Container>
        </section>
        <section className="py-5 bg-light w-100">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold text-dark">Popular Cuisines</h2>
                <p className="text-muted">
                  Satisfy your cravings with these favorites
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              {[
                { name: "Italian", icon: "🍝" },
                { name: "Indian", icon: "🍛" },
                { name: "Chinese", icon: "🥡" },
                { name: "Mexican", icon: "🌮" },
                { name: "Japanese", icon: "🍣" },
                { name: "American", icon: "🍔" },
                { name: "Thai", icon: "🍜" },
                { name: "Mediterranean", icon: "🥙" },
              ].map((cuisine, index) => (
                <Col md={3} sm={4} xs={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-white rounded-3 shadow-sm text-center"
                  >
                    <div className="display-4 mb-2">{cuisine.icon}</div>
                    <h5>{cuisine.name}</h5>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <section className="py-5 w-100">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold text-warning">Why Choose Byteeats?</h2>
                <p className="lead">
                  We're revolutionizing food delivery with exceptional service
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-3 shadow-sm h-100"
                >
                  <div className="icon-wrapper mb-3">
                    <span className="display-4">🚀</span>
                  </div>
                  <h4>Lightning Fast</h4>
                  <p className="text-muted">
                    Average delivery time under 30 minutes with our optimized
                    routes
                  </p>
                </motion.div>
              </Col>
              <Col md={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-3 shadow-sm h-100"
                >
                  <div className="icon-wrapper mb-3">
                    <span className="display-4">🌟</span>
                  </div>
                  <h4>Premium Selection</h4>
                  <p className="text-muted">
                    Only 4.5+ star rated restaurants make it to our platform
                  </p>
                </motion.div>
              </Col>
              <Col md={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-3 shadow-sm h-100"
                >
                  <div className="icon-wrapper mb-3">
                    <span className="display-4">💳</span>
                  </div>
                  <h4>Flexible Payment</h4>
                  <p className="text-muted">
                    Pay with cards, UPI, or cash on delivery - your choice
                  </p>
                </motion.div>
              </Col>
              <Col md={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-3 shadow-sm h-100"
                >
                  <div className="icon-wrapper mb-3">
                    <span className="display-4">📱</span>
                  </div>
                  <h4>Live Tracking</h4>
                  <p className="text-muted">
                    Real-time updates from kitchen to your doorstep
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-5 w-100">
          <Container className="shadow-lg p-3 mb-5 bg-body-tertiary rounded-5">
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold text-dark">How It Works</h2>
                <p className="text-muted">
                  Get your favorite food in just a few taps
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="d-flex flex-column align-items-center p-4"
                >
                  <div
                    className="step-number mb-3 bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">1</h3>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743142865/photo-1517248135467-4c7edcad34c4_btsrhl.avif"
                    alt="Step 1"
                    className="img-fluid rounded-4 mb-3"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <h5>Choose Your Meal</h5>
                  <p className="text-muted">
                    Browse from 1000+ dishes across various cuisines
                  </p>
                </motion.div>
              </Col>
              <Col md={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="d-flex flex-column align-items-center p-4"
                >
                  <div
                    className="step-number mb-3 bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">2</h3>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743142864/photo-1551218808-94e220e084d2_twrxam.avif"
                    alt="Step 2"
                    className="img-fluid rounded-4 mb-3"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <h5>Place Your Order</h5>
                  <p className="text-muted">
                    Secure checkout with multiple payment options
                  </p>
                </motion.div>
              </Col>
              <Col md={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="d-flex flex-column align-items-center p-4"
                >
                  <div
                    className="step-number mb-3 bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <h3 className="m-0">3</h3>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743142864/photo-1555396273-367ea4eb4db5_jmuucx.avif"
                    alt="Step 3"
                    className="img-fluid rounded-4 mb-3"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <h5>Enjoy Your Food</h5>
                  <p className="text-muted">
                    Track delivery in real-time until it arrives
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Testimonials Section */}
        <section className="py-5 w-100">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold">What Our Customers Say</h2>
                <p className="text-muted">
                  Join thousands of satisfied customers
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Food Blogger",
                  text: "Byteeats has transformed my dining experience! The variety is incredible and delivery is always prompt.",
                  rating: "⭐⭐⭐⭐⭐",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  name: "Michael Chen",
                  role: "Office Worker",
                  text: "As someone who works late, Byteeats is a lifesaver. The food always arrives hot and delicious.",
                  rating: "⭐⭐⭐⭐⭐",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                {
                  name: "Priya Patel",
                  role: "Busy Mom",
                  text: "With two kids at home, cooking isn't always an option. Byteeats gives me back precious time with my family.",
                  rating: "⭐⭐⭐⭐⭐",
                  avatar: "https://randomuser.me/api/portraits/women/63.jpg",
                },
              ].map((testimonial, index) => (
                <Col md={4} key={index}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="p-4 bg-white rounded-3 shadow-sm h-100 d-flex flex-column"
                  >
                    <div className="mb-3 text-warning">
                      {testimonial.rating}
                    </div>
                    <p className="mb-auto">"{testimonial.text}"</p>
                    <div className="mt-4 pt-3 border-top d-flex align-items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h6 className="mb-1 fw-bold">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <section className="py-5 w-100">
          <Container>
            <Row className="mb-5">
              <Col>
                <h2 className="fw-bold text-dark">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted">Find answers to common questions</p>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Accordion defaultActiveKey="0">
                  {faqs.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index}>
                      <Accordion.Header>{faq.question}</Accordion.Header>
                      <Accordion.Body>{faq.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Col>
              <Col md={6}>
                <img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743145334/photo-1606787366850-de6330128bfc_igwbpz.avif"
                  className="img-fluid rounded-4 shadow"
                  alt="Customer support"
                />
                <div className="mt-4 text-center">
                  <h5>Still have questions?</h5>
                  <Button
                    variant="outline-dark"
                    className="rounded-pill px-4 mt-2"
                    href="tel:+4733378901"
                  >
                    Contact Support
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-5 w-100">
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="mb-4 mb-md-0">
                <motion.img
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743142864/photo-1555774698-0b77e0d5fac6_sonufh.avif"
                  className="img-fluid rounded-4 shadow"
                  alt="Byteeats Mobile App"
                />
              </Col>
              <Col md={6}>
                <h2 className="fw-bold text-dark mb-4">Get the Byteeats App</h2>
                <p className="lead mb-4">
                  Download our app for exclusive offers and faster ordering
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                      style={{ height: "50px" }}
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Play Store"
                      style={{ height: "50px" }}
                    />
                  </motion.div>
                </div>
                <div className="mt-4 d-flex gap-3 justify-content-center justify-content-md-start">
                  <div className="text-center">
                    <div className="display-4">📲</div>
                    <small className="text-muted">Scan to download</small>
                  </div>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://byteeats.com/download"
                    alt="QR Code"
                    style={{ height: "80px" }}
                  />
                </div>
                <div className="mt-4">
                  <h5 className="mb-3">App Features:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">✔ Exclusive app-only discounts</li>
                    <li className="mb-2">
                      ✔ Faster checkout with saved preferences
                    </li>
                    <li className="mb-2">✔ Real-time order tracking</li>
                    <li className="mb-2">✔ Easy reordering of favorites</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="py-5  w-100">
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="mb-4 mb-md-0 text-md-start ">
                <h2 className="fw-bold mb-3">Partner with Byteeats</h2>
                <p className="lead">Grow your restaurant business with us</p>
                <ul className="mb-4">
                  <li className="mb-2">Reach thousands of new customers</li>
                  <li className="mb-2">Powerful analytics dashboard</li>
                  <li className="mb-2">Dedicated partner support</li>
                  <li className="mb-2">Marketing and promotional support</li>
                  <li className="mb-2">Easy onboarding process</li>
                </ul>
                <Link to={"/restaurant/signup"}>
                  <Button
                    variant="dark"
                    size="lg"
                    className="rounded-pill px-4 mt-3 fw-bold"
                  >
                    Register Your Restaurant
                  </Button>
                </Link>
                <div className="mt-4">
                  <p className="small mb-1">Already a partner?</p>
                  <Link to={"/restaurant/login"}>
                    <Button
                      variant="warning"
                      size="sm"
                      className="rounded-pill px-3"
                    >
                      Partner Login
                    </Button>
                  </Link>
                </div>
              </Col>
              <Col md={6}>
                <motion.img
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743145625/photo-1414235077428-338989a2e8c0_ms6nmn.avif"
                  className="img-fluid rounded-4 shadow"
                  alt="Restaurant Partner"
                />
              </Col>
            </Row>
          </Container>
        </section>
        {/* CTA Section */}
        <section className="py-5 bg-dark text-white w-100">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <h2 className="fw-bold mb-4">
                  Ready to satisfy your cravings?
                </h2>
                <p className="lead mb-5">
                  Join thousands of happy customers enjoying delicious meals
                  delivered fast
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/user/login">
                    <Button
                      variant="warning"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                    >
                      Order Now
                    </Button>
                  </Link>
                    <Button
                      variant="outline-light"
                      size="lg"
                      className="rounded-pill px-4 fw-bold"
                      href="tel:+4733378901"
                    >
                      Contact Us
                    </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    </div>
  );
}

export default LandingPage;
