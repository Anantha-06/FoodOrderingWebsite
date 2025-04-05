import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useFetch from "../../Hooks/UseFetch.jsx";
import {
  FaHome,
  FaInfoCircle,
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import "../../PageStyle/NewHeaderModern.css";

function HeaderNav() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data] = useFetch(searchQuery ? `/restaurant/by/${searchQuery}` : null);

  const handleSignOut = () => {
    Cookies.remove("authToken");
    alert("Sign Out Successful!");
    navigate("/user/login");
    setTimeout(() => window.location.reload(), 500);
  };

  useEffect(() => {
    if (data) {
      setSearchResults(data);
      setShowDropdown(true);
    }
  }, [data]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setShowDropdown(false);
      setSearchResults(null);
    }
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
    <header className="custom-header">
      <div className="header-left">
        <Link to="/user/homepage">
          <img
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png"
            alt="Byteeats Logo"
            className="header-logo"
          />
        </Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        {showDropdown && searchResults && (
          <div className="search-dropdown">
            <div
              className="search-item"
              onClick={() =>
                handleMenuItemClick(searchResults.restaurant._id)
              }
            >
              <img src={searchResults.restaurant.image} alt="" />
              <div>
                <strong>{searchResults.restaurant.name} :</strong>
                <small> Rating: {searchResults.restaurant.rating} ★</small>
              </div>
            </div>
            <div className="menu-list">
              {searchResults.restaurant.menu.map((item) => (
                <div
                  key={item._id}
                  className="search-item"
                  onClick={() =>
                    handleMenuItemClick(searchResults.restaurant._id)
                  }
                >
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`header-right ${menuOpen ? "show" : ""}`}>
        <Link to="/user/homepage" className="icon-link" title="Home">
          <FaHome />
        </Link>
        <Link to="/user/about" className="icon-link" title="About">
          <FaInfoCircle />
        </Link>
        <div
          className="icon-link profile-icon"
          onClick={() => setShowProfile(!showProfile)}
          title="Profile"
        >
          <FaUserCircle />
          {showProfile && (
            <div className="profile-dropdown fs-6">
              <Link to="/user/profile">Your Profile</Link>
              <Link to="/user/orders">Your Orders</Link>
              <Link to="/user/address/new">Your Address</Link>
              <hr />
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
        <Link to="/user/checkout" className="icon-link" title="Cart">
          <FaShoppingCart />
        </Link>
      </div>
    </header>
  );
}

export default HeaderNav;