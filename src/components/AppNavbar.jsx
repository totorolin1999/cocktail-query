import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/AuthContext";

const AppNavbar = () => {
  let { user, logoutUser } = useContext(AuthContext);

  const [t, i18n] = useTranslation("global");
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };
  return (
    <Navbar variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t("navbar.title")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Material/base">
              {t("navbar.base")}
            </Nav.Link>
            <Nav.Link as={Link} to="/Material/liqueur">
              {t("navbar.liqueur")}
            </Nav.Link>
            <Nav.Link as={Link} to="/Material/alcohol">
              {t("navbar.alcohol")}
            </Nav.Link>
            <Nav.Link as={Link} to="/Material/ingredient">
              {t("navbar.ingredient")}
            </Nav.Link>
            <Nav.Link as={Link} to="/Charts">
              {t("navbar.visualization")}
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={t("navbar.language")} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => handleChangeLanguage("chinese")}>
                中文
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleChangeLanguage("english")}>
                English
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {user && (
            <Nav>
              <Nav.Link onClick={logoutUser}>{user.username} 登出</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
