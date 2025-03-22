import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import LiqueurTable from "../components/liqueurTable/LiqueurTable";
import LiqueurChart from "../components/liqueurChart/LiqueurChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const Liqueurs = () => {
  const [liqueurs, setLiqueurs] = useState([]);
  const [liqueurChart, setLiqueurChart] = useState([]);
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
        fetchData(`${API_BASE_URL}/api/material-list/liqueur/`, setLiqueurs),
        fetchData(`${API_BASE_URL}/api/chart-list/liqueur/`, setLiqueurChart),
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
        <Button variant="secondary" as={Link} to="/AddLiqueur" className="mt-5">
          新增利口酒
        </Button>
        <Row className="mb-5">
          <Col xs={12} md={5}>
            <LiqueurTable data={liqueurs} />
          </Col>
          <Col xs={12} md={7}>
            <LiqueurChart chartData={liqueurChart} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Liqueurs;
