import React from "react";
import Container from "react-bootstrap/Container";
import BaseChart from "../../components/baseChart/BaseChart";
import LiqueurChart from "../../components/liqueurChart/LiqueurChart";
import AlcoholChart from "../../components/alcoholChart/AlcoholChart";
import IngredientChart from "../../components/ingredientChart/IngredientChart";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const Charts = () => {
  return (
    <Container>
      <Row className="m-5">
        <Col xs={12} md={5}>
          <BaseChart />
        </Col>
        <Col xs={12} md={7}>
          <LiqueurChart />
        </Col>
      </Row>
      <Row className="m-5">
        <Col xs={12} md={5}>
          <AlcoholChart />
        </Col>
        <Col xs={12} md={7}>
          <IngredientChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Charts;
