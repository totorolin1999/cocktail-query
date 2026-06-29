import React from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

const LoadingMessage = () => {
  const [t] = useTranslation("global");
  return (
    <div className="status-panel">
      <Alert variant="success" className="w-100" style={{ maxWidth: "560px" }}>
        {t("loading.message")}
      </Alert>
      <Spinner animation="border" variant="warning" />
    </div>
  );
};

export default LoadingMessage;
