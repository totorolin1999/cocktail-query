import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import API_BASE_URL from "../../apiConfig";

const CocktailRec = ({ data }) => {
  return (
    <>
      <Alert key="warning" variant="warning" className="text-center">
        推薦一些有相似成分的調酒
      </Alert>
      <Carousel>
        {data.map((item, idx) => (
          <Carousel.Item key={idx}>
            <Card
              bg="dark"
              text="white"
              border="warning"
              className="text-center cocktailCard"
            >
              <Card.Header className="text-success">
                {item.English_Name}
              </Card.Header>
              <Card.Img
                variant="top"
                src={`${API_BASE_URL}${item.image}`}
                style={{ width: "260px", height: "340px", objectFit: "cover" }}
                className="mx-auto"
              />
              <Card.Body>
                <Button variant="warning" as={Link} to={`/Cocktail/${item.id}`}>
                  {item.Chinese_Name}
                </Button>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default CocktailRec;
