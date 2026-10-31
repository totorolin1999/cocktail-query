import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CocktailRec from "./CocktailRec";

jest.mock("react-i18next", () => ({
  useTranslation: () => [
    (key) => (key === "recommend.message" ? "Similar cocktails" : key),
    { language: "chinese" },
  ],
}));

describe("CocktailRec", () => {
  it("renders recommendations as a compact linked list instead of a carousel", () => {
    render(
      <MemoryRouter>
        <CocktailRec
          data={[
            {
              id: 1,
              Chinese_Name: "莫希托",
              English_Name: "Mojito",
              image: "/media/cocktail_images/illustration.svg",
              iba_category: "Contemporary Classics",
              artwork_color: "green",
              glassware_en: "Highball glass",
              garnish_en: "Mint and lime",
            },
            {
              id: 2,
              Chinese_Name: "內格羅尼",
              English_Name: "Negroni",
              image: "/media/cocktail_images/negroni.jpg",
            },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Similar cocktails" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "莫希托 (Mojito)" }).getAttribute("href")).toBe(
      "/Cocktail/1"
    );
    expect(screen.getByRole("link", { name: "內格羅尼 (Negroni)" }).getAttribute("href")).toBe(
      "/Cocktail/2"
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders nothing when there are no recommendations", () => {
    const { container } = render(<CocktailRec data={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("shows at most six recommendations", () => {
    const recommendations = Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      Chinese_Name: `調酒${index + 1}`,
      English_Name: `Cocktail ${index + 1}`,
      image: "/media/cocktail_images/illustration.svg",
    }));

    render(
      <MemoryRouter>
        <CocktailRec data={recommendations} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "調酒6 (Cocktail 6)" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "調酒7 (Cocktail 7)" })).toBeNull();
  });
});