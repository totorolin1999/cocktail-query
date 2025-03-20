import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import AlcoholTable from "../components/alcoholTable/AlcoholTable";
import AlcoholChart from "../components/alcoholChart/AlcoholChart";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from '../apiConfig';

const Alcohols = () => {
  const [alcohols, setAlcohols] = useState([]);

  useEffect(() => {
    const fetchAllAlcohols = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/alcohol-list/`);
        setAlcohols(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllAlcohols();
  }, []);

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
            <AlcoholChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Alcohols;
