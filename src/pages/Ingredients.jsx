import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import IngredientTable from "../components/ingredientTable/IngredientTable";
import IngredientChart from "../components/ingredientChart/IngredientChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientChart, setIngredientChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const res = await axios.get(url);
        setter(res.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAllData = async () => {
      await Promise.all([
        fetchData(`${API_BASE_URL}/api/material-list/ingredient/`, setIngredients),
        fetchData(`${API_BASE_URL}/api/chart-list/ingredient/`, setIngredientChart),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage data={error} />;

  return (
    <div className="chartPageColor">
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
            <IngredientChart chartData={ingredientChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ingredients;
