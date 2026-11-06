import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminMaterialTable from "./AdminMaterialTable";

jest.mock("../utils/useAxios", () => ({
  __esModule: true,
  default: () => ({ delete: jest.fn().mockResolvedValue({ data: { message: "ok" } }) }),
}));

describe("AdminMaterialTable", () => {
  const sampleMaterials = [
    { id: 1, chinese_name: "琴酒", english_name: "Gin", category: "base" },
    { id: 2, chinese_name: "君度橙酒", english_name: "Cointreau", category: "liqueur" },
    { id: 3, chinese_name: "紅酒", english_name: "Red Wine", category: "alcohol" },
    { id: 4, chinese_name: "檸檬汁", english_name: "Lemon Juice", category: "ingredient" },
  ];

  it("renders materials with category pills and edit/delete buttons", () => {
    render(
      <MemoryRouter>
        <AdminMaterialTable materials={sampleMaterials} />
      </MemoryRouter>
    );

    expect(screen.getByText("琴酒")).toBeTruthy();
    expect(screen.getByText("Gin")).toBeTruthy();
    expect(screen.getByText("基酒")).toBeTruthy();

    const updateButtons = screen.getAllByRole("button", { name: "更新" });
    expect(updateButtons.length).toBe(4);
    expect(updateButtons[0].getAttribute("href")).toBe("/materials/base/1/edit");
  });

  it("filters materials by category when category pill is clicked", () => {
    render(
      <MemoryRouter>
        <AdminMaterialTable materials={sampleMaterials} />
      </MemoryRouter>
    );

    // Click '基酒 (1)'
    const basePill = screen.getByRole("button", { name: /基酒 \(1\)/ });
    fireEvent.click(basePill);

    expect(screen.getByText("琴酒")).toBeTruthy();
    expect(screen.queryByText("君度橙酒")).toBeNull();
    expect(screen.queryByText("檸檬汁")).toBeNull();
  });

  it("filters materials by search keyword", () => {
    render(
      <MemoryRouter>
        <AdminMaterialTable materials={sampleMaterials} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/搜尋材料名稱/);
    fireEvent.change(searchInput, { target: { value: "Lemon" } });

    expect(screen.getByText("檸檬汁")).toBeTruthy();
    expect(screen.queryByText("琴酒")).toBeNull();
  });
});
