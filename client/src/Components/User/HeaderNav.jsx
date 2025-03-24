import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function HeaderNav() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    Cookies.remove("token"); 
    alert("Sign Out Successful!");
    navigate("/")
    window.location.reload();
    
  };

  return (
    <nav>
      <Navbar expand="lg" className="bg-warning ">
        <Container fluid className="gap-lg-5 gap-md-3 gap-sm-1 gap-xs-0 ">
          <Link to="/user/homepage">
            <Navbar.Brand>
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
                className="navBar-logimg"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0 gap-lg-5 gap-md-3 gap-sm-1 gap-xs-1 d-flex align-items-center"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link to ={"/user/homepage"} className="text-decoration-none text-reset">Home</Link>
              <Link to ={"/user/about"} className="text-decoration-none text-reset">About Us</Link>
              <NavDropdown
                title={
                  <img
                    className="thumbnail-image"
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
                  />
                }
                id="navbarScrollingDropdown"
              >
                <Link to ={"/user/profile"} className="text-decoration-none text-reset"><li><p className="mx-2">Your Profile</p></li></Link>
                <Link to ={"/user/orders"} className="text-decoration-none text-reset"><li><p className="mx-2">Your Order</p></li></Link>
                <NavDropdown.Divider />
                <Link onClick={handleSignOut} className="text-decoration-none text-reset"><p className="mx-2 my-0">Sign Out</p></Link>
                <NavDropdown.Item ></NavDropdown.Item>
              </NavDropdown>
              <Link to ={"/user/checkout"} className="text-decoration-none text-reset"><img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/hj0p5muuflnvmef2lq9z.png"
                  className="thumbnail-image-2"
                /></Link>
              
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  );
}

export default HeaderNav;
