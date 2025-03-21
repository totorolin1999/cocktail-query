import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import BaseChart from "../../components/baseChart/BaseChart";
import LiqueurChart from "../../components/liqueurChart/LiqueurChart";
import AlcoholChart from "../../components/alcoholChart/AlcoholChart";
import IngredientChart from "../../components/ingredientChart/IngredientChart";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../../apiConfig";

const Charts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseChart, setBaseChart] = useState([]);
  const [liqueurChart, setLiqueurChart] = useState([]);
  const [alcoholChart, setAlcoholChart] = useState([]);
  const [ingredientChart, setIngredientChart] = useState([]);

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
        fetchData(`${API_BASE_URL}/api/base-chart/`, setBaseChart),
        fetchData(`${API_BASE_URL}/api/liqueur-chart/`, setLiqueurChart),
        fetchData(`${API_BASE_URL}/api/alcohol-chart/`, setAlcoholChart),
        fetchData(`${API_BASE_URL}/api/ingredient-chart/`, setIngredientChart),
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
        <Row className="m-5">
          <Col xs={12} md={5}>
            <BaseChart chartData={baseChart} />
          </Col>
          <Col xs={12} md={7}>
            <LiqueurChart chartData={liqueurChart} />
          </Col>
        </Row>
        <Row className="m-5">
          <Col xs={12} md={5}>
            <AlcoholChart chartData={alcoholChart} />
          </Col>
          <Col xs={12} md={7}>
            <IngredientChart chartData={ingredientChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Charts;
