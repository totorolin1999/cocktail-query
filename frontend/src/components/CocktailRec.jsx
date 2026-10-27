import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";

const CocktailRec = ({ data }) => {
  const [t, i18n] = useTranslation("global");

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="rec-section">
      <Alert variant="warning" className="text-center rec-alert">
        {t("recommend.message")}
      </Alert>
      <Carousel className="rec-carousel">
        {data.map((item, idx) => (
          <Carousel.Item key={idx}>
            <Card
              bg="secondary"
              text="white"
              border="warning"
              className="text-center cocktailCard mx-auto rec-card"
            >
              <Card.Header>{item.English_Name}</Card.Header>
              <Card.Img
                variant="top"
                src={`${API_BASE_URL}${item.image}`}
                className="cocktail-card-img"
                alt={item.English_Name}
              />
              <Card.Body>
                <Button
                  variant="warning"
                  as={Link}
                  to={`/Cocktail/${item.id}`}
                  className="btn-accent"
                >
                  {i18n.language === "chinese"
                    ? item.Chinese_Name
                    : item.English_Name}
                </Button>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CocktailRec;
