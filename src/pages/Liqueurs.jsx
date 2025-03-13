import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import LiqueurTable from "../components/liqueurTable/LiqueurTable";
import LiqueurChart from "../components/liqueurChart/LiqueurChart";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from '../apiConfig';

const Liqueurs = () => {
  const [liqueurs, setLiqueurs] = useState([]);

  useEffect(() => {
    const fetchAllLiqueurs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/liqueur-list/`);
        setLiqueurs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllLiqueurs();
  }, []);

  return (
    <Container>
      <Button variant="secondary" as={Link} to="/AddLiqueur" className="mt-5">
        新增利口酒
      </Button>
      <Row className="mb-5">
        <Col xs={12} md={5}>
          <LiqueurTable data={liqueurs} />
        </Col>
        <Col xs={12} md={7}>
          <LiqueurChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Liqueurs;
