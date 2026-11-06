import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AddItem from "./AddItem";

jest.mock("../utils/useAxios", () => ({
  __esModule: true,
  default: () => ({ post: jest.fn() }),
}));

describe("AddItem Page", () => {
  it("renders 404 Missing page when given an invalid material param", () => {
    render(
      <MemoryRouter initialEntries={["/materials/ba/new"]}>
        <Routes>
          <Route path="/materials/:material/new" element={<AddItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("404 - 找不到網頁")).toBeTruthy();
    expect(screen.queryByText("新增ba")).toBeNull();
  });

  it("renders correct form title and back button for valid material", () => {
    render(
      <MemoryRouter initialEntries={["/materials/base/new"]}>
        <Routes>
          <Route path="/materials/:material/new" element={<AddItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("新增基酒")).toBeTruthy();
    expect(screen.getByText(/返回材料庫管理/)).toBeTruthy();
  });
});
