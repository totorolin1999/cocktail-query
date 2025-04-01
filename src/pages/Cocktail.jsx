import axios from "axios";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CocktailDetail from "../components/cocktailDetail/CocktailDetail";
import CocktailRec from "../components/cocktailRec/CocktailRec";
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
    <Container className="p-5">
      <Row className="p-5">
        <Col xs={12} md={6}>
          <CocktailDetail data={cocktail} />
        </Col>
        <Col xs={12} md={6}>
          <CocktailRec data={cocktails} />
        </Col>
      </Row>
    </Container>
  );
};

export default Cocktail;
