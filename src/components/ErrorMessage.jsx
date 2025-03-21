import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

const ErrorMessage = ({ data }) => {
  return (
    <Container className="p-5">
      <Alert key="danger" variant="danger">
        {data}
      </Alert>
    </Container>
  );
};

export default ErrorMessage;
