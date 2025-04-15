import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiMapPin, FiPhone, FiUser, FiEdit2 } from "react-icons/fi";
import styled from "styled-components";

// Styled Components
const AddressCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FormInput = styled(Form.Control)`
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ffc107;
    box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  border-radius: 12px;
  font-weight: 500;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AddressField = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FieldIcon = styled.div`
  margin-right: 1rem;
  color: #ffc107;
  font-size: 1.25rem;
`;

function ShowAddress({ selectedAddressId, setSelectedAddressId }) {
  const [formData, setFormData] = useState({
    name: "",
    houseName: "",
    streetName: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const fieldIcons = {
    name: <FiUser />,
    houseName: <FiHome />,
    streetName: <FiMapPin />,
    landmark: <FiMapPin />,
    city: <FiMapPin />,
    state: <FiMapPin />,
    pincode: <FiMapPin />,
    phone: <FiPhone />
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/address/get");
        if (response.data.address) {
          const { _id, ...filteredAddress } = response.data.address;
          setAddress(filteredAddress);
          setSelectedAddressId(_id);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setError("Failed to load address. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "phone" || name === "pincode") && !/^[0-9]*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }
    
    if (formData.pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/address/create", formData);
      setSuccess("Address added successfully!");
      setTimeout(() => {
        navigate(0); // Refresh the page
      }, 1500);
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatFieldName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  if (loading && !address) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" role="status" variant="warning">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-3 px-md-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={12} xl={12}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
              {success}
            </Alert>
          )}

          {address ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AddressCard className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                    <FiHome size={28} className="text-warning" />
                    Saved Address
                  </h3>
                  <div className="d-flex justify-content-center mb-3">
                    <div style={{
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>

                <div className="px-3">
                  {Object.entries(address).map(([key, value]) => (
                    <AddressField key={key}>
                      <FieldIcon>{fieldIcons[key]}</FieldIcon>
                      <div>
                        <p className="mb-0 fw-medium text-muted" style={{ fontSize: "0.85rem" }}>
                          {formatFieldName(key)}
                        </p>
                        <p className="mb-0 fw-semibold" style={{ fontSize: "1.05rem" }}>
                          {value}
                        </p>
                      </div>
                    </AddressField>
                  ))}
                </div>

                <div className="text-center mt-5">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link to="/user/address/new" className="text-decoration-none">
                      <SubmitButton variant="warning" className="px-4 d-inline-flex align-items-center gap-2">
                        <FiEdit2 size={18} />
                        Update Address
                      </SubmitButton>
                    </Link>
                  </motion.div>
                </div>
              </AddressCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AddressCard className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                    <FiHome size={28} className="text-warning" />
                    Add New Address
                  </h3>
                  <div className="d-flex justify-content-center mb-3">
                    <div style={{
                      width: '80px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {Object.keys(formData).map((field) => (
                      <Col xs={12} sm={6} key={field}>
                        <Form.Group controlId={field}>
                          <Form.Label className="fw-medium text-muted">
                            {formatFieldName(field)}
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <FieldIcon>{fieldIcons[field]}</FieldIcon>
                            <FormInput
                              type={field === "phone" || field === "pincode" ? "tel" : "text"}
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              required
                              maxLength={field === "phone" ? 10 : field === "pincode" ? 6 : undefined}
                              placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <div className="text-center mt-5">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <SubmitButton 
                        type="submit" 
                        variant="warning" 
                        className="px-4"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Adding Address...
                          </>
                        ) : (
                          "Add New Address"
                        )}
                      </SubmitButton>
                    </motion.div>
                  </div>
                </Form>
              </AddressCard>
            </motion.div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ShowAddress;