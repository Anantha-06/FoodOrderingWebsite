import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import Cookies from "js-cookie";

function RestaurantSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    password: "",
    contactEmail: ""
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    phone: "",
    contactEmail: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = Cookies.get("authToken");
    const restaurantToken = Cookies.get("restaurantToken");
    const adminToken = Cookies.get("authTokenAdmin");
    
    if (adminToken) {
      navigate("/admin/dashboard");
    } else if (userToken) {
      navigate("/user/homepage");
    } else if (restaurantToken) {
      navigate("/restaurant/dashboard");
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    // Strict 10-digit validation without any special characters
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numeric input
    if (name === "phone") {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);
      setFormData({ ...formData, [name]: limitedValue });
      
      setValidationErrors({
        ...validationErrors,
        phone: validatePhone(limitedValue) ? "" : "Please enter a 10-digit phone number"
      });
    } else {
      setFormData({ ...formData, [name]: value });

      // Validate fields as user types
      if (name === "email") {
        setValidationErrors({
          ...validationErrors,
          email: validateEmail(value) ? "" : "Please enter a valid email address"
        });
      } else if (name === "contactEmail") {
        setValidationErrors({
          ...validationErrors,
          contactEmail: validateEmail(value) ? "" : "Please enter a valid contact email"
        });
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate all fields before submission
    const errors = {
      email: validateEmail(formData.email) ? "" : "Please enter a valid email address",
      phone: validatePhone(formData.phone) ? "" : "Please enter a 10-digit phone number",
      contactEmail: validateEmail(formData.contactEmail) ? "" : "Please enter a valid contact email"
    };

    setValidationErrors(errors);

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error !== "")) {
      return;
    }

    setLoading(true);
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await axiosInstance.post("/restaurant/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/restaurant/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Left Column - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: 'white'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '450px'
          }}
        >
          <div style={{
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
          }}>
            <h2 style={{
              marginBottom: '1.5rem',
              color: '#2c3e50',
              textAlign: 'center',
              fontSize: '1.8rem',
              fontWeight: '600'
            }}>
              Restaurant Signup
            </h2>
            
            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${validationErrors.email ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
                {validationErrors.email && (
                  <p style={{
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem'
                  }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${validationErrors.phone ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
                {validationErrors.phone && (
                  <p style={{
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem'
                  }}>
                    {validationErrors.phone}
                  </p>
                )}
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Contact Email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${validationErrors.contactEmail ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                />
                {validationErrors.contactEmail && (
                  <p style={{
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem'
                  }}>
                    {validationErrors.contactEmail}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading || Object.values(validationErrors).some(error => error !== "")}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: loading || Object.values(validationErrors).some(error => error !== "") ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading || Object.values(validationErrors).some(error => error !== "") ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? (
                  <span>Signing Up...</span>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      
      {/* Right Column - Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1742932376/DALL_E_2025-03-26_01.21.07_-_A_minimalistic_portrait_of_a_gourmet_food_item_featuring_a_beautifully_plated_dish_with_vibrant_colors._The_dish_is_elegantly_arranged_on_a_white_pla_cuuzsm.webp" 
          alt="Restaurant Illustration"
          style={{
            height: '100vh',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      
      {/* Success Modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <p style={{
              fontSize: '1.2rem',
              color: '#10b981',
              marginBottom: '1rem'
            }}>
              Signup successful!
            </p>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantSignup;