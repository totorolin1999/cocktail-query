import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import AuthContext from "../../context/AuthContext";

const UserNavbar = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          調酒查詢系統
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {user ? (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/Cocktails">
                管理調酒
              </Nav.Link>
              <NavDropdown title="管理調酒成分" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/Material/base">
                  管理基酒
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Material/liqueur">
                  管理利口酒
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Material/alcohol">
                  管理其他酒類
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/Material/ingredient">
                  管理其他成分
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/Charts">
                  調酒成分視覺化
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Navbar.Text>目前身分為管理員：{user.username}</Navbar.Text>
            <Nav>
              <Nav.Link onClick={logoutUser}>登出</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        ) : (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/UserMaterial/base">
                基酒
              </Nav.Link>
              <Nav.Link as={Link} to="/UserMaterial/liqueur">
                利口酒
              </Nav.Link>
              <Nav.Link as={Link} to="/UserMaterial/alcohol">
                其他酒類
              </Nav.Link>
              <Nav.Link as={Link} to="/UserMaterial/ingredient">
                其他成分
              </Nav.Link>
              <Nav.Link as={Link} to="/Charts">
                調酒成分視覺化
              </Nav.Link>
            </Nav>
            {/* <Nav>
              <Nav.Link as={Link} to="/Cocktails">
                管理員登入
              </Nav.Link>
            </Nav> */}
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
