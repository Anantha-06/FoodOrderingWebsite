import React from "react";
import AllOrderCard from "../../Components/AllOrderCard";
import { Container } from "react-bootstrap";
import "../../App.css";

function AllORderPage() {
  return (
    <>
      <Container fluid className="allPage-height">
        <div>
          <p className="fs-2 fw-bold text-center">All Order Page</p>
        </div>
        <AllOrderCard />
      </Container>
    </>
  );
}

export default AllORderPage;
