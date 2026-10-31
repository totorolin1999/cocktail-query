import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../apiConfig";
import CocktailArtwork, { isCocktailArtwork } from "./CocktailArtwork";

const MAX_RECOMMENDATIONS = 6;

const CocktailRec = ({ data }) => {
  const [t, i18n] = useTranslation("global");

  if (!data || data.length === 0) {
    return null;
  }

  const chinese = i18n.language === "chinese";

  return (
    <section className="rec-section" aria-labelledby="recommendations-title">
      <h2 className="recommend-title" id="recommendations-title">
        {t("recommend.message")}
      </h2>
      <div className="recommendation-grid">
        {data.slice(0, MAX_RECOMMENDATIONS).map((item) => {
          const image = item.image ? `${API_BASE_URL}${item.image}` : "";
          const displayName = chinese ? item.Chinese_Name : item.English_Name;

          return (
            <Link
              className="recommendation-card"
              key={item.id}
              to={`/Cocktail/${item.id}`}
              aria-label={`${displayName} (${item.English_Name})`}
            >
              {isCocktailArtwork(item.image) ? (
                <CocktailArtwork cocktail={item} />
              ) : (
                <img
                  className="recommendation-artwork"
                  src={image}
                  alt=""
                  loading="lazy"
                />
              )}
              <span className="recommendation-copy">
                <span className="recommendation-name">{displayName}</span>
                <span className="recommendation-english">
                  {chinese ? item.English_Name : item.Chinese_Name}
                </span>
                {item.iba_category && (
                  <span className="recommendation-category">
                    {item.iba_category}
                  </span>
                )}
              </span>
              <span className="recommendation-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CocktailRec;
