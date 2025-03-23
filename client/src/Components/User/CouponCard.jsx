import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useFetch from "../../Hooks/UseFetch.jsx";

const CouponCard = ({ selectedCoupon, setSelectedCoupon }) => {
  const [data, isLoading, error] = useFetch("/coupon/avaiable");
  const coupons = data?.data || [];

  if (isLoading) return <p>Loading coupons...</p>;
  if (error) {
    console.error("Fetch Error:", error);
    return <p>{error.message}</p>;
  }

  return (
    <Container className="d-flex justify-content-center mt-4" fluid>
      <Card className="text-center p-3 shadow-lg p-3 mb-5 bg-body-tertiary rounded-4" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title className="fw-bold">Available Offers!</Card.Title>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <Row key={coupon._id} className="align-items-center border p-2 rounded-3 my-2 px-4">
                <Col className="fw-bold">Get {coupon.discountPercentage}% Discount</Col>
                <Col>
                  <Button 
                    variant={selectedCoupon === coupon.code ? "success" : "primary"} 
                    onClick={() => setSelectedCoupon(coupon.code)}
                    className="px-4"
                  >
                    {selectedCoupon === coupon.code ? "Applied" : "Apply"}
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <p>No coupons available</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CouponCard;
