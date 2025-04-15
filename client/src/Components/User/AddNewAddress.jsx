import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";
import { FiUser, FiHome, FiMapPin, FiNavigation, FiPhone, FiSave } from "react-icons/fi";

function AddNewAddress() {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstance.get("/address/get");
        if (response.data.address) {
          const { _id, ...addressData } = response.data.address;
          setAddress(addressData);
          setFormData(addressData); // Pre-fill form with existing address
        }
      } catch (error) {
        console.error("Error fetching address:", error);
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
    setError(null);
    
    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (formData.pincode.length !== 6) {
      setError("Pincode must be 6 digits");
      return;
    }

    try {
      const endpoint = address ? "/address/update/new" : "/address/create";
      await axiosInstance[address ? "put" : "post"](endpoint, formData);
      setShowSuccess(true);
      
      // Refresh address data
      const response = await axiosInstance.get("/address/get");
      if (response.data.address) {
        const { _id, ...addressData } = response.data.address;
        setAddress(addressData);
      }
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError("Failed to process address. Please try again.");
    }
  };

  // Field icons mapping
  const fieldIcons = {
    name: <FiUser className="me-2" />,
    houseName: <FiHome className="me-2" />,
    streetName: <FiMapPin className="me-2" />,
    landmark: <FiNavigation className="me-2" />,
    city: <FiMapPin className="me-2" />,
    state: <FiMapPin className="me-2" />,
    pincode: <FiMapPin className="me-2" />,
    phone: <FiPhone className="me-2" />,
  };

  return (
    <Container fluid className="py-5" >
      <Row className="justify-content-center">
        <Col lg={10}>
          <Row className="g-4">
            {address && (
              <Col md={5}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <Card.Title className="d-flex align-items-center mb-4">
                      <FiMapPin size={24} className="me-2 text-warning" />
                      <span className="fw-bold">Saved Address</span>
                    </Card.Title>
                    {Object.entries(address).map(([key, value]) => (
                      <div key={key} className="mb-3">
                        <small className="text-muted text-uppercase fw-bold">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </small>
                        <p className="mb-0">{value}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            )}

            <Col md={address ? 7 : 12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <Card.Title className="text-center mb-4 d-flex align-items-center justify-content-center">
                    {address ? (
                      <>
                        <FiSave size={24} className="me-2 text-warning" />
                        <span className="fw-bold">Update Address</span>
                      </>
                    ) : (
                      <>
                        <FiUser size={24} className="me-2 text-warning" />
                        <span className="fw-bold">Add New Address</span>
                      </>
                    )}
                  </Card.Title>

                  {showSuccess && (
                    <Alert variant="success" className="text-center">
                      Address {address ? "updated" : "added"} successfully!
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger" className="text-center">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      {Object.keys(formData).map((field) => (
                        <Col xs={12} md={6} key={field}>
                          <Form.Group className="mb-3">
                            <Form.Label className="d-flex align-items-center">
                              {fieldIcons[field]}
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </Form.Label>
                            <Form.Control
                              type={field === "phone" || field === "pincode" ? "tel" : "text"}
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              required
                              maxLength={field === "phone" ? 10 : field === "pincode" ? 6 : undefined}
                              className="border-1 border-secondary"
                            />
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>

                    <div className="text-center mt-4">
                      <Button 
                        type="submit" 
                        variant="warning" 
                        className="px-5 py-2 text-dark fw-bold"
                      >
                        <FiSave className="me-2" />
                        {address ? "Update Address" : "Save Address"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AddNewAddress;