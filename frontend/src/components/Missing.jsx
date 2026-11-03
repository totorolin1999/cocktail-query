import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const Missing = () => {
  return (
    <Container className="page-section">
      <Card className="not-found-card">
        <Card.Header>404 - 找不到網頁</Card.Header>
        <Card.Body className="p-4 p-md-5">
          <div className="not-found-code">404</div>
          <Card.Title className="not-found-title mb-3">
            本網站並沒有此頁面
          </Card.Title>
          <Card.Text className="not-found-desc mb-4">
            抱歉，您所尋找的頁面不存在或已被移除。您是否要回到首頁？
          </Card.Text>
          <Button variant="warning" as={Link} to="/" className="btn-accent px-4 py-2">
            回到首頁
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Missing;
