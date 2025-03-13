import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          調酒查詢系統
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Cocktails">
              管理調酒
            </Nav.Link>
            <NavDropdown title="管理調酒成分" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/Bases">
                管理基酒
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Liqueurs">
                管理利口酒
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Alcohols">
                管理其他酒類
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Ingredients">
                管理其他成分
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/Charts">
                調酒成分視覺化
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
