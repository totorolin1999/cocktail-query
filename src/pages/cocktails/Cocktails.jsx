import "./cocktails.scss";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import CocktailTable from "../../components/cocktailTable/CocktailTable";
import API_BASE_URL from '../../apiConfig';

const Cocktails = () => {
  const [cocktails, setCocktails] = useState([]);

  useEffect(() => {
    const fetchAllCocktails = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/cocktail-list/`);
        setCocktails(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCocktails();
  }, []);

  return (
    <div className="admin">
      <Container>
        <Button variant="secondary" as={Link} to="/AddCocktail" className="mt-5">
          新增調酒
        </Button>
        <CocktailTable data={cocktails} />
      </Container>
    </div>
  );
};

export default Cocktails;
