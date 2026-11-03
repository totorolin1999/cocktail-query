import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import InteractiveChartPanel from "../components/InteractiveChartPanel";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";

const Charts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baseChart, setBaseChart] = useState([]);
  const [liqueurChart, setLiqueurChart] = useState([]);
  const [alcoholChart, setAlcoholChart] = useState([]);
  const [ingredientChart, setIngredientChart] = useState([]);

  const [, i18n] = useTranslation("global");

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

  const isZh = i18n.language === "chinese";

  return (
    <div className="chartPageColor page-section">
      <Container>
        <div className="page-header">
          <h1 className="page-title">
            {isZh ? "資料視覺化" : "Data Visualization"}
          </h1>
          <p className="page-subtitle">
            {isZh
              ? "各類材料在調酒中的使用分布"
              : "Distribution of materials used across cocktails"}
          </p>
        </div>

        <Row className="g-4 mb-2">
          <Col xs={12} lg={6}>
            <InteractiveChartPanel
              chartData={baseChart}
              defaultType="doughnut"
              title={isZh ? "基酒使用分布" : "Base Spirits Distribution"}
            />
          </Col>
          <Col xs={12} lg={6}>
            <InteractiveChartPanel
              chartData={liqueurChart}
              defaultType="horizontal"
              title={isZh ? "利口酒使用分布" : "Liqueurs Distribution"}
            />
          </Col>
        </Row>
        <Row className="g-4">
          <Col xs={12} lg={6}>
            <InteractiveChartPanel
              chartData={alcoholChart}
              defaultType="doughnut"
              title={isZh ? "其他酒類使用分布" : "Other Alcohols Distribution"}
            />
          </Col>
          <Col xs={12} lg={6}>
            <InteractiveChartPanel
              chartData={ingredientChart}
              defaultType="horizontal"
              title={isZh ? "副材料使用分布" : "Ingredients Distribution"}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Charts;
