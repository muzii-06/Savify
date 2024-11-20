import React from 'react';
import { Card, Button } from 'react-bootstrap';

function Products() {
  return (
    <div>
      <h2>Your Products</h2>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Product 1</Card.Title>
          <Card.Text>Price: $100</Card.Text>
          <Button variant="primary">Edit</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Products;
