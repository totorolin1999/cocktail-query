import React from "react";
import Card from "react-bootstrap/Card";
import "./cocktailDetail.scss";
import API_BASE_URL from "../../apiConfig";

const CocktailDetail = ({ data }) => {
  const url = `${API_BASE_URL}${data.image}`;

  return (
    <Card bg="dark" text="white" border="warning" className="cocktailCard">
      <Card.Header className="text-success">{data.English_Name}</Card.Header>
      <Card.Img
        variant="top"
        src={url}
        style={{ width: "260px", height: "340px", objectFit: "cover" }}
        className="mx-auto"
      />
      <Card.Body>
        <Card.Title className="text-warning">
          <span className="hovertext" data-hover={data.English_Name}>
            {data.Chinese_Name}
          </span>
        </Card.Title>
        <Card.Text>
          基酒：
          {data.Bases?.map((base, index) => (
            <span
              key={index}
              className="hovertext"
              data-hover={base.English_Name}
            >
              {base.Chinese_Name}&nbsp;
            </span>
          ))}
          <br />
          利口酒：
          {data.Liqueurs?.map((liqueur, index) => (
            <span
              key={index}
              className="hovertext"
              data-hover={liqueur.English_Name}
            >
              {liqueur.Chinese_Name}&nbsp;
            </span>
          ))}
          <br />
          其他酒類：
          {data.Alcohols?.map((alcohol, index) => (
            <span
              key={index}
              className="hovertext"
              data-hover={alcohol.English_Name}
            >
              {alcohol.Chinese_Name}&nbsp;
            </span>
          ))}
          <br />
          其他成分：
          {data.Ingredients?.map((ingredient, index) => (
            <span
              key={index}
              className="hovertext"
              data-hover={ingredient.English_Name}
            >
              {ingredient.Chinese_Name}&nbsp;
            </span>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CocktailDetail;
