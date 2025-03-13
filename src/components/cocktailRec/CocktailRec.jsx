import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import API_BASE_URL from '../../apiConfig';

const CocktailRec = ({ data }) => {
  const url = `${API_BASE_URL}/media/images/cocktail2.svg`
  
  return (
    <>
      <h4 className="text-warning text-center mt-5">
        您可能會喜歡的調酒！<Badge bg="success">New</Badge>
      </h4>
      <Carousel>
        {data.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={url}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>
                <span className="hovertext" data-hover={item.English_Name}>
                  {item.Chinese_Name}
                </span>
              </h3>
              <p>
                {item.Bases.map((base, index) => (
                  <span
                    key={index}
                    className="hovertext"
                    data-hover={base.English_Name}
                  >
                    {base.Chinese_Name}&nbsp;
                  </span>
                ))}
                {item.Liqueurs.map((liqueur, index) => (
                  <span
                    key={index}
                    className="hovertext"
                    data-hover={liqueur.English_Name}
                  >
                    {liqueur.Chinese_Name}&nbsp;
                  </span>
                ))}
                {item.Alcohols.map((alcohol, index) => (
                  <span
                    key={index}
                    className="hovertext"
                    data-hover={alcohol.English_Name}
                  >
                    {alcohol.Chinese_Name}&nbsp;
                  </span>
                ))}
                {item.Ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="hovertext"
                    data-hover={ingredient.English_Name}
                  >
                    {ingredient.Chinese_Name}&nbsp;
                  </span>
                ))}
              </p>
              <Button
                variant="warning"
                as={Link}
                to={`/Cocktail/${item.Cocktail_ID}`}
              >
                GO!
              </Button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default CocktailRec;
