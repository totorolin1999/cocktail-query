import React from "react";
import Alert from "react-bootstrap/Alert";
import { useTranslation } from "react-i18next";

const ErrorMessage = () => {
  const [t] = useTranslation("global");
  return (
    <div className="status-panel">
      <Alert variant="danger" className="w-100" style={{ maxWidth: "560px" }}>
        {t("error.message")}
      </Alert>
    </div>
  );
};

export default ErrorMessage;
