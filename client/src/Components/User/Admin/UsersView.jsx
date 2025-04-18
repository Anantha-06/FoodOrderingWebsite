// UsersView.js
import React from "react";
import { Card, Table, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

const UsersView = ({ users, deleteUser }) => {
  return (
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
            {users.map((u) => (
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
  );
};

export default UsersView;