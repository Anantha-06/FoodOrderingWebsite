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
    <Container fluid className="d-flex justify-content-center mt-4 p-0">
      <Card className="text-center p-3 shadow-lg bg-body-tertiary rounded-4" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title className="fw-bold mb-4">Available Offers!</Card.Title>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <Row key={coupon._id} className="align-items-center border p-2 rounded-3 my-2 mx-0">
                <Col xs={7} className="fw-bold text-start">
                  Get {coupon.discountPercentage}% Discount
                </Col>
                <Col xs={5} className="text-end">
                  <Button
                    variant={selectedCoupon === coupon.code ? "success" : "primary"}
                    onClick={() => setSelectedCoupon(coupon.code)}
                    className="px-4 py-2"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    {selectedCoupon === coupon.code ? "Applied" : "Apply"}
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <p className="text-muted">No coupons available</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CouponCard;