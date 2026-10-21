import axios from "axios";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CocktailDetail from "../components/CocktailDetail";
import CocktailRec from "../components/CocktailRec";
import API_BASE_URL from "../apiConfig";

const Cocktail = () => {
  const [cocktail, setCocktail] = useState([]);
  const [cocktails, setCocktails] = useState([]);

  const location = useLocation();

  const cocktailId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchCocktail = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/cocktail-detail/${cocktailId}/`
        );
        setCocktail(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCocktails = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/cocktail-recommendation/${cocktailId}/`
        );
        setCocktails(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCocktail();
    fetchCocktails();
  }, [cocktailId]);

  return (
    <div className="page-section">
      <Container>
        <Row className="g-4">
          <Col xs={12} lg={6}>
            <CocktailDetail data={cocktail} />
          </Col>
          <Col xs={12} lg={6}>
            <CocktailRec data={cocktails} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cocktail;
