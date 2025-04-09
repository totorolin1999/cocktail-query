import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import UserMaterialTable from "../components/materialTable/UserMaterialTable";
import MaterialPieChart from "../components/materialChart/MaterialPieChart";
import MaterialBarChart from "../components/materialChart/MaterialBarChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const UserMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [materialChart, setMaterialChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  const material = location.pathname.split("/")[2];

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
    <div className="chartPageColor">
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <UserMaterialTable data={materials} />
          </Col>
          <Col xs={12} md={6}>
            {material === "base" || material === "alcohol" ? (
              <MaterialPieChart chartData={materialChart} />
            ) : (
              <MaterialBarChart chartData={materialChart} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserMaterial;
