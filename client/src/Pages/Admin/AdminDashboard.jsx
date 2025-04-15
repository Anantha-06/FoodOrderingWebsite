import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance";
import Cookies from "js-cookie";
import { 
  FaSignOutAlt, FaCheck, FaTimes, FaTrash, FaPlus, 
  FaEnvelope, FaUtensils, FaPhone, FaStar, FaChartLine, 
  FaUsers, FaStore, FaMoneyBillWave, FaBell, FaSearch 
} from "react-icons/fa";
import { 
  Container, Row, Col, Nav, Button, Table, Badge, 
  Spinner, Form, Alert, Card, Modal 
} from "react-bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components
const DashboardContainer = styled(Container)`
  padding: 2rem;
  max-width: 1800px;
`;

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

const StatCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }
`;

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

const ActionButton = styled(Button)`
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [restaurants, setRestaurants] = useState([]);
  const [unverifiedRestaurants, setUnverifiedRestaurants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
    minOrderVal: "",
    maxDiscValue: "",
    expiryDate: "",
    isAvailable: true,
  });
  const [dateError, setDateError] = useState("");
  const [formError, setFormError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState({
    dashboard: false,
    restaurants: false,
    unverified: false,
    transactions: false,
    users: false,
    coupon: false,
    subscribers: false,
  });

  useEffect(() => {
    const authTokenAdmin = Cookies.get("authTokenAdmin");
    if (!authTokenAdmin) {
      navigate("/admin/login");
    } else {
      fetchAllData();
    }
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading({
      dashboard: true,
      restaurants: true,
      unverified: true,
      transactions: true,
      users: true,
      subscribers: true,
    });
    try {
      const [restRes, transRes, userRes, subsRes] = await Promise.all([
        axiosInstance.get("/restaurant/all"),
        axiosInstance.get("/payment/transaction"),
        axiosInstance.get("/user/all"),
        axiosInstance.get("/subscribe/all"),
      ]);

      const restaurantList = restRes.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
      setTransactions(transRes.data?.data || []);
      setUsers(userRes.data?.users || []);
      setSubscribers(subsRes.data?.subscriptions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading({
      dashboard: false,
      restaurants: false,
      unverified: false,
      transactions: false,
      users: false,
      subscribers: false,
    });
  };

  const approveRestaurant = async (id) => {
    setLoading((prev) => ({ ...prev, unverified: true }));
    try {
      await axiosInstance.put(`/admin/verify/${id}`);
      const updatedRestaurants = await axiosInstance.get("/restaurant/all");
      const restaurantList = updatedRestaurants.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
    } catch (error) {
      console.error("Error approving restaurant:", error);
    }
    setLoading((prev) => ({ ...prev, unverified: false }));
  };

  const deleteRestaurant = async (id) => {
    try {
      await axiosInstance.delete(`/restaurant/delete/${id}`);
      const updatedRestaurants = await axiosInstance.get("/restaurant/all");
      const restaurantList = updatedRestaurants.data?.restaurant || [];
      setRestaurants(restaurantList);
      setUnverifiedRestaurants(restaurantList.filter((r) => !r.isVerified));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/user/delete/${id}`);
      const response = await axiosInstance.get("/user/all");
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
    if (e.target.name === "expiryDate") {
      const today = new Date();
      const inputDate = new Date(e.target.value);
      setDateError(inputDate < today ? "Expiry date must be in the future." : "");
    }
  };

  const createCoupon = async () => {
    if (
      !coupon.code ||
      !coupon.discountPercentage ||
      !coupon.minOrderVal ||
      !coupon.maxDiscValue ||
      !coupon.expiryDate
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (dateError) return;

    setLoading((prev) => ({ ...prev, coupon: true }));
    try {
      await axiosInstance.post("/coupon/create", coupon);
      setCoupon({
        code: "",
        discountPercentage: "",
        minOrderVal: "",
        maxDiscValue: "",
        expiryDate: "",
        isAvailable: true,
      });
      setFormError("");
      setCouponSuccess("Coupon created successfully!");
      setTimeout(() => setCouponSuccess(""), 3000);
    } catch (error) {
      console.error("Error creating coupon:", error);
      setCouponSuccess("");
      setFormError("Failed to create coupon. Please try again.");
    }
    setLoading((prev) => ({ ...prev, coupon: false }));
  };

  const handleSignOut = () => {
    Cookies.remove("authTokenAdmin");
    navigate("/");
  };

  const filtered = (list) =>
    list.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const calculateRevenue = () => {
    return transactions.reduce((total, t) => total + t.amount, 0);
  };

  const getRecentActivities = () => {
    const recentRestaurants = [...restaurants]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    return { recentRestaurants, recentTransactions, recentUsers };
  };

  const viewRestaurantDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetails(true);
  };

  return (
    <DashboardContainer fluid>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img
                  src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
                  alt="Admin Logo"
                  height="60"
                  className="me-3"
                />
                <h1 className="mb-0">Admin Dashboard</h1>
              </div>
              <ActionButton 
                variant="danger" 
                onClick={handleSignOut}
                className="d-flex align-items-center"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </ActionButton>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Sidebar */}
          <Col md={3}>
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
                  Restaurants <Badge bg="secondary" className="ms-2">{restaurants.length}</Badge>
                </NavLink>
                <NavLink 
                  eventKey="unverified" 
                  active={activeKey === "unverified"}
                  onClick={() => setActiveKey("unverified")}
                >
                  <FaBell />
                  Unverified <Badge bg="warning" className="ms-2">{unverifiedRestaurants.length}</Badge>
                </NavLink>
                <NavLink 
                  eventKey="subscribers" 
                  active={activeKey === "subscribers"}
                  onClick={() => setActiveKey("subscribers")}
                >
                  <FaEnvelope />
                  Subscribers <Badge bg="info" className="ms-2">{subscribers.length}</Badge>
                </NavLink>
                <NavLink 
                  eventKey="transactions" 
                  active={activeKey === "transactions"}
                  onClick={() => setActiveKey("transactions")}
                >
                  <FaMoneyBillWave />
                  Transactions <Badge bg="success" className="ms-2">{transactions.length}</Badge>
                </NavLink>
                <NavLink 
                  eventKey="users" 
                  active={activeKey === "users"}
                  onClick={() => setActiveKey("users")}
                >
                  <FaUsers />
                  Users <Badge bg="primary" className="ms-2">{users.length}</Badge>
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
          </Col>

          {/* Main Content */}
          <Col md={9}>
            {activeKey !== "dashboard" && (
              <div className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-pill"
                  style={{ padding: '0.75rem 1.25rem' }}
                />
              </div>
            )}

            {activeKey === "dashboard" && (
              loading.dashboard ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div>
                  {/* Stats Cards */}
                  <Row className="mb-4 g-4">
                    <Col md={3}>
                      <StatCard className="text-white bg-primary">
                        <Card.Body>
                          <Card.Title>Restaurants</Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2>{restaurants.length}</h2>
                            <FaStore size={30} />
                          </div>
                          <Card.Text>
                            {unverifiedRestaurants.length} pending verification
                          </Card.Text>
                        </Card.Body>
                      </StatCard>
                    </Col>
                    <Col md={3}>
                      <StatCard className="text-white bg-success">
                        <Card.Body>
                          <Card.Title>Transactions</Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2>{transactions.length}</h2>
                            <FaMoneyBillWave size={30} />
                          </div>
                          <Card.Text>
                            ₹{calculateRevenue().toLocaleString()} total revenue
                          </Card.Text>
                        </Card.Body>
                      </StatCard>
                    </Col>
                    <Col md={3}>
                      <StatCard className="text-white bg-info">
                        <Card.Body>
                          <Card.Title>Users</Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2>{users.length}</h2>
                            <FaUsers size={30} />
                          </div>
                          <Card.Text>
                            {subscribers.length} email subscribers
                          </Card.Text>
                        </Card.Body>
                      </StatCard>
                    </Col>
                    <Col md={3}>
                      <StatCard className="text-white bg-warning">
                        <Card.Body>
                          <Card.Title>Menu Items</Card.Title>
                          <div className="d-flex justify-content-between align-items-center">
                            <h2>
                              {restaurants.reduce(
                                (total, r) => total + (r.menu?.length || 0),
                                0
                              )}
                            </h2>
                            <FaUtensils size={30} />
                          </div>
                          <Card.Text>
                            Across all restaurants
                          </Card.Text>
                        </Card.Body>
                      </StatCard>
                    </Col>
                  </Row>

                  {/* Recent Activities */}
                  <Row className="g-4">
                    <Col md={6}>
                      <Card>
                        <Card.Header className="bg-white">
                          <h5 className="mb-0">Recent Restaurants</h5>
                        </Card.Header>
                        <Card.Body>
                          {getRecentActivities().recentRestaurants.length > 0 ? (
                            <Table hover className="mb-0">
                              <tbody>
                                {getRecentActivities().recentRestaurants.map((r) => (
                                  <tr 
                                    key={r._id} 
                                    onClick={() => viewRestaurantDetails(r)} 
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <td>
                                      <img 
                                        src={r.image} 
                                        alt={r.name} 
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                      />
                                    </td>
                                    <td>{r.name}</td>
                                    <td className="text-end">
                                      {r.isVerified ? (
                                        <Badge bg="success">Verified</Badge>
                                      ) : (
                                        <Badge bg="warning">Pending</Badge>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : (
                            <p className="text-muted mb-0">No recent restaurants</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card>
                        <Card.Header className="bg-white">
                          <h5 className="mb-0">Recent Transactions</h5>
                        </Card.Header>
                        <Card.Body>
                          {getRecentActivities().recentTransactions.length > 0 ? (
                            <Table hover className="mb-0">
                              <tbody>
                                {getRecentActivities().recentTransactions.map((t) => (
                                  <tr key={t._id}>
                                    <td>#{t.orderId.slice(0, 8)}</td>
                                    <td>{t.user?.name || 'Guest'}</td>
                                    <td className="text-end">₹{t.amount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : (
                            <p className="text-muted mb-0">No recent transactions</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Quick Actions */}
                  <Row className="mt-4 g-4">
                    <Col md={6}>
                      <Card>
                        <Card.Header className="bg-white">
                          <h5 className="mb-0">Recent Users</h5>
                        </Card.Header>
                        <Card.Body>
                          {getRecentActivities().recentUsers.length > 0 ? (
                            <Table hover className="mb-0">
                              <tbody>
                                {getRecentActivities().recentUsers.map((u) => (
                                  <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td className="text-end"><Badge bg="secondary">{u.role}</Badge></td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ) : (
                            <p className="text-muted mb-0">No recent users</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card>
                        <Card.Header className="bg-white">
                          <h5 className="mb-0">Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                          <Row className="g-3">
                            <Col md={6}>
                              <ActionButton 
                                variant="primary" 
                                className="w-100"
                                onClick={() => setActiveKey("unverified")}
                              >
                                Verify Restaurants
                              </ActionButton>
                            </Col>
                            <Col md={6}>
                              <ActionButton 
                                variant="success" 
                                className="w-100"
                                onClick={() => setActiveKey("coupon")}
                              >
                                Create Coupon
                              </ActionButton>
                            </Col>
                            <Col md={6}>
                              <ActionButton 
                                variant="info" 
                                className="w-100"
                                onClick={() => setActiveKey("users")}
                              >
                                Manage Users
                              </ActionButton>
                            </Col>
                            <Col md={6}>
                              <ActionButton 
                                variant="warning" 
                                className="w-100"
                                onClick={() => setActiveKey("restaurants")}
                              >
                                View All Restaurants
                              </ActionButton>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            )}

            {activeKey === "restaurants" && (
              loading.restaurants ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {filtered(restaurants).map((restaurant) => (
                    <Col key={restaurant._id}>
                      <RestaurantCard onClick={() => viewRestaurantDetails(restaurant)}>
                        <Card.Img 
                          variant="top" 
                          src={restaurant.image} 
                          style={{ height: '200px', objectFit: 'cover' }} 
                        />
                        <Card.Body>
                          <Card.Title>{restaurant.name}</Card.Title>
                          <Card.Text>
                            <small className="text-muted">
                              <FaEnvelope className="me-2" /> {restaurant.email}
                            </small>
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg={restaurant.isVerified ? "success" : "danger"}>
                              {restaurant.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this restaurant?')) {
                                  deleteRestaurant(restaurant._id);
                                }
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </Card.Body>
                      </RestaurantCard>
                    </Col>
                  ))}
                </Row>
              )
            )}

            {activeKey === "unverified" && (
              loading.unverified ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {filtered(unverifiedRestaurants).map((restaurant) => (
                    <Col key={restaurant._id}>
                      <RestaurantCard onClick={() => viewRestaurantDetails(restaurant)}>
                        <Card.Img 
                          variant="top" 
                          src={restaurant.image} 
                          style={{ height: '200px', objectFit: 'cover' }} 
                        />
                        <Card.Body>
                          <Card.Title>{restaurant.name}</Card.Title>
                          <Card.Text>
                            <small className="text-muted">
                              <FaEnvelope className="me-2" /> {restaurant.email}
                            </small>
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="warning">Pending Verification</Badge>
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveRestaurant(restaurant._id);
                              }}
                              disabled={loading.unverified}
                            >
                              {loading.unverified ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <>
                                  <FaCheck className="me-1" /> Approve
                                </>
                              )}
                            </Button>
                          </div>
                        </Card.Body>
                      </RestaurantCard>
                    </Col>
                  ))}
                </Row>
              )
            )}

            {activeKey === "subscribers" && (
              <Card>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Email Subscribers</h5>
                </Card.Header>
                <Card.Body>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered(subscribers).map((s) => (
                        <tr key={s._id}>
                          <td>{s.email}</td>
                          <td>{new Date(s.subscribedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {activeKey === "transactions" && (
              <Card>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Transactions</h5>
                </Card.Header>
                <Card.Body>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t._id}>
                          <td>#{t.orderId}</td>
                          <td>{t.user?.name}</td>
                          <td>₹{t.amount}</td>
                          <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {activeKey === "users" && (
              <Card>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Users</h5>
                </Card.Header>
                <Card.Body>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered(users).map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => deleteUser(u._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {activeKey === "coupon" && (
              <Card>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Create Coupon</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="couponCode">
                          <Form.Label>Coupon Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. SUMMER20"
                            name="code"
                            value={coupon.code}
                            onChange={handleCouponChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="discountPercentage">
                          <Form.Label>Discount Percentage</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g. 20"
                            name="discountPercentage"
                            value={coupon.discountPercentage}
                            onChange={handleCouponChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="minOrderVal">
                          <Form.Label>Minimum Order Value</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g. 500"
                            name="minOrderVal"
                            value={coupon.minOrderVal}
                            onChange={handleCouponChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="maxDiscValue">
                          <Form.Label>Maximum Discount Value</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="e.g. 200"
                            name="maxDiscValue"
                            value={coupon.maxDiscValue}
                            onChange={handleCouponChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group controlId="expiryDate">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="expiryDate"
                            value={coupon.expiryDate}
                            onChange={handleCouponChange}
                          />
                          {dateError && <Form.Text className="text-danger">{dateError}</Form.Text>}
                        </Form.Group>
                      </Col>
                    </Row>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    {couponSuccess && <Alert variant="success">{couponSuccess}</Alert>}
                    <Button 
                      variant="primary" 
                      onClick={createCoupon} 
                      disabled={loading.coupon}
                      className="d-flex align-items-center"
                    >
                      {loading.coupon ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaPlus className="me-2" />
                          Create Coupon
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Restaurant Details Modal */}
        <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRestaurant?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRestaurant && (
              <Row>
                <Col md={4}>
                  <img 
                    src={selectedRestaurant.image} 
                    alt={selectedRestaurant.name} 
                    className="img-fluid rounded mb-3"
                  />
                  <div className="d-flex align-items-center mb-2">
                    <FaStar className="me-2 text-warning" />
                    <span>Rating: {selectedRestaurant.rating || "N/A"}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    {selectedRestaurant.isVerified ? (
                      <>
                        <FaCheck className="me-2 text-success" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="me-2 text-danger" />
                        <span>Not Verified</span>
                      </>
                    )}
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    {selectedRestaurant.isOpen ? (
                      <>
                        <FaCheck className="me-2 text-success" />
                        <span>Currently Open</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="me-2 text-danger" />
                        <span>Currently Closed</span>
                      </>
                    )}
                  </div>
                  {!selectedRestaurant.isVerified && (
                    <Button 
                      variant="success" 
                      className="w-100 mt-3"
                      onClick={() => {
                        approveRestaurant(selectedRestaurant._id);
                        setShowDetails(false);
                      }}
                      disabled={loading.unverified}
                    >
                      {loading.unverified ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <FaCheck className="me-1" /> Approve Restaurant
                        </>
                      )}
                    </Button>
                  )}
                </Col>
                <Col md={8}>
                  <h5>Contact Information</h5>
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-2" />
                    <span>{selectedRestaurant.email}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="me-2" />
                    <span>{selectedRestaurant.phone}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-2" />
                    <span>Contact Email: {selectedRestaurant.contactEmail}</span>
                  </div>
                  
                  <h5 className="mt-4">Menu Items ({selectedRestaurant.menu?.length || 0})</h5>
                  {selectedRestaurant.menu?.length > 0 ? (
                    <div className="menu-items-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedRestaurant.menu.map((item) => (
                        <div key={item._id} className="menu-item p-3 mb-3 border rounded">
                          <div className="d-flex">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="img-thumbnail me-3"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6>{item.name}</h6>
                              <p className="text-muted">{item.description}</p>
                              <div className="d-flex justify-content-between">
                                <span className="fw-bold">₹{item.price}</span>
                                <span className="badge bg-secondary">{item.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No menu items available</p>
                  )}
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this restaurant?')) {
                  deleteRestaurant(selectedRestaurant._id);
                  setShowDetails(false);
                }
              }}
            >
              <FaTrash className="me-1" /> Delete Restaurant
            </Button>
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </DashboardContainer>
  );
};

export default AdminDashboard;