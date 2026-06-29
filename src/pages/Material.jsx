import React, { useContext } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MaterialTable from "../components/MaterialTable";
import MaterialPieChart from "../components/MaterialPieChart";
import MaterialBarChart from "../components/MaterialBarChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import AuthContext from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";

const materialTitles = {
  base: { zh: "基酒", en: "Base Spirits" },
  liqueur: { zh: "利口酒", en: "Liqueurs" },
  alcohol: { zh: "其他酒類", en: "Other Alcohols" },
  ingredient: { zh: "其他成分", en: "Other Ingredients" },
};

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [materialChart, setMaterialChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const material = location.pathname.split("/")[2];

  let { user } = useContext(AuthContext);
  const [, i18n] = useTranslation("global");

  const title = materialTitles[material] || { zh: material, en: material };

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
        fetchData(
          `${API_BASE_URL}/api/material-list/${material}/`,
          setMaterials
        ),
        fetchData(
          `${API_BASE_URL}/api/chart-list/${material}/`,
          setMaterialChart
        ),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [material]);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage />;

  return (
    <div className="chartPageColor page-section">
      <Container>
        <div className="page-header">
          <h1 className="page-title">
            {i18n.language === "chinese" ? title.zh : title.en}
          </h1>
        </div>

        {user && (
          <div className="page-actions">
            <Button
              variant="warning"
              as={Link}
              to={`/AddItem/${material}`}
              className="btn-accent"
            >
              新增
            </Button>
          </div>
        )}

        <Row className="g-4">
          <Col xs={12} lg={6}>
            <MaterialTable data={materials} />
          </Col>
          <Col xs={12} lg={6}>
            <div className="chart-panel">
              {material === "base" || material === "alcohol" ? (
                <MaterialPieChart chartData={materialChart} />
              ) : (
                <MaterialBarChart chartData={materialChart} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Material;
