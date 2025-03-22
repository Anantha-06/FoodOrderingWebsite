import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";

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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstance.get("/address/get");
        if (response.data.address) {
          const { _id, ...addressData } = response.data.address;
          setAddress(addressData);
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
      const endpoint = address ? "/address/update/new" : "/address/create";
      await axiosInstance[address ? "put" : "post"](endpoint, formData);
      alert(address ? "Address Updated successfully!" : "Address Added successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to process address.");
    }
  };

  return (
    <Container fluid>
      <Row className="d-flex flex-wrap mb-3 gap-4">
        {address && (
          <Col md={5} className="shadow-lg p-3 bg-body-tertiary rounded-5 zoom-content">
            <div>
              <div className="fw-bold fs-3 my-2">Saved Address</div>
              {Object.entries(address).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </p>
              ))}
            </div>
          </Col>
        )}
        <Col md={6} className="shadow-lg p-3 bg-body-tertiary rounded-5 zoom-content">
          <h3 className="text-center my-3 fw-bold fs-3">{address ? "Update Saved Address" : "Add New Address"}</h3>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {Object.keys(formData).map((field) => (
                <Col xs={12} md={6} key={field}>
                  <Form.Group>
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <Form.Control type="text" name={field} value={formData[field]} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-3">
              <Button type="submit" variant="warning" className="px-5 py-2">{address ? "Update Address" : "Add New Address"}</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddNewAddress;
