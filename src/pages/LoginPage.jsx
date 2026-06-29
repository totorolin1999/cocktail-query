import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <div className="login-page">
      <Container>
        <Card
          bg="dark"
          text="white"
          className="login-card mx-auto"
        >
          <Card.Header>管理員登入</Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={loginUser}>
              <Form.Group className="mb-3">
                <Form.Label>帳號</Form.Label>
                <Form.Control placeholder="請輸入姓名" name="username" />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>密碼</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="請輸入密碼"
                  name="password"
                />
              </Form.Group>
              <Button variant="warning" type="submit" className="w-100 btn-accent">
                登入
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
