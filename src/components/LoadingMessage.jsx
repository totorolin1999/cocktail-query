import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

const LoadingMessage = () => {
  const [t] = useTranslation("global");
  return (
    <Container className="p-5">
      <Alert key="success" variant="success">
        {t("loading.message")}
      </Alert>
      <Spinner animation="border" variant="warning" />
    </Container>
  );
};

export default LoadingMessage;
