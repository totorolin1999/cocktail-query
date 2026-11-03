import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const AdminFormLayout = ({ title, subtitle, backTo, backLabel, wide, children }) => {
  return (
    <div className="chartPageColor page-section admin-form-page">
      <Container>
        <div className="d-flex justify-content-center">
          <div className={`admin-form-container${wide ? " admin-form-container--wide" : ""}`}>
            {backTo && (
              <div className="mb-3">
                <Button
                  variant="link"
                  as={Link}
                  to={backTo}
                  className="admin-form-back"
                >
                  ← {backLabel || "返回"}
                </Button>
              </div>
            )}
            <Card className={`admin-form-card${wide ? " admin-form-card--wide" : ""}`}>
              <Card.Header className="admin-form-header">
                <div className="admin-form-header-badge">管理後台</div>
                <h2 className="admin-form-title">{title}</h2>
                {subtitle && <p className="admin-form-subtitle mb-0">{subtitle}</p>}
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {children}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminFormLayout;
