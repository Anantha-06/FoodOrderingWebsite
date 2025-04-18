// AdminSidebar.js
import React from "react";
import { Nav, Badge } from "react-bootstrap";
import { 
  FaChartLine, FaStore, FaBell, FaEnvelope, 
  FaMoneyBillWave, FaUsers, FaPlus 
} from "react-icons/fa";
import styled from "styled-components";

const Sidebar = styled.div`
  background: #2c3e50;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  color: white;
`;

const NavLink = styled(Nav.Link)`
  color: ${props => props.active ? "#f39c12" : "rgba(255,255,255,0.8)"} !important;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    color: white !important;
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const AdminSidebar = ({ 
  activeKey, 
  setActiveKey,
  restaurantsCount,
  unverifiedCount,
  transactionsCount,
  usersCount,
  subscribersCount
}) => {
  return (
    <Sidebar>
      <Nav variant="pills" className="flex-column">
        <NavLink 
          eventKey="dashboard" 
          active={activeKey === "dashboard"}
          onClick={() => setActiveKey("dashboard")}
        >
          <FaChartLine />
          Dashboard
        </NavLink>
        <NavLink 
          eventKey="restaurants" 
          active={activeKey === "restaurants"}
          onClick={() => setActiveKey("restaurants")}
        >
          <FaStore />
          Restaurants <Badge bg="secondary" className="ms-2">{restaurantsCount}</Badge>
        </NavLink>
        <NavLink 
          eventKey="unverified" 
          active={activeKey === "unverified"}
          onClick={() => setActiveKey("unverified")}
        >
          <FaBell />
          Unverified <Badge bg="warning" className="ms-2">{unverifiedCount}</Badge>
        </NavLink>
        <NavLink 
          eventKey="subscribers" 
          active={activeKey === "subscribers"}
          onClick={() => setActiveKey("subscribers")}
        >
          <FaEnvelope />
          Subscribers <Badge bg="info" className="ms-2">{subscribersCount}</Badge>
        </NavLink>
        <NavLink 
          eventKey="transactions" 
          active={activeKey === "transactions"}
          onClick={() => setActiveKey("transactions")}
        >
          <FaMoneyBillWave />
          Transactions <Badge bg="success" className="ms-2">{transactionsCount}</Badge>
        </NavLink>
        <NavLink 
          eventKey="users" 
          active={activeKey === "users"}
          onClick={() => setActiveKey("users")}
        >
          <FaUsers />
          Users <Badge bg="primary" className="ms-2">{usersCount}</Badge>
        </NavLink>
        <NavLink 
          eventKey="coupon" 
          active={activeKey === "coupon"}
          onClick={() => setActiveKey("coupon")}
        >
          <FaPlus />
          Create Coupon
        </NavLink>
      </Nav>
    </Sidebar>
  );
};

export default AdminSidebar;