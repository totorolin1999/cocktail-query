import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import MaterialPieChart from "../components/MaterialPieChart";
import MaterialBarChart from "../components/MaterialBarChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

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
        fetchData(`${API_BASE_URL}/api/chart-list/base/`, setBaseChart),
        fetchData(`${API_BASE_URL}/api/chart-list/liqueur/`, setLiqueurChart),
        fetchData(`${API_BASE_URL}/api/chart-list/alcohol/`, setAlcoholChart),
        fetchData(`${API_BASE_URL}/api/chart-list/ingredient/`, setIngredientChart),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage />;

  return (
    <div className="chartPageColor">
      <Container>
        <Row>
          <Col xs={12} md={5}>
            <MaterialPieChart chartData={baseChart} />
          </Col>
          <Col xs={12} md={7}>
            <MaterialBarChart chartData={liqueurChart} />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5}>
            <MaterialPieChart chartData={alcoholChart} />
          </Col>
          <Col xs={12} md={7}>
            <MaterialBarChart chartData={ingredientChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Charts;
