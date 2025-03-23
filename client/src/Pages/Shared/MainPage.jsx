import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../PageStyle/MainPage.css"


const MainPage = () => {
  return (
    <div className="dynamic-background">
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
          alt="Logo"
          className="animated-logo my-5"
        />
        <Row className="w-50 text-center">
          <Col xs={12} md={4} className="mb-2">
            <Link to="/admin/login">
              <Button variant="primary" className="button-animation w-100">Admin</Button>
            </Link>
          </Col>
          <Col xs={12} md={4} className="mb-2">
            <Link to="/user/login">
              <Button variant="warning" className="button-animation w-100">User</Button>
            </Link>
          </Col>
          <Col xs={12} md={4} className="mb-2">
            <Link to="/seller/login">
              <Button variant="success" className="button-animation w-100">Seller</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
