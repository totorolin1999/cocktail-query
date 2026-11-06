import axios from "axios";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
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
          `${API_BASE_URL}/api/v1/cocktails/${cocktailId}/`
        );
        setCocktail(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCocktails = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/cocktails/${cocktailId}/recommendations/`
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
      <Container className="cocktail-detail-layout">
        <CocktailDetail data={cocktail} />
        <CocktailRec data={cocktails} />
      </Container>
    </div>
  );
};

export default Cocktail;
