import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../App.css";

function AdminLoginPage() {
  return (
    <>
      <Container fluid className="loginBackground">
        <Row>
          <Col
            xs={12}
            sm={12}
            md={9}
            lg={9}
            className="d-flex justify-content-center align-items-center"
          >
            <Card className="d-flex text-center border border-0  shadow-lg p-3 mb-5 bg-body-tertiary rounded-3">
              <div>
                <div>
                  <p className="fs-4 fw-bold">ADMIN LOGIN</p>
                </div>
                <Form className="inputBox-width">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <Button
                    variant="warning"
                    type="submit"
                    className="py-2 px-4 fs-6 inputBox-width"
                  >
                    Submit
                  </Button>
                </Form>
              </div>
            </Card>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={3}
            lg={3}
            className="d-flex justify-content-end m-0 p-0"
          >
            <div>
              <img
                src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740883119/Food%20Order%20Website/gtqxturrfthvupa4vxjw.webp"
                className="loginImage"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminLoginPage;
