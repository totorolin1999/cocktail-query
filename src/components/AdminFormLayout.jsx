import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const AdminFormLayout = ({ title, subtitle, backTo, backLabel, wide, children }) => {
  return (
    <div className="chartPageColor page-section admin-form-page">
      <Container>
        {backTo && (
          <Button
            variant="link"
            as={Link}
            to={backTo}
            className="admin-form-back mb-3"
          >
            ← {backLabel || "返回"}
          </Button>
        )}
        <div className="d-flex justify-content-center">
          <Card className={`admin-form-card${wide ? " admin-form-card--wide" : ""}`}>
            <Card.Header>{title}</Card.Header>
            <Card.Body className="p-4">
              {subtitle && <p className="admin-form-subtitle">{subtitle}</p>}
              {children}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AdminFormLayout;
