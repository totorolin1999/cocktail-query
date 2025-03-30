import React from "react";
import CocktailCard from "../../components/cocktailCard/CocktailCard";
import LoadingMessage from "../../components/LoadingMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

// import LocalBarIcon from "@mui/icons-material/LocalBar";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import queryString from "query-string";

import Form from "react-bootstrap/Form";
import API_BASE_URL from "../../apiConfig";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [bases, setBases] = useState([]);
  const [liqueurs, setLiqueurs] = useState([]);
  const [alcohols, setAlcohols] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedLiqueurs, setSelectedLiqueurs] = useState([]);
  const [selectedAlcohols, setSelectedAlcohols] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showCard, setShowCard] = useState(true);

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

    const fetchAllData = async () => {
      await Promise.all([
        fetchData(`${API_BASE_URL}/api/material-list/base/`, setBases),
        fetchData(`${API_BASE_URL}/api/material-list/liqueur/`, setLiqueurs),
        fetchData(`${API_BASE_URL}/api/material-list/alcohol/`, setAlcohols),
        fetchData(
          `${API_BASE_URL}/api/material-list/ingredient/`,
          setIngredients
        ),
        fetchData(`${API_BASE_URL}/api/cocktail-list/`, setData),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // console.log(
  //   bases.map((item) => ({ value: item.id, label: item.Chinese_Name }))
  // );

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

  const handleClick = async (e) => {
    setShowCard(false);
    setDisabledBtn(true);
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
        setShowCard(true);
        setDisabledBtn(false);
      };
      fetchCocktails();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage data={error} />;

  return (
    <Container className="p-5">
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

        <Button
          variant="warning"
          onClick={handleClick}
          disabled={disabledBtn}
          className="queryBtn"
        >
          {disabledBtn ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              查詢中...
            </>
          ) : (
            "查詢"
          )}
        </Button>
      </Form>
      {showCard && <CocktailCard data={data} />}
    </Container>
  );
};

export default Home;
