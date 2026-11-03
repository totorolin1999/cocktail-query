import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeIngredientEditor from "./RecipeIngredientEditor";

jest.mock("../utils/useAxios", () => ({
  __esModule: true,
  default: () => ({ post: jest.fn() }),
}));

describe("RecipeIngredientEditor", () => {
  const mockMaterials = [
    { id: 1, chinese_name: "琴酒", english_name: "Gin", category: "base" },
    { id: 2, chinese_name: "通寧水", english_name: "Tonic Water", category: "ingredient" },
  ];

  it("renders empty state message when no recipe items", () => {
    render(
      <RecipeIngredientEditor
        recipeItems={[]}
        setRecipeItems={jest.fn()}
        allMaterials={mockMaterials}
      />
    );
    expect(screen.getByText(/目前尚未加入任何材料/)).toBeTruthy();
  });

  it("calls setRecipeItems when add button is clicked", () => {
    const setRecipeItems = jest.fn();
    render(
      <RecipeIngredientEditor
        recipeItems={[]}
        setRecipeItems={setRecipeItems}
        allMaterials={mockMaterials}
      />
    );

    const addBtn = screen.getByText("＋ 新增材料");
    fireEvent.click(addBtn);
    expect(setRecipeItems).toHaveBeenCalledTimes(1);
  });
});
