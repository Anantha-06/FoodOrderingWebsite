import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js"
import "../../PageStyle/Footer.css";

function FooterNav() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/subscribe/create", { email });
      setMessage("Subscribed successfully!");
      setEmail("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setMessage("This Email Is Already Subscribed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container fluid className="bg-warning text-dark pt-5 pb-4 px-5">
        <Row className="text-center text-md-start">
          <Col xs={12} md={4} className="mb-4">
            <motion.div whileHover={{ scale: 1.03 }} className="d-flex flex-column align-items-center align-items-md-start gap-3">
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                alt="ByteEats Logo"
                className="footer-logimg"
              />
              <p>© 2025 ByteEats. All Rights Reserved</p>
              <div className="d-flex gap-3">
                <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756874/Food%20Order%20Website/ja0asjyxu0ldj3in80ii.png" />
                <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756877/Food%20Order%20Website/odsfiubj3iktczwzv0r9.png" />
                <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/twitter%20icon.png" />
              </div>
            </motion.div>
          </Col>

          <Col xs={12} md={4} className="mb-4">
            <div className="d-flex flex-column gap-1">
              <p className="fs-5 fw-bold mb-2">Pages</p>
              {["About Us", "News", "Contact", "Blog", "Terms & Condition", "Privacy Policy"].map((page, i) => (
                <a key={i} href="/user/homepage" className="text-decoration-none text-reset mb-1">
                  {page}
                </a>
              ))}
            </div>
          </Col>

          <Col xs={12} md={4}>
            <p className="fs-5 fw-bold mb-1">Subscribe</p>
            <p className="small">Simply enter your email below:</p>
            <Form onSubmit={handleSubscribe} className="d-flex gap-2 mb-2 flex-nowrap">
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </motion.div>
            </Form>
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="small text-success fw-semibold">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!showSuccess && message && (
              <p className="small text-danger">{message}</p>
            )}
            <p className="small">
              By subscribing, you agree to receive emails from us and acknowledge our Privacy Policy.
            </p>
          </Col>
        </Row>

        <hr />
        <Row className="pt-2 text-center text-md-start">
          <Col xs={12} md={6} lg={3} className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
            <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/call%20icon.png" className="footericon" />
            <a href="tel:+918075146088" className="text-decoration-none text-reset">+91 8075146088</a>
          </Col>
          <Col xs={12} md={6} lg={3} className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
            <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756876/Food%20Order%20Website/rd8wg2muc25dmfdzp32z.png" className="footericon" />
            <a href="mailto:byteeats@support.com" className="text-decoration-none text-reset">byteeats@support.com</a>
          </Col>
          <Col xs={12} md={12} lg={4} className="mb-2 d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
            <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/Location%20Icon.png" className="footericon" />
            <span>Near Palayam, Thiruvananthapuram, Kerala 695020</span>
          </Col>
          <Col xs={12} lg={2} className="text-center text-lg-end">
            <p className="fs-6 fw-bold">Download App On</p>
            <motion.a href="/" whileHover={{ scale: 1.1 }}>
              <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/u73vggn7vjp072jznxgw.png" className="socialMedia-img mx-1" />
            </motion.a>
            <motion.a href="/" whileHover={{ scale: 1.1 }}>
              <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/aw2fe2fhcfsamnsxbkn3.png" className="socialMedia-img mx-1" />
            </motion.a>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}

export default FooterNav;
