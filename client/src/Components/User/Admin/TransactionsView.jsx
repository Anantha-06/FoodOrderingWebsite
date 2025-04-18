// TransactionsView.js
import React from "react";
import { Card, Table } from "react-bootstrap";

const TransactionsView = ({ transactions }) => {
  return (
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
  );
};

export default TransactionsView;