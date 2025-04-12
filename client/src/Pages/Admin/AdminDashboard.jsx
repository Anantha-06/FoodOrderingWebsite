import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Button,
  Table,
  Badge,
  Spinner,
  Form,
  Alert,
  Card,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Axios/axiosInstance";
import Cookies from "js-cookie";
import {
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEnvelope,
  FaUtensils,
  FaPhone,
  FaStar,
  FaClock,
  FaChartLine,
  FaUsers,
  FaStore,
  FaMoneyBillWave,
  FaBell,
} from "react-icons/fa";
import "../../PageStyle/AdminDashboard.css";

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
  }, []);

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
    <Container fluid className="p-4">
      <div>
        <img
          src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png"
          alt="Admin Logo"
          className="admin-logo"
        />
        <h1 className="text-center mt-3">Admin Dashboard</h1>
      </div>
      <Row>
        <Col md={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Link eventKey="dashboard" onClick={() => setActiveKey("dashboard")}>
              <FaChartLine className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link eventKey="restaurants" onClick={() => setActiveKey("restaurants")}>
              <FaStore className="me-2" />
              Restaurants <Badge bg="secondary">{restaurants.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="unverified" onClick={() => setActiveKey("unverified")}>
              <FaBell className="me-2" />
              Unverified <Badge bg="warning">{unverifiedRestaurants.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="subscribers" onClick={() => setActiveKey("subscribers")}>
              <FaEnvelope className="me-2" />
              Subscribers <Badge bg="info">{subscribers.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="transactions" onClick={() => setActiveKey("transactions")}>
              <FaMoneyBillWave className="me-2" />
              Transactions <Badge bg="success">{transactions.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="users" onClick={() => setActiveKey("users")}>
              <FaUsers className="me-2" />
              Users <Badge bg="primary">{users.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="coupon" onClick={() => setActiveKey("coupon")}>
              <FaPlus className="me-2" />
              Create Coupon
            </Nav.Link>
            <Button variant="danger" className="mt-4" onClick={handleSignOut}>
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav>
        </Col>
        <Col md={9}>
          {activeKey !== "dashboard" && (
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          )}

          {activeKey === "dashboard" && (
            loading.dashboard ? (
              <Spinner animation="border" />
            ) : (
              <div>
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="text-white bg-primary mb-3">
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
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-white bg-success mb-3">
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
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-white bg-info mb-3">
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
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-white bg-warning mb-3">
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
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h5>Recent Restaurants</h5>
                      </Card.Header>
                      <Card.Body>
                        {getRecentActivities().recentRestaurants.length > 0 ? (
                          <Table striped hover>
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
                                  <td>{r.isVerified ? (
                                    <Badge bg="success">Verified</Badge>
                                  ) : (
                                    <Badge bg="warning">Pending</Badge>
                                  )}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No recent restaurants</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h5>Recent Transactions</h5>
                      </Card.Header>
                      <Card.Body>
                        {getRecentActivities().recentTransactions.length > 0 ? (
                          <Table striped hover>
                            <tbody>
                              {getRecentActivities().recentTransactions.map((t) => (
                                <tr key={t._id}>
                                  <td>#{t.orderId.slice(0, 8)}</td>
                                  <td>{t.user?.name || 'Guest'}</td>
                                  <td>₹{t.amount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No recent transactions</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h5>Recent Users</h5>
                      </Card.Header>
                      <Card.Body>
                        {getRecentActivities().recentUsers.length > 0 ? (
                          <Table striped hover>
                            <tbody>
                              {getRecentActivities().recentUsers.map((u) => (
                                <tr key={u._id}>
                                  <td>{u.name}</td>
                                  <td>{u.email}</td>
                                  <td><Badge bg="secondary">{u.role}</Badge></td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No recent users</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Header>
                        <h5>Quick Actions</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Button 
                              variant="primary" 
                              className="w-100"
                              onClick={() => setActiveKey("unverified")}
                            >
                              Verify Restaurants
                            </Button>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Button 
                              variant="success" 
                              className="w-100"
                              onClick={() => setActiveKey("coupon")}
                            >
                              Create Coupon
                            </Button>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Button 
                              variant="info" 
                              className="w-100"
                              onClick={() => setActiveKey("users")}
                            >
                              Manage Users
                            </Button>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Button 
                              variant="warning" 
                              className="w-100"
                              onClick={() => setActiveKey("restaurants")}
                            >
                              View All Restaurants
                            </Button>
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
              <Spinner animation="border" />
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {filtered(restaurants).map((restaurant) => (
                  <Col key={restaurant._id}>
                    <Card 
                      onClick={() => viewRestaurantDetails(restaurant)} 
                      className="h-100 restaurant-card"
                    >
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
                        <div className="d-flex justify-content-between">
                          <Badge bg={restaurant.isVerified ? "success" : "danger"}>
                            {restaurant.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge bg="warning" text="dark">
                            <FaStar className="me-1" /> {restaurant.rating || "N/A"}
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          )}

          {activeKey === "unverified" && (
            loading.unverified ? (
              <Spinner animation="border" />
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {filtered(unverifiedRestaurants).map((restaurant) => (
                  <Col key={restaurant._id}>
                    <Card className="h-100">
                      <Card.Img 
                        variant="top" 
                        src={restaurant.image} 
                        style={{ height: '200px', objectFit: 'cover' }} 
                        onClick={() => viewRestaurantDetails(restaurant)}
                        className="cursor-pointer"
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
                            onClick={() => approveRestaurant(restaurant._id)}
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
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          )}

          {activeKey === "subscribers" && (
            <Table striped bordered hover>
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
          )}

          {activeKey === "transactions" && (
            <Table striped bordered hover>
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
                    <td>{t.orderId}</td>
                    <td>{t.user?.name}</td>
                    <td>₹{t.amount}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {activeKey === "users" && (
            <Table striped bordered hover>
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
          )}

          {activeKey === "coupon" && (
            <Form>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    placeholder="Code"
                    name="code"
                    value={coupon.code}
                    onChange={handleCouponChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Discount %"
                    name="discountPercentage"
                    value={coupon.discountPercentage}
                    onChange={handleCouponChange}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    placeholder="Min Order Value"
                    name="minOrderVal"
                    value={coupon.minOrderVal}
                    onChange={handleCouponChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Max Discount Value"
                    name="maxDiscValue"
                    value={coupon.maxDiscValue}
                    onChange={handleCouponChange}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={coupon.expiryDate}
                    onChange={handleCouponChange}
                  />
                </Col>
              </Row>
              {formError && <Alert variant="danger">{formError}</Alert>}
              {dateError && <Alert variant="warning">{dateError}</Alert>}
              {couponSuccess && <Alert variant="success">{couponSuccess}</Alert>}
              <Button onClick={createCoupon} disabled={loading.coupon}>
                {loading.coupon ? "Creating..." : "Create Coupon"} <FaPlus className="ms-2" />
              </Button>
            </Form>
          )}
        </Col>
      </Row>

      {/* Restaurant Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRestaurant?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRestaurant && (
            <div>
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
                    <div className="menu-items-container">
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
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;