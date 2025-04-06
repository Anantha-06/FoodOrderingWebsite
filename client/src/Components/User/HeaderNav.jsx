import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useFetch from "../../Hooks/UseFetch.jsx";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
} from "react-icons/fa";
import "../../PageStyle/NewHeaderModern.css";

function HeaderNav() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantResults, setRestaurantResults] = useState(null);
  const [menuResults, setMenuResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [restaurantData] = useFetch(searchQuery ? `/restaurant/by/${searchQuery}` : null);
  const [menuData] = useFetch(searchQuery ? `/menu/by/${searchQuery}` : null);

  const handleSignOut = () => {
    Cookies.remove("authToken");
    alert("Sign Out Successful!");
    navigate("/user/login");
    setTimeout(() => window.location.reload(), 500);
  };

  useEffect(() => {
    if (restaurantData || menuData) {
      setRestaurantResults(restaurantData?.restaurant || null);
      setMenuResults(menuData?.menuItem || null);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [restaurantData, menuData]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setShowDropdown(false);
      setRestaurantResults(null);
      setMenuResults(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (restaurantResults) {
      navigate(`/user/restaurant/${restaurantResults._id}`);
    } else if (menuResults && menuResults.restaurantId) {
      navigate(`/user/restaurant/${menuResults.restaurantId}`);
    }
    setShowDropdown(false);
    setSearchQuery("");
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
            placeholder="Search restaurants or menu items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        {showDropdown && (
          <div className="search-dropdown">
            {restaurantResults && (
              <>
                <div
                  className="search-item"
                  onClick={() => handleMenuItemClick(restaurantResults._id)}
                >
                  <img src={restaurantResults.image} alt="" />
                  <div>
                    <strong>{restaurantResults.name}</strong>
                    <small> Rating: {restaurantResults.rating} ★</small>
                  </div>
                </div>
                <div className="menu-list">
                  {restaurantResults.menu.map((item) => (
                    <div
                      key={item._id}
                      className="search-item"
                      onClick={() => handleMenuItemClick(restaurantResults._id)}
                    >
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.name}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {menuResults && (
              <div
                className="search-item"
                onClick={() => handleMenuItemClick(menuResults.restaurantId)}
              >
                <img src={menuResults.image} alt="" />
                <div>
                  <strong>{menuResults.name}</strong>
                 
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`header-right ${menuOpen ? "show" : ""}`}>
        <Link to="/user/homepage" className="icon-link fs-5" title="Home">
          Home
        </Link>
        <Link to="/user/about" className="icon-link fs-5" title="About">
          About Us
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
