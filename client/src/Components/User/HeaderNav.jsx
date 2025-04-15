import React, { useState, useEffect, useRef } from "react";
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
  FaTimes,
  FaChevronDown,
  FaSignOutAlt
} from "react-icons/fa";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #ffc107 0%,rgb(219, 217, 213) 100%);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 2.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 70%;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    color: #1e40af;

    &.open {
      transform: translateX(0);
      animation: ${slideIn} 0.3s ease;
    }
  }
`;

const NavLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    color: #93c5fd;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #93c5fd;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;

  @media (max-width: 1024px) {
    margin: 0 1rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchForm = styled.form`
  display: flex;
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #1f2937;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  padding: 0 1.25rem;
  background: #ffc107;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;
  animation: ${fadeIn} 0.2s ease;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const ResultImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const ResultContent = styled.div`
  flex: 1;

  strong {
    display: block;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  small {
    color: #6b7280;
    font-size: 0.8rem;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const ProfileDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 20;
  animation: ${fadeIn} 0.2s ease;
  color: #1f2937;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;

  &:hover {
    background: #f3f4f6;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 0.25rem 0;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1002;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #1e40af;
  font-size: 1.5rem;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

function HeaderNav() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantResults, setRestaurantResults] = useState(null);
  const [menuResults, setMenuResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const [restaurantData] = useFetch(searchQuery ? `/restaurant/by/${searchQuery}` : null);
  const [menuData] = useFetch(searchQuery ? `/menu/by/${searchQuery}` : null);

  const handleSignOut = () => {
    Cookies.remove("authToken");
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setMobileSearchOpen(false);
  };

  const handleMenuItemClick = (restaurantId) => {
    navigate(`/user/restaurant/${restaurantId}`);
    setShowDropdown(false);
    setSearchQuery("");
    setMobileSearchOpen(false);
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/user/homepage">
          <Logo
            src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
            alt="Byteeats Logo"
          />
        </Link>
      </LogoContainer>

      <SearchContainer ref={searchRef}>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search restaurants or menu items..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <SearchButton type="submit">
            <FaSearch />
          </SearchButton>
        </SearchForm>

        {showDropdown && (
          <SearchResults>
            {restaurantResults && (
              <>
                <ResultItem onClick={() => handleMenuItemClick(restaurantResults._id)}>
                  <ResultImage src={restaurantResults.image} alt={restaurantResults.name} />
                  <ResultContent>
                    <strong>{restaurantResults.name}</strong>
                    <small>Rating: {restaurantResults.rating} ★</small>
                  </ResultContent>
                </ResultItem>
                {restaurantResults.menu?.map((item) => (
                  <ResultItem key={item._id} onClick={() => handleMenuItemClick(restaurantResults._id)}>
                    <ResultImage src={item.image} alt={item.name} />
                    <ResultContent>
                      <strong>{item.name}</strong>
                      <small>Menu item</small>
                    </ResultContent>
                  </ResultItem>
                ))}
              </>
            )}

            {menuResults && (
              <ResultItem onClick={() => handleMenuItemClick(menuResults.restaurantId)}>
                <ResultImage src={menuResults.image} alt={menuResults.name} />
                <ResultContent>
                  <strong>{menuResults.name}</strong>
                  <small>Menu item</small>
                </ResultContent>
              </ResultItem>
            )}
          </SearchResults>
        )}
      </SearchContainer>

      <MobileSearchButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
        <FaSearch />
      </MobileSearchButton>

      {mobileSearchOpen && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          left: '1rem',
          right: '1rem',
          zIndex: 1002,
          background: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <SearchForm onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
            <SearchInput
              type="text"
              placeholder="Search restaurants or menu items..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchForm>
          {showDropdown && (
            <SearchResults style={{ position: 'relative', top: '0', marginTop: '0.5rem' }}>
              {/* Same results content as above */}
            </SearchResults>
          )}
        </div>
      )}

      <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      <NavLinks className={menuOpen ? "open" : ""}>
        <CloseButton onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </CloseButton>
        
        <NavLink to="/user/homepage" onClick={() => setMenuOpen(false)}>
          <FaHome /> Home
        </NavLink>
        <NavLink to="/user/about" onClick={() => setMenuOpen(false)}>
          <FaInfoCircle /> About
        </NavLink>
        
        <ProfileContainer ref={profileRef}>
          <NavLink as="div" onClick={() => setShowProfile(!showProfile)}>
            <FaUserCircle /> Profile <FaChevronDown size={12} />
          </NavLink>
          
          {showProfile && (
            <ProfileDropdown>
              <DropdownItem to="/user/profile" onClick={() => {
                setShowProfile(false);
                setMenuOpen(false);
              }}>
                Your Profile
              </DropdownItem>
              <DropdownItem to="/user/orders" onClick={() => {
                setShowProfile(false);
                setMenuOpen(false);
              }}>
                Your Orders
              </DropdownItem>
              <DropdownItem to="/user/address/new" onClick={() => {
                setShowProfile(false);
                setMenuOpen(false);
              }}>
                Your Address
              </DropdownItem>
              <Divider />
              <DropdownButton onClick={handleSignOut}>
                <FaSignOutAlt /> Sign Out
              </DropdownButton>
            </ProfileDropdown>
          )}
        </ProfileContainer>
        
        <NavLink to="/user/checkout" onClick={() => setMenuOpen(false)}>
          <FaShoppingCart /> Cart
        </NavLink>
      </NavLinks>
    </HeaderContainer>
  );
}

export default HeaderNav;