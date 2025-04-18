// SubscribersView.js
import React from "react";
import { Card, Table } from "react-bootstrap";

const SubscribersView = ({ subscribers }) => {
  return (
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
            {subscribers.map((s) => (
              <tr key={s._id}>
                <td>{s.email}</td>
                <td>{new Date(s.subscribedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SubscribersView;