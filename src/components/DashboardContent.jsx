import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaBox, FaDollarSign, FaShoppingCart,FaMoneyBillWave } from 'react-icons/fa';
// import './Dashboard.css';

function DashboardContent() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const sellerId = localStorage.getItem('sellerId');

    if (!sellerId) {
      console.error("❌ sellerId not found in localStorage");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/seller/${sellerId}/stats`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Fetch failed');

        setStats(data);
      } catch (error) {
        console.error("❌ Error fetching stats:", error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-content">
      <h4 className='text-white'>Dashboard Overview</h4>
      <Row>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="shadow-sm dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Products</h5>
                  <h3>{stats.totalProducts}</h3>
                </div>
                <FaBox className="icon-large" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="shadow-sm dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Revenue</h5>
                  <h3>Rs {Math.floor(stats.totalRevenue)}</h3>

                </div>
                <FaMoneyBillWave className="icon-large" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="shadow-sm dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Orders</h5>
                  <h3>{stats.totalOrders}</h3>
                </div>
                <FaShoppingCart className="icon-large" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardContent;
