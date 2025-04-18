// RestaurantCard.js
import React from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";

const RestaurantCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }
`;

export default RestaurantCard;