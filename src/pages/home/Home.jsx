import "./home.scss";
import "../layout/layout.scss";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CocktailCard from "../../components/cocktailCard/CocktailCard";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// import LocalBarIcon from "@mui/icons-material/LocalBar";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import queryString from "query-string";
import "bootstrap/dist/css/bootstrap.min.css";

import Form from "react-bootstrap/Form";
import API_BASE_URL from "../../apiConfig";

const Home = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  // const [data, setData] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState([]);
  const [bases, setBases] = useState([]);
  const [liqueurs, setLiqueurs] = useState([]);
  const [alcohols, setAlcohols] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedLiqueurs, setSelectedLiqueurs] = useState([]);
  const [selectedAlcohols, setSelectedAlcohols] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const animatedComponents = makeAnimated();

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const res = await axios.get(url);
        setter(res.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(`${API_BASE_URL}/api/base-list/`, setBases);
    fetchData(`${API_BASE_URL}/api/liqueur-list/`, setLiqueurs);
    fetchData(`${API_BASE_URL}/api/alcohol-list/`, setAlcohols);
    fetchData(`${API_BASE_URL}/api/ingredient-list/`, setIngredients);
    fetchData(`${API_BASE_URL}/api/cocktail-list/`, setData);
  }, []);

  // console.log(
  //   bases.map((item) => ({ value: item.Base_ID, label: item.Chinese_Name }))
  // );

  const baseOptions = bases.map((item) => ({
    value: item.Base_ID,
    label: item.Chinese_Name,
  }));

  const liqueurOptions = liqueurs.map((item) => ({
    value: item.Liqueur_ID,
    label: item.Chinese_Name,
  }));

  const alcoholOptions = alcohols.map((item) => ({
    value: item.Alcohol_ID,
    label: item.Chinese_Name,
  }));

  const ingredientOptions = ingredients.map((item) => ({
    value: item.Ingredient_ID,
    label: item.Chinese_Name,
  }));

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const baseQuery = queryString.stringify(
        { bases: selectedBases.map((item) => item.value) },
        { arrayFormat: "bracket-separator", arrayFormatSeparator: "|" }
      );
      const liqueurQuery = queryString.stringify(
        { liqueurs: selectedLiqueurs.map((item) => item.value) },
        { arrayFormat: "bracket-separator", arrayFormatSeparator: "|" }
      );
      const alcoholQuery = queryString.stringify(
        { alcohols: selectedAlcohols.map((item) => item.value) },
        { arrayFormat: "bracket-separator", arrayFormatSeparator: "|" }
      );
      const ingredientQuery = queryString.stringify(
        { ingredients: selectedIngredients.map((item) => item.value) },
        { arrayFormat: "bracket-separator", arrayFormatSeparator: "|" }
      );

      const fetchCocktails = async () => {
        const res = await axios.get(
          `${API_BASE_URL}/api/cocktail-list/?name=${query}&${baseQuery}&${liqueurQuery}&${alcoholQuery}&${ingredientQuery}`
        );
        setData(res.data);
      };
      fetchCocktails();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="backgroundColor">
        <Container className="p-5">
          {error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : (
            <>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label className="text-warning">基酒</Form.Label>
                    <Select
                      components={animatedComponents}
                      onChange={(item) => setSelectedBases(item)}
                      isMulti
                      options={baseOptions}
                      placeholder="選取基酒"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label className="text-warning">利口酒</Form.Label>
                    <Select
                      components={animatedComponents}
                      onChange={(item) => setSelectedLiqueurs(item)}
                      isMulti
                      options={liqueurOptions}
                      placeholder="選取利口酒"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label className="text-warning">其他酒類</Form.Label>
                    <Select
                      components={animatedComponents}
                      onChange={(item) => setSelectedAlcohols(item)}
                      isMulti
                      options={alcoholOptions}
                      placeholder="選取其他酒類"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label className="text-warning">其他成分</Form.Label>
                    <Select
                      components={animatedComponents}
                      onChange={(item) => setSelectedIngredients(item)}
                      isMulti
                      options={ingredientOptions}
                      placeholder="選取其他成分"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label className="text-warning">調酒名稱</Form.Label>
                    <Form.Control
                      placeholder="輸入調酒名稱（中英文皆可）"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Button variant="warning" onClick={handleClick}>
                  查詢
                </Button>
              </Form>
              <CocktailCard data={data} />
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default Home;
