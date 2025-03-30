import useAxios from "../utils/useAxios";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import API_BASE_URL from "../apiConfig";

const AddCocktail = () => {
  const [bases, setBases] = useState([]);
  const [liqueurs, setLiqueurs] = useState([]);
  const [alcohols, setAlcohols] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedLiqueurs, setSelectedLiqueurs] = useState([]);
  const [selectedAlcohols, setSelectedAlcohols] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [cocktail, setCocktail] = useState({
    Chinese_Name: "",
    English_Name: "",
    Bases: selectedBases,
    Liqueurs: selectedLiqueurs,
    Alcohols: selectedAlcohols,
    Ingredients: selectedIngredients,
  });

  let api = useAxios();

  const animatedComponents = makeAnimated();

  useEffect(() => {
    setCocktail((prev) => ({
      ...prev,
      Bases: selectedBases,
      Liqueurs: selectedLiqueurs,
      Alcohols: selectedAlcohols,
      Ingredients: selectedIngredients,
    }));
  }, [selectedBases, selectedLiqueurs, selectedAlcohols, selectedIngredients]);

  useEffect(() => {
    const fetchBases = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/material-list/base/`);
      setBases(res.data);
    };
    const fetchLiqueurs = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/material-list/liqueur/`);
      setLiqueurs(res.data);
    };
    const fetchAlcohols = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/material-list/alcohol/`);
      setAlcohols(res.data);
    };
    const fetchIngredients = async () => {
      const res = await axios.get(
        `${API_BASE_URL}/api/material-list/ingredient/`
      );
      setIngredients(res.data);
    };
    fetchBases();
    fetchLiqueurs();
    fetchAlcohols();
    fetchIngredients();
  }, []);

  console.log(
    bases.map((item) => ({ value: item.id, label: item.Chinese_Name }))
  );

  const baseOptions = bases.map((item) => ({
    value: item.id,
    label: item.Chinese_Name,
  }));

  const liqueurOptions = liqueurs.map((item) => ({
    value: item.id,
    label: item.Chinese_Name,
  }));

  const alcoholOptions = alcohols.map((item) => ({
    value: item.id,
    label: item.Chinese_Name,
  }));

  const ingredientOptions = ingredients.map((item) => ({
    value: item.id,
    label: item.Chinese_Name,
  }));

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCocktail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API_BASE_URL}/api/cocktail-create/`, cocktail);
      navigate("/Cocktails");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="p-5 d-flex justify-content-center">
      <Card
        bg={"primary"}
        key={"primary"}
        text={"dark"}
        style={{ width: "25rem" }}
        className="mb-2"
      >
        <Card.Header>新增調酒</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="m-3">
              <Form.Label>中文名稱</Form.Label>
              <Form.Control
                placeholder="輸入中文名稱"
                onChange={handleChange}
                name="Chinese_Name"
              />
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label>英文名稱</Form.Label>
              <Form.Control
                placeholder="輸入英文名稱"
                onChange={handleChange}
                name="English_Name"
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>基酒</Form.Label>
              <Select
                components={animatedComponents}
                onChange={(item) => setSelectedBases(item)}
                isMulti
                options={baseOptions}
                placeholder="選取基酒"
              />
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label>利口酒</Form.Label>
              <Select
                components={animatedComponents}
                onChange={(item) => setSelectedLiqueurs(item)}
                isMulti
                options={liqueurOptions}
                placeholder="選取利口酒"
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Label>其他酒類</Form.Label>
              <Select
                components={animatedComponents}
                onChange={(item) => setSelectedAlcohols(item)}
                isMulti
                options={alcoholOptions}
                placeholder="選取其他酒類"
              />
            </Form.Group>

            <Form.Group className="m-3">
              <Form.Label>其他成分</Form.Label>
              <Select
                components={animatedComponents}
                onChange={(item) => setSelectedIngredients(item)}
                isMulti
                options={ingredientOptions}
                placeholder="選取其他成分"
              />
            </Form.Group>

            <Button variant="light" onClick={handleClick} className="m-3">
              新增
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddCocktail;
