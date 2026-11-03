import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import InteractiveChartPanel from "../components/InteractiveChartPanel";
import MaterialTable from "../components/MaterialTable";
import Missing from "../components/Missing";
import API_BASE_URL from "../apiConfig";
import { isValidMaterial, MATERIAL_TITLES } from "../utils/materialUtils";

const Material = () => {
  const params = useParams();
  const location = useLocation();

  // 兼顧 /Material/:id 與 /Material/:material 路由命名
  const material =
    params.material ||
    params.id ||
    location.pathname.split("/")[2];

  const valid = isValidMaterial(material);

  const [materials, setMaterials] = useState([]);
  const [materialChart, setMaterialChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [, i18n] = useTranslation("global");

  const title = valid ? MATERIAL_TITLES[material] : { zh: "", en: "" };

  useEffect(() => {
    if (!valid) {
      setLoading(false);
      return;
    }

    const fetchData = async (url, setter) => {
      try {
        const res = await axios.get(url);
        setter(res.data);
      } catch (err) {
        setError(err.message);
      }
    };

    Promise.all([
      fetchData(`${API_BASE_URL}/api/material-list/${material}/`, setMaterials),
      fetchData(`${API_BASE_URL}/api/chart-list/${material}/`, setMaterialChart),
    ]).finally(() => setLoading(false));
  }, [material, valid]);

  if (!valid) {
    return <Missing />;
  }

  if (loading) {
    return (
      <div className="chartPageColor page-section d-flex justify-content-center align-items-center">
        <p className="text-muted">載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chartPageColor page-section d-flex justify-content-center align-items-center">
        <p className="text-danger">載入失敗：{error}</p>
      </div>
    );
  }

  return (
    <div className="chartPageColor page-section">
      <Container>
        <div className="page-header mb-4">
          <h1 className="page-title">
            {i18n.language === "chinese" ? title.zh : title.en}
          </h1>
        </div>

        <Row className="g-4">
          <Col xs={12} lg={6}>
            <MaterialTable data={materials} />
          </Col>
          <Col xs={12} lg={6}>
            <InteractiveChartPanel
              chartData={materialChart}
              defaultType={material === "liqueur" || material === "ingredient" ? "horizontal" : "doughnut"}
              title={`${i18n.language === "chinese" ? title.zh : title.en} ${i18n.language === "chinese" ? "使用分布" : "Usage Distribution"}`}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Material;
