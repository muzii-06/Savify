import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaBox, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import './Dashboard.css';

function DashboardContent() {
  return (
    <div className="dashboard-content">
      <h4>Dashboard Overview</h4>
      <Row>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="shadow-sm dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Products</h5>
                  <h3>120</h3>
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
                  <h3>$12,340</h3>
                </div>
                <FaDollarSign className="icon-large" />
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
                  <h3>45</h3>
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
