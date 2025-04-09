import React from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";

const ErrorMessage = () => {
  const [t, i18n] = useTranslation("global");
  return (
    <Container className="p-5">
      <Alert key="danger" variant="danger">
        {t("error.message")}
      </Alert>
    </Container>
  );
};

export default ErrorMessage;
