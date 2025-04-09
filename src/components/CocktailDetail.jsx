import React from "react";
import Card from "react-bootstrap/Card";
import "./components.scss";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";

const CocktailDetail = ({ data }) => {
  const url = `${API_BASE_URL}${data.image}`;
  const [t, i18n] = useTranslation("global");

  return (
    <Card
      bg="dark"
      text="white"
      border="warning"
      className="text-center cocktailCard"
    >
      <Card.Header className="text-success">{data.English_Name}</Card.Header>
      <Card.Img
        variant="top"
        src={url}
        style={{ width: "260px", height: "340px", objectFit: "cover" }}
        className="mx-auto"
      />
      <Card.Body>
        <Card.Title className="text-warning">
          {i18n.language === "chinese" ? data.Chinese_Name : data.English_Name}
        </Card.Title>
        <Card.Text>
          {data.Bases?.length > 0 && (
            <>
              {t("detail.base")}
              {data.Bases.map((base, index) => (
                <React.Fragment key={index}>
                  {i18n.language === "chinese"
                    ? base.Chinese_Name
                    : base.English_Name}
                  {index < data.Bases.length - 1 ? <>&nbsp;/&nbsp;</> : <br />}
                </React.Fragment>
              ))}
            </>
          )}
          {data.Liqueurs?.length > 0 && (
            <>
              {t("detail.liqueur")}
              {data.Liqueurs.map((liqueur, index) => (
                <React.Fragment key={index}>
                  {i18n.language === "chinese"
                    ? liqueur.Chinese_Name
                    : liqueur.English_Name}
                  {index < data.Liqueurs.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {data.Alcohols?.length > 0 && (
            <>
              {t("detail.alcohol")}
              {data.Alcohols.map((alcohol, index) => (
                <React.Fragment key={index}>
                  {i18n.language === "chinese"
                    ? alcohol.Chinese_Name
                    : alcohol.English_Name}
                  {index < data.Alcohols.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
          {data.Ingredients?.length > 0 && (
            <>
              {t("detail.ingredient")}
              {data.Ingredients.map((ingredient, index) => (
                <React.Fragment key={index}>
                  {i18n.language === "chinese"
                    ? ingredient.Chinese_Name
                    : ingredient.English_Name}
                  {index < data.Ingredients.length - 1 ? (
                    <>&nbsp;/&nbsp;</>
                  ) : (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CocktailDetail;
