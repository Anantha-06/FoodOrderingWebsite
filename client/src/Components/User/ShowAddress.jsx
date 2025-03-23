import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstance.get("/address/get");
        if (response.data.address) {
          const { _id, ...filteredAddress } = response.data.address;
          setAddress(filteredAddress);
          setSelectedAddressId(_id);
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
    if (formData.phone.length !== 10 || formData.pincode.length !== 6) {
      alert("Invalid phone number or pincode.");
      return;
    }
    try {
      await axiosInstance.post("/address/create", formData);
      alert("Address Added successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to process address.");
    }
  };

  return (
    <Container fluid className="mt-4 p-0">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="p-0">
          {address ? (
            <Card className="p-4 shadow-lg bg-body-tertiary rounded-5">
              <h3 className="fw-bold text-center mb-4">Saved Address</h3>
              {Object.entries(address).map(([key, value]) => (
                <p key={key} className="mb-2">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </p>
              ))}
              <div className="text-center mt-4">
                <Link to={"/address/new"}>
                  <Button variant="warning" className="w-100 py-2" style={{ transition: "all 0.3s ease" }}>
                    Update Address
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-4 shadow-lg bg-body-tertiary rounded-5">
              <h3 className="text-center fw-bold mb-4">Add New Address</h3>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {Object.keys(formData).map((field) => (
                    <Col xs={12} sm={6} key={field} className="mb-3">
                      <Form.Group>
                        <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                        <Form.Control
                          type="text"
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
                <div className="text-center mt-4">
                  <Button type="submit" variant="warning" className="w-100 py-2" style={{ transition: "all 0.3s ease" }}>
                    Add New Address
                  </Button>
                </div>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ShowAddress;