import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import UserBaseTable from "../components/userBaseTable/UserBaseTable";
import BaseChart from "../components/baseChart/BaseChart";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import API_BASE_URL from "../apiConfig";

const UserBases = () => {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/base-list/`);
        setBases(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBases();
  }, []);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage data={error} />;

  return (
    <div className="chartPageColor">
      <Container>
        <Row className="mt-5 mb-5">
          <Col xs={12} md={6}>
            <UserBaseTable data={bases} />
          </Col>
          <Col xs={12} md={6}>
            <BaseChart />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserBases;
