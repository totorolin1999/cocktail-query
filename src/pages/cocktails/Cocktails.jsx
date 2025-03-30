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

  const downloadJsonFile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/backup-data/`);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cocktail_data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Download failed:", error);
    }
};

  return (
    <div className="chartPageColor">
      <Container>
        <Button variant="secondary" as={Link} to="/AddCocktail" className="mt-5">
          新增調酒
        </Button>
        <Button variant="warning" onClick={downloadJsonFile} className="mt-5">
          下載備份資料
        </Button>
        <CocktailTable data={cocktails} />
      </Container>
    </div>
  );
};

export default Cocktails;
