import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import UserIngredientTable from "../components/userIngredientTable/UserIngredientTable";
import IngredientChart from "../components/ingredientChart/IngredientChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ingredient-list/`);
        setIngredients(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage data={error} />;

  return (
    <div className="chartPageColor">
      <Container>
        <Row className="mt-5 mb-5">
          <Col xs={12} md={5}>
            <UserIngredientTable data={ingredients} />
          </Col>
          <Col xs={12} md={7}>
            <IngredientChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ingredients;
