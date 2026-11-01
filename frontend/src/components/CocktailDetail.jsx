import React from "react";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";
import CocktailArtwork, { isCocktailArtwork } from "./CocktailArtwork";
import IbaBadge from "./IbaBadge";

const CocktailDetail = ({ data }) => {
  const url = data?.image ? `${API_BASE_URL}${data.image}` : "";
  const [t, i18n] = useTranslation("global");
  const chinese = i18n.language === "chinese";
  const recipeIngredients = data?.recipe_ingredients || [];
  const ibaCategories = {
    "The unforgettables": "不朽經典",
    "Contemporary Classics": "當代經典",
    "New Era": "新世代調酒",
  };

  return (
    <Card
      bg="dark"
      text="white"
      border="warning"
      className="text-center cocktailCard detail-card"
    >
      <Card.Header>{data?.english_name || data?.English_Name}</Card.Header>
      {isCocktailArtwork(data?.image) ? (
        <CocktailArtwork cocktail={data} />
      ) : (
        <Card.Img
          variant="top"
          src={url}
          className="cocktail-card-img"
          alt={data?.english_name || data?.English_Name}
        />
      )}
      <Card.Body>
        <Card.Title className="cocktail-card-title">
          {chinese ? (data?.chinese_name || data?.Chinese_Name) : (data?.english_name || data?.English_Name)}
          <IbaBadge category={data?.iba_category} />
        </Card.Title>
        <div className="card-text">
          {recipeIngredients.length > 0 ? (
            <section className="recipe-section">
              <h3>{t("detail.recipe")}</h3>
              <ul className="recipe-ingredients">
                {recipeIngredients.map((item, index) => (
                  <li key={`${item.name_en || item.name_zh}-${index}`}>
                    <span>{chinese ? item.name_zh : item.name_en}</span>
                    <strong>
                      {[item.amount, chinese ? item.unit_zh : item.unit_en]
                        .filter(Boolean)
                        .join(" ")}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {data?.Bases?.length > 0 && (
            <>
              {t("detail.base")}
              {data.Bases.map((base, index) => (
                <React.Fragment key={index}>
                  {chinese
                    ? (base.chinese_name || base.Chinese_Name)
                    : (base.english_name || base.English_Name)}
                  {index < data.Bases.length - 1 ? <>&nbsp;/&nbsp;</> : <br />}
                </React.Fragment>
              ))}
            </>
          )}
          {data?.Liqueurs?.length > 0 && (
            <>
              {t("detail.liqueur")}
              {data.Liqueurs.map((liqueur, index) => (
                <React.Fragment key={index}>
                  {chinese
                    ? (liqueur.chinese_name || liqueur.Chinese_Name)
                    : (liqueur.english_name || liqueur.English_Name)}
                  {index < data.Liqueurs.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {data?.Alcohols?.length > 0 && (
            <>
              {t("detail.alcohol")}
              {data.Alcohols.map((alcohol, index) => (
                <React.Fragment key={index}>
                  {chinese
                    ? (alcohol.chinese_name || alcohol.Chinese_Name)
                    : (alcohol.english_name || alcohol.English_Name)}
                  {index < data.Alcohols.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {data?.Ingredients?.length > 0 && (
            <>
              {t("detail.ingredient")}
              {data.Ingredients.map((ingredient, index) => (
                <React.Fragment key={index}>
                  {chinese
                    ? (ingredient.chinese_name || ingredient.Chinese_Name)
                    : (ingredient.english_name || ingredient.English_Name)}
                  {index < data.Ingredients.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {data?.instructions_zh && data?.instructions_en && (
            <section className="recipe-section">
              <h3>
                {chinese ? t("detail.methodTranslation") : t("detail.method")}
              </h3>
              <p>{chinese ? data.instructions_zh : data.instructions_en}</p>
              {chinese && (
                <p>
                  <strong>{t("detail.officialMethod")}</strong>{" "}
                  {data.instructions_en}
                </p>
              )}
            </section>
          )}
          {(data?.glassware_zh || data?.glassware_en) && (
            <p>
              <strong>{t("detail.glassware")}</strong>{" "}
              {chinese ? data.glassware_zh : data.glassware_en}
            </p>
          )}
          {(data?.garnish_zh || data?.garnish_en) && (
            <p>
              <strong>{t("detail.garnish")}</strong>{" "}
              {chinese ? data.garnish_zh : data.garnish_en}
            </p>
          )}
          {(data?.flavor_zh || data?.flavor_en) && (
            <section className="recipe-section">
              <h3>{t("detail.flavor")}</h3>
              <p>{chinese ? data.flavor_zh : data.flavor_en}</p>
            </section>
          )}
          {data?.strength && (
            <p>
              <strong>{t("detail.strength")}</strong>{" "}
              {t(`detail.strength_${data.strength}`)}
            </p>
          )}
          {data?.iba_category && (
            <p>
              <strong>{t("detail.ibaCategory")}</strong>{" "}
              {chinese
                ? ibaCategories[data.iba_category] || data.iba_category
                : data.iba_category}
            </p>
          )}
          {(data?.history_zh || data?.history_en) && (
            <section className="recipe-section">
              <h3>{t("detail.history")}</h3>
              <p>{chinese ? data.history_zh : data.history_en}</p>
            </section>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CocktailDetail;
