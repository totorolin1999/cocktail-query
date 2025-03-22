import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import BaseTable from "../components/baseTable/BaseTable";
import BaseChart from "../components/baseChart/BaseChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const Bases = () => {
  const [bases, setBases] = useState([]);
  const [baseChart, setBaseChart] = useState([]);
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
        fetchData(`${API_BASE_URL}/api/material-list/base/`, setBases),
        fetchData(`${API_BASE_URL}/api/base-chart/`, setBaseChart),
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
        <Button variant="secondary" as={Link} to="/AddBase" className="mt-5">
          新增基酒
        </Button>
        <Row className="mb-5">
          <Col xs={12} md={6}>
            <BaseTable data={bases} />
          </Col>
          <Col xs={12} md={6}>
            <BaseChart chartData={baseChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Bases;
