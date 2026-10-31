import Badge from "react-bootstrap/Badge";
import { useTranslation } from "react-i18next";

const IbaBadge = ({ category }) => {
  const [t] = useTranslation("global");

  if (!category) {
    return null;
  }

  return (
    <Badge bg="info" text="dark" className="iba-badge">
      {t("detail.ibaTag")}
    </Badge>
  );
};

export default IbaBadge;
