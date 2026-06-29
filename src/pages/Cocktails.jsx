import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import CocktailTable from "../components/CocktailTable";
import API_BASE_URL from '../apiConfig';

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
    <div className="chartPageColor page-section">
      <Container>
        <div className="page-header">
          <h1 className="page-title">調酒管理</h1>
          <p className="page-subtitle">管理所有調酒資料</p>
        </div>

        <div className="page-actions">
          <Button variant="warning" as={Link} to="/AddCocktail" className="btn-accent">
            新增調酒
          </Button>
          <Button variant="outline-secondary" onClick={downloadJsonFile}>
            下載備份資料
          </Button>
        </div>

        <CocktailTable data={cocktails} />
      </Container>
    </div>
  );
};

export default Cocktails;
