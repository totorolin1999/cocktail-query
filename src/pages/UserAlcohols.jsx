import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import UserAlcoholTable from "../components/userAlcoholTable/UserAlcoholTable";
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
    <Container>
      <Row className="mt-5 mb-5">
        <Col xs={12} md={6}>
          <UserAlcoholTable data={alcohols} />
        </Col>
        <Col xs={12} md={6}>
          <AlcoholChart />
        </Col>
      </Row>
    </Container>
  );
};

export default Alcohols;
