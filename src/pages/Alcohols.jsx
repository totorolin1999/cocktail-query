import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import AlcoholTable from "../components/alcoholTable/AlcoholTable";
import AlcoholChart from "../components/alcoholChart/AlcoholChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const Alcohols = () => {
  const [alcohols, setAlcohols] = useState([]);
  const [alcoholChart, setAlcoholChart] = useState([]);
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
        fetchData(`${API_BASE_URL}/api/material-list/alcohol/`, setAlcohols),
        fetchData(`${API_BASE_URL}/api/chart-list/alcohol/`, setAlcoholChart),
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
        <Button variant="secondary" as={Link} to="/AddAlcohol" className="mt-5">
          新增其他酒類
        </Button>
        <Row className="mb-5">
          <Col xs={12} md={6}>
            <AlcoholTable data={alcohols} />
          </Col>
          <Col xs={12} md={6}>
            <AlcoholChart chartData={alcoholChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Alcohols;
