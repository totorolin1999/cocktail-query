import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CocktailCard from "./CocktailCard";

jest.mock("react-i18next", () => ({
  useTranslation: () => [
    (key) => (key === "detail.ibaTag" ? "IBA Cocktail" : key),
    { language: "chinese" },
  ],
}));

describe("CocktailCard", () => {
  it("makes each cocktail card a single link", async () => {
    render(
      <MemoryRouter>
        <CocktailCard
          data={[
            {
              id: 1,
              chinese_name: "莫希托",
              english_name: "Mojito",
              image: "/media/cocktail_images/illustration.svg",
              iba_category: "Contemporary Classics",
              artwork_color: "green",
              glassware_en: "Highball glass",
              garnish_en: "Mint and lime",
            },
          ]}
        />
      </MemoryRouter>
    );

    const cardLink = await screen.findByRole("link", { name: "莫希托" });

    expect(cardLink.getAttribute("href")).toBe("/Cocktail/1");
    expect(cardLink.textContent).toContain("莫希托");
    expect(cardLink.querySelector(".btn")).toBeNull();
    expect(cardLink.querySelector(".card-header .iba-badge")).toBeNull();
    expect(cardLink.querySelector(".card-body .cocktail-card-title .iba-badge"))
      .not.toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
