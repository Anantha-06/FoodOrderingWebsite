import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useFetch from "../../Hooks/UseFetch.jsx";

function HeaderNav() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, isLoading, error] = useFetch(
    searchQuery ? `/restaurant/by/${searchQuery}` : null
  );

  const handleSignOut = () => {
    Cookies.remove("authToken");
    alert("Sign Out Successful!");
    navigate("/login");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    if (data) {
      setSearchResults(data);
      setShowDropdown(true);
    }
  }, [data]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults) {
      navigate(`/user/restaurant/${searchResults.restaurant._id}`);
      setShowDropdown(false);
      setSearchQuery("");
    }
  };

  const handleMenuItemClick = (restaurantId) => {
    navigate(`/user/restaurant/${restaurantId}`);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <nav>
      <Navbar expand="lg" className="bg-warning">
        <Container fluid className="gap-lg-5 gap-md-3 gap-sm-1 gap-xs-0 my-3 ">
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
              <Link
                to={"/user/homepage"}
                className="text-decoration-none text-reset"
              >
                Home
              </Link>
              <Link
                to={"/user/about"}
                className="text-decoration-none text-reset"
              >
                About Us
              </Link>
              <NavDropdown
                title={
                  <img
                    className="thumbnail-image"
                    src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
                  />
                }
                id="navbarScrollingDropdown"
              >
                <Link
                  to={"/user/profile"}
                  className="text-decoration-none text-reset"
                >
                  <li>
                    <p className="mx-2">Your Profile</p>
                  </li>
                </Link>
                <Link
                  to={"/user/orders"}
                  className="text-decoration-none text-reset"
                >
                  <li>
                    <p className="mx-2">Your Order</p>
                  </li>
                </Link>
                <NavDropdown.Divider />
                <Link
                  onClick={handleSignOut}
                  className="text-decoration-none text-reset"
                >
                  <p className="mx-2 my-0">Sign Out</p>
                </Link>
                <NavDropdown.Item></NavDropdown.Item>
              </NavDropdown>
              <Link
                to={"/user/checkout"}
                className="text-decoration-none text-reset"
              >
                <img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/hj0p5muuflnvmef2lq9z.png"
                  className="thumbnail-image-2"
                />
              </Link>
            </Nav>
            <Form className="d-flex position-relative" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search restaurants"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" type="submit">
                Search
              </Button>
              
              {showDropdown && searchResults && (
                <div className="search-results-dropdown position-absolute top-100 start-0 bg-white border rounded mt-1 w-100 z-3">
                  <div className="p-2 border-bottom">
                    <div 
                      className="d-flex align-items-center p-2 hover-bg-light cursor-pointer"
                      onClick={() => handleMenuItemClick(searchResults.restaurant._id)}
                    >
                      <img
                        src={searchResults.restaurant.image}
                        alt={searchResults.restaurant.name}
                        style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                      />
                      <div>
                        <strong>{searchResults.restaurant.name}</strong>
                        <div className="text-muted small">
                          Rating: {searchResults.restaurant.rating} ★
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h6 className="px-2 py-1">Menu Items:</h6>
                    {searchResults.restaurant.menu.map((item) => (
                      <div 
                        key={item._id} 
                        className="d-flex align-items-center p-2 hover-bg-light cursor-pointer"
                        onClick={() => handleMenuItemClick(searchResults.restaurant._id)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
                        />
                        <div>
                          <strong>{item.name}</strong>
                          <div className="text-muted small">₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  );
}

export default HeaderNav;