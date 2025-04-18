// DashboardView.js
import React from "react";
import { 
  Row, Col, Card, Badge, Table, Button, Spinner 
} from "react-bootstrap";
import { 
  FaStore, FaMoneyBillWave, FaUsers, FaUtensils 
} from "react-icons/fa";
import StatCard from "./StatCard.jsx";

const DashboardView = ({ 
  loading,
  restaurants,
  unverifiedRestaurants,
  transactions,
  users,
  subscribers,
  viewRestaurantDetails,
  setActiveKey
}) => {
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
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
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => setActiveKey("unverified")}
                  >
                    Verify Restaurants
                  </Button>
                </Col>
                <Col md={6}>
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={() => setActiveKey("coupon")}
                  >
                    Create Coupon
                  </Button>
                </Col>
                <Col md={6}>
                  <Button 
                    variant="info" 
                    className="w-100"
                    onClick={() => setActiveKey("users")}
                  >
                    Manage Users
                  </Button>
                </Col>
                <Col md={6}>
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
  );
};

export default DashboardView;