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
} from "react-icons/fa";
import "../../PageStyle/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("restaurants");
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
  const [loading, setLoading] = useState({
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
    } catch {}
    setLoading({
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
    } catch {}
    setLoading((prev) => ({ ...prev, unverified: false }));
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/user/delete/${id}`);
      const response = await axiosInstance.get("/user/all");
      setUsers(response.data?.users || []);
    } catch {}
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
    } catch {
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
            <Nav.Link eventKey="restaurants" onClick={() => setActiveKey("restaurants")}>
              All Restaurants <Badge bg="secondary">{restaurants.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="unverified" onClick={() => setActiveKey("unverified")}>
              Unverified <Badge bg="warning">{unverifiedRestaurants.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="subscribers" onClick={() => setActiveKey("subscribers")}>
              Subscribers <Badge bg="info">{subscribers.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="transactions" onClick={() => setActiveKey("transactions")}>
              Transactions <Badge bg="success">{transactions.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="users" onClick={() => setActiveKey("users")}>
              Users <Badge bg="primary">{users.length}</Badge>
            </Nav.Link>
            <Nav.Link eventKey="coupon" onClick={() => setActiveKey("coupon")}>
              Create Coupon
            </Nav.Link>
            <Button variant="danger" className="mt-4" onClick={handleSignOut}>
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav>
        </Col>
        <Col md={9}>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          {activeKey === "restaurants" && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {filtered(restaurants).map((r) => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.isVerified ? <FaCheck color="green" /> : <FaTimes color="red" />}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {activeKey === "unverified" && (
            loading.unverified ? (
              <Spinner animation="border" />
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(unverifiedRestaurants).map((r) => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td>
                        <Button size="sm" onClick={() => approveRestaurant(r._id)}>
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
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
    </Container>
  );
};

export default AdminDashboard;
