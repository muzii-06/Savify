import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';

function AccountSetting() {
  return (
    <div>
      <h2>Account Setting</h2>
      <Card className="p-3">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default AccountSetting;
