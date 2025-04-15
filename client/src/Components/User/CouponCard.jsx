import React from "react";
import { Card, Button, Row, Col, Container, Spinner, Badge } from "react-bootstrap";
import useFetch from "../../Hooks/UseFetch.jsx";
import { FiTag, FiCheck, FiX } from "react-icons/fi";
import styled from "styled-components";

const CouponContainer = styled(Container)`
  max-width: 500px;
`;

const CouponCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
`;

const CouponItem = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255, 193, 7, 0.1)' : 'white'};
  border-color: ${props => props.$active ? '#ffc107' : '#e2e8f0'};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CouponTitle = styled.h5`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CouponCode = styled.code`
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #4a5568;
  margin-left: 0.5rem;
`;

const CouponDescription = styled.p`
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ApplyButton = styled(Button)`
  align-self: center;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  background: ${props => props.$active ? '#10b981' : '#ffc107'};
  border: none;
  color: ${props => props.$active ? 'white' : '#2d3748'};

  &:hover {
    background: ${props => props.$active ? '#0d9f6e' : '#ffab00'};
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const CouponCardComponent = ({ selectedCoupon, setSelectedCoupon }) => {
  const [data, isLoading, error] = useFetch("/coupon/avaiable");
  const coupons = data?.data || [];

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner animation="border" variant="warning" />
      </LoadingContainer>
    );
  }

  if (error) {
    console.error("Fetch Error:", error);
    return (
      <CouponContainer className="text-center py-4">
        <Alert variant="danger">
          Failed to load coupons. Please try again later.
        </Alert>
      </CouponContainer>
    );
  }

  return (
    <CouponContainer className="my-4">
      <CouponCard>
        <Card.Body className="p-4">
          <Card.Title className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <FiTag size={24} className="text-warning" />
            <span className="fw-bold">Available Offers</span>
          </Card.Title>

          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <CouponItem 
                key={coupon._id}
                $active={selectedCoupon === coupon.code}
              >
                <CouponTitle>
                  {coupon.name}
                </CouponTitle>
                <CouponDescription>
                  Get {coupon.discountPercentage}% discount on orders above ₹{coupon.minOrderVal}
                </CouponDescription>
                <ApplyButton
                  $active={selectedCoupon === coupon.code}
                  onClick={() => {
                    setSelectedCoupon(selectedCoupon === coupon.code ? "" : coupon.code);
                  }}
                >
                  {selectedCoupon === coupon.code ? (
                    <>
                      <FiCheck /> Applied
                    </>
                  ) : (
                    <>
                      <FiTag /> Apply Coupon
                    </>
                  )}
                </ApplyButton>
              </CouponItem>
            ))
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No coupons available at the moment</p>
            </div>
          )}
        </Card.Body>
      </CouponCard>
    </CouponContainer>
  );
};

export default CouponCardComponent;