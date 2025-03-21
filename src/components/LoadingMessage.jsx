import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

const LoadingMessage = () => {
  return (
    <Container className="p-5">
      <Alert key="success" variant="success">
        本系統供測試使用，伺服器可能會因為沒有人使用而休眠，請耐心等候（最長至一分鐘）！
      </Alert>
      <Spinner animation="border" variant="warning" />
    </Container>
  );
};

export default LoadingMessage;
