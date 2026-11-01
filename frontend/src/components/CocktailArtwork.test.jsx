import React from "react";
import { render, screen } from "@testing-library/react";
import CocktailArtwork, { isCocktailArtwork } from "./CocktailArtwork";

describe("CocktailArtwork", () => {
  it("renders a named illustration using the recipe metadata", () => {
    render(
      <CocktailArtwork
        cocktail={{
          english_name: "Mojito",
          artwork_color: "green",
          glassware_en: "Highball glass",
          garnish_en: "Mint and lime",
        }}
      />
    );

    expect(screen.getByRole("img", { name: "Mojito illustration" })).toBeTruthy();
    expect(screen.queryByText("Mojito")).toBeNull();
  });

  it("uses illustrations for legacy generated images but preserves uploaded images", () => {
    expect(isCocktailArtwork("/media/cocktail_images/42.jpeg")).toBe(true);
    expect(isCocktailArtwork("/media/cocktail_images/illustration.svg")).toBe(true);
    expect(isCocktailArtwork("/media/cocktail_images/my-upload.jpeg")).toBe(false);
  });
});
