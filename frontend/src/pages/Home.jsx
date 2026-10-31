import React from "react";
import CocktailCard from "../components/CocktailCard";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";
import { darkSelectProps } from "../utils/reactSelectConfig";
import { buildMaterialOptions } from "../utils/materialOptionUtils";
import Alert from "react-bootstrap/Alert";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [cocktailCatalog, setCocktailCatalog] = useState([]);
  const [query, setQuery] = useState("");
  const [bases, setBases] = useState([]);
  const [liqueurs, setLiqueurs] = useState([]);
  const [alcohols, setAlcohols] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [selectedLiqueurs, setSelectedLiqueurs] = useState([]);
  const [selectedAlcohols, setSelectedAlcohols] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedIbaCategory, setSelectedIbaCategory] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedGlassware, setSelectedGlassware] = useState(null);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [searchError, setSearchError] = useState("");

  const animatedComponents = makeAnimated();

  const [t, i18n] = useTranslation("global");

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
        fetchData(`${API_BASE_URL}/api/cocktail-list/`, (cocktails) => {
          setData(cocktails);
          setCocktailCatalog(cocktails);
        }),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const useChinese = i18n.language === "chinese";
  const baseOptions = buildMaterialOptions(bases, useChinese);
  const liqueurOptions = buildMaterialOptions(liqueurs, useChinese);
  const alcoholOptions = buildMaterialOptions(alcohols, useChinese);
  const ingredientOptions = buildMaterialOptions(ingredients, useChinese);
  const ibaCategoryOptions = [
    {
      value: "The unforgettables",
      label: t("home.iba_categories.the_unforgettables"),
    },
    {
      value: "Contemporary Classics",
      label: t("home.iba_categories.contemporary_classics"),
    },
    {
      value: "New Era",
      label: t("home.iba_categories.new_era"),
    },
  ];
  const strengthOptions = ["low", "medium", "high"].map((strength) => ({
    value: strength,
    label: t(`home.strengths.${strength}`),
  }));
  const glasswareByValue = new Map();
  cocktailCatalog.forEach((cocktail) => {
    const englishName = cocktail.glassware_en?.trim() || "";
    const chineseName = cocktail.glassware_zh?.trim() || "";
    const value = englishName || chineseName;
    if (value && !glasswareByValue.has(value)) {
      glasswareByValue.set(
        value,
        useChinese ? chineseName || englishName : englishName || chineseName
      );
    }
  });
  const glasswareOptions = Array.from(
    glasswareByValue,
    ([value, label]) => ({ value, label })
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setShowCard(false);
    setDisabledBtn(true);
    setSearchError("");

    const params = { name: query.trim() };
    if (selectedIbaCategory) {
      params.iba_category = selectedIbaCategory.value;
    }
    if (selectedStrength) {
      params.strength = selectedStrength.value;
    }
    if (selectedGlassware) {
      params.glassware = selectedGlassware.value;
    }
    const selectedMaterials = {
      "bases[]": selectedBases,
      "liqueurs[]": selectedLiqueurs,
      "alcohols[]": selectedAlcohols,
      "ingredients[]": selectedIngredients,
    };
    Object.entries(selectedMaterials).forEach(([key, selections]) => {
      if (selections.length > 0) {
        params[key] = selections.map((item) => item.value).join("|");
      }
    });

    try {
      const res = await axios.get(`${API_BASE_URL}/api/cocktail-list/`, {
        params,
      });
      setData(res.data);
      setShowCard(true);
    } catch (err) {
      setSearchError(
        i18n.language === "chinese"
          ? "查詢失敗，請稍後再試。"
          : "Search failed. Please try again."
      );
    } finally {
      setDisabledBtn(false);
    }
  };

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage />;

  return (
    <div className="home-page page-section">
      <Container>
        <div className="hero-section">
          <h1 className="hero-title">{t("navbar.title")}</h1>
          <p className="hero-subtitle">
            {i18n.language === "chinese"
              ? "依酒類、成分、IBA 分類、酒感、杯型或名稱，快速搜尋調酒。"
              : "Find cocktails by spirit, ingredients, IBA category, taste, glass, or name."}
          </p>
        </div>

        <div className="search-panel">
          <Form onSubmit={handleClick}>
            <Row className="g-3 mb-2">
              <Form.Group as={Col} xs={12} md={6} lg={4}>
                <Form.Label>{t("home.label_base")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={(item) => setSelectedBases(item || [])}
                  isMulti
                  options={baseOptions}
                  placeholder={t("home.select_base")}
                  {...darkSelectProps}
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6} lg={4}>
                <Form.Label>{t("home.label_liqueur")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={(item) => setSelectedLiqueurs(item || [])}
                  isMulti
                  options={liqueurOptions}
                  placeholder={t("home.select_liqueur")}
                  {...darkSelectProps}
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6} lg={4}>
                <Form.Label>{t("home.label_alcohol")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={(item) => setSelectedAlcohols(item || [])}
                  isMulti
                  options={alcoholOptions}
                  placeholder={t("home.select_alcohol")}
                  {...darkSelectProps}
                />
              </Form.Group>
            </Row>

            <Row className="g-3 mb-2">
              <Form.Group as={Col} xs={12} md={6} lg={3}>
                <Form.Label>{t("home.label_ingredient")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={(item) => setSelectedIngredients(item || [])}
                  isMulti
                  options={ingredientOptions}
                  placeholder={t("home.select_ingredient")}
                  {...darkSelectProps}
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6} lg={3}>
                <Form.Label>{t("home.label_iba_category")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={setSelectedIbaCategory}
                  isClearable
                  options={ibaCategoryOptions}
                  placeholder={t("home.select_iba_category")}
                  {...darkSelectProps}
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6} lg={3}>
                <Form.Label>{t("home.label_strength")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={setSelectedStrength}
                  isClearable
                  options={strengthOptions}
                  placeholder={t("home.select_strength")}
                  {...darkSelectProps}
                />
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6} lg={3}>
                <Form.Label>{t("home.label_glassware")}</Form.Label>
                <Select
                  components={animatedComponents}
                  onChange={setSelectedGlassware}
                  isClearable
                  options={glasswareOptions}
                  placeholder={t("home.select_glassware")}
                  {...darkSelectProps}
                />
              </Form.Group>
            </Row>

            <Row className="g-3 mb-3 align-items-end">
              <Form.Group as={Col} className="cocktail-name-field">
                <Form.Label>{t("home.label_cocktail")}</Form.Label>
                <Form.Control
                  placeholder={t("home.input_cocktail")}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Form.Group>

              <Col xs="auto">
                <Button
                  variant="warning"
                  type="submit"
                  disabled={disabledBtn}
                  className="queryBtn btn-accent"
                >
                  {disabledBtn ? (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <>{t("home.query")}</>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
          {searchError && (
            <Alert variant="danger" className="mt-3 mb-0">
              {searchError}
            </Alert>
          )}
        </div>

        {showCard && (
          <div className="results-section">
            <h2 className="results-heading">
              {t("home.results_count", { count: data.length })}
            </h2>
            {data.length > 0 ? (
              <CocktailCard data={data} />
            ) : (
              <p className="empty-state">
                {i18n.language === "chinese"
                  ? "找不到符合條件的調酒，請調整篩選條件後再試"
                  : "No cocktails found. Try adjusting your filters."}
              </p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
