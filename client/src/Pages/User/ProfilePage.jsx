import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch.jsx";
import {
  FiUser,
  FiMail,
  FiPackage,
  FiMapPin,
  FiEdit2,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiHome,
  FiNavigation,
  FiPhone,
  FiCreditCard
} from "react-icons/fi";

const primaryColor = "#ffc107";
const primaryHover = "#ffab00";
const textColor = "#2d3748";
const lightText = "#4a5568";
const bgColor = "#f8f9fa";
const borderColor = "#e2e8f0";

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ProfileHeader = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${textColor};
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${primaryColor};
    border-radius: 2px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ProfileImage = styled(motion.img)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: ${lightText};

  svg {
    color: ${primaryColor};
    font-size: 1.3rem;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${borderColor};
  margin: 2rem 0;
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${borderColor};
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1.2rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$active ? primaryColor : lightText};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 193, 7, 0.05);
    color: ${primaryColor};
  }

  ${props => props.$active && `
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: ${primaryColor};
    }
  `}
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const OrderCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${borderColor};
`;

const OrderHeader = styled.div`
  padding: 1.2rem;
  background: #fff9e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const OrderDetails = styled.div`
  padding: 1.2rem;
  background: white;
  border-top: 1px solid ${borderColor};
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${borderColor};

  &:last-child {
    border-bottom: none;
  }
`;

const OrderImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid ${borderColor};
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderStatus = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.$status === 'delivered' ? '#10b981' : 
    props.$status === 'shipped' ? primaryColor : 
    '#f59e0b'};
  color: white;
`;

const AddressCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  border: 1px solid ${borderColor};
`;

const AddressItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  color: ${lightText};

  svg {
    color: ${primaryColor};
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const UpdateButton = styled(motion.button)`
  background: ${primaryColor};
  color: ${textColor};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem auto 0;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);

  &:hover {
    background: ${primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
  }
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  color: ${primaryColor};
  font-weight: 600;
  margin-top: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: ${primaryHover};
    text-decoration: underline;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid ${primaryColor};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState('orders');
  const [expandedOrder, setExpandedOrder] = React.useState(null);
  
  const [userData, isUserLoading, userError] = useFetch("/user/profile");
  const [addressData, isAddressLoading, addressError] = useFetch("/address/get");
  const [ordersData, isOrdersLoading, ordersError] = useFetch("/order/get/all");

  const profile = userData?.user || {};
  const address = addressData?.address || null;
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];

  if (isUserLoading || isAddressLoading || isOrdersLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <ProfileContainer>
      <ProfileHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        My Profile
      </ProfileHeader>

      <ProfileSection>
        <ProfileImage
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/noeuwugmxrhszkjcq2no.png"
          alt="Profile"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <ProfileInfo>
          <InfoItem>
            <FiUser />
            <strong>Name:</strong> {profile.name || "N/A"}
          </InfoItem>
          <InfoItem>
            <FiMail />
            <strong>Email:</strong> {profile.email || "N/A"}
          </InfoItem>
        </ProfileInfo>
      </ProfileSection>

      <Divider />

      <TabContainer>
        <TabHeader>
          <TabButton 
            $active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
          >
            <FiPackage /> Orders
          </TabButton>
          <TabButton 
            $active={activeTab === 'address'}
            onClick={() => setActiveTab('address')}
          >
            <FiMapPin /> Address
          </TabButton>
        </TabHeader>

        <TabContent>
          {activeTab === 'orders' ? (
            <>
              {ordersError || orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <>
                  {orders.slice(0, 5).map((order) => (
                    <OrderCard
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <OrderHeader onClick={() => toggleOrder(order._id)}>
                        <div>
                          <strong>Order #:</strong> {order._id.slice(-8).toUpperCase()}
                        </div>
                        <OrderStatus $status={order.status.toLowerCase()}>
                          {order.status}
                        </OrderStatus>
                      </OrderHeader>
                      
                      {expandedOrder === order._id && (
                        <OrderDetails>
                          {order.cartId?.items?.map((item, idx) => (
                            <OrderItem key={idx}>
                              <OrderImage src={item.foodImage} alt={item.foodName} />
                              <OrderInfo>
                                <strong>{item.foodName}</strong>
                                <div>Qty: {item.quantity} - ₹{item.totalItemPrice}</div>
                              </OrderInfo>
                            </OrderItem>
                          ))}
                        </OrderDetails>
                      )}
                    </OrderCard>
                  ))}

                  {orders.length > 5 && (
                    <ViewAllButton to="/user/orders">
                      View All Orders →
                    </ViewAllButton>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {addressError || !address ? (
                <p>No address found.</p>
              ) : (
                <AddressCard
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Saved Address
                  </h3>
                  
                  <AddressItem>
                    <FiUser />
                    <div><strong>Name:</strong> {address.name}</div>
                  </AddressItem>
                  <AddressItem>
                    <FiHome />
                    <div><strong>House:</strong> {address.houseName}</div>
                  </AddressItem>
                  <AddressItem>
                    <FiNavigation />
                    <div><strong>Landmark:</strong> {address.landmark}</div>
                  </AddressItem>
                  <AddressItem>
                    <FiMapPin />
                    <div><strong>Street:</strong> {address.streetName}</div>
                  </AddressItem>
                  <AddressItem>
                    <FiMapPin />
                    <div><strong>City:</strong> {address.city}, {address.state} - {address.pincode}</div>
                  </AddressItem>
                  <AddressItem>
                    <FiPhone />
                    <div><strong>Phone:</strong> {address.phone}</div>
                  </AddressItem>

                  <Link to="/user/address/new" className="text-decoration-none">
                    <UpdateButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEdit2 /> Update Address
                    </UpdateButton>
                  </Link>
                </AddressCard>
              )}
            </>
          )}
        </TabContent>
      </TabContainer>
    </ProfileContainer>
  );
}

export default ProfilePage;