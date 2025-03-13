import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import BaseTable from "../components/baseTable/BaseTable";
import BaseChart from "../components/baseChart/BaseChart";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from '../apiConfig';

const Bases = () => {
  const [bases, setBases] = useState([]);

  useEffect(() => {
    const fetchAllBases = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/base-list/`);
        setBases(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBases();
  }, []);

  return (
    <Container>
      <Button variant="secondary" as={Link} to="/AddBase" className="mt-5">
        新增基酒
      </Button>
      <Row className="mb-5">
        <Col xs={12} md={6}>
          <BaseTable data={bases} />
        </Col>
        <Col xs={12} md={6}>
          <BaseChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Bases;
