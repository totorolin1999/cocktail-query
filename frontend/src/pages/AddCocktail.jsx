import useAxios from "../utils/useAxios";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AdminFormLayout from "../components/AdminFormLayout";
import API_BASE_URL from "../apiConfig";
import { lightSelectProps } from "../utils/reactSelectConfig";
import { buildCocktailFormData } from "../utils/cocktailPayloadUtils";
import Alert from "react-bootstrap/Alert";

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
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
    try {
      const payload = buildCocktailFormData(cocktail);
      const response = await api.post(`${API_BASE_URL}/api/cocktail-create/`, payload);
      if (response?.status >= 200 && response?.status < 300) {
        navigate("/Cocktails");
      } else {
        setSubmitError("新增失敗，請稍後再試。");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || "新增失敗，請稍後再試。";
      setSubmitError(errorMessage);
    }
  };

  return (
    <AdminFormLayout
      title="新增調酒"
      subtitle="填寫調酒名稱並選取相關材料"
      backTo="/Cocktails"
      backLabel="返回調酒列表"
      wide
    >
      <Form onSubmit={handleClick}>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}
        <Form.Group className="mb-3">
          <Form.Label>中文名稱</Form.Label>
          <Form.Control
            placeholder="輸入中文名稱"
            onChange={handleChange}
            name="Chinese_Name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>英文名稱</Form.Label>
          <Form.Control
            placeholder="輸入英文名稱"
            onChange={handleChange}
            name="English_Name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>基酒</Form.Label>
          <Select
            components={animatedComponents}
            onChange={(item) => setSelectedBases(item || [])}
            isMulti
            options={baseOptions}
            placeholder="選取基酒"
            {...lightSelectProps}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>利口酒</Form.Label>
          <Select
            components={animatedComponents}
            onChange={(item) => setSelectedLiqueurs(item || [])}
            isMulti
            options={liqueurOptions}
            placeholder="選取利口酒"
            {...lightSelectProps}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>其他酒類</Form.Label>
          <Select
            components={animatedComponents}
            onChange={(item) => setSelectedAlcohols(item || [])}
            isMulti
            options={alcoholOptions}
            placeholder="選取其他酒類"
            {...lightSelectProps}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>其他成分</Form.Label>
          <Select
            components={animatedComponents}
            onChange={(item) => setSelectedIngredients(item || [])}
            isMulti
            options={ingredientOptions}
            placeholder="選取其他成分"
            {...lightSelectProps}
          />
        </Form.Group>

        <div className="admin-form-actions">
          <Button variant="warning" type="submit" className="btn-accent">
            新增
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/Cocktails")}
          >
            取消
          </Button>
        </div>
      </Form>
    </AdminFormLayout>
  );
};

export default AddCocktail;
