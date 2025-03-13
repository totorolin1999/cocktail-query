import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import IngredientTable from "../components/ingredientTable/IngredientTable";
import IngredientChart from "../components/ingredientChart/IngredientChart";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from '../apiConfig';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/ingredient-list/`
        );
        setIngredients(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllIngredients();
  }, []);

  return (
    <Container>
      <Button
        variant="secondary"
        as={Link}
        to="/AddIngredient"
        className="mt-5"
      >
        新增其他成分
      </Button>
      <Row className="mb-5">
        <Col xs={12} md={5}>
          <IngredientTable data={ingredients} />
        </Col>
        <Col xs={12} md={7}>
          <IngredientChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Ingredients;
