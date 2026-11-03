import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import MaterialTable from "./MaterialTable";

jest.mock("../utils/useAxios", () => ({
  __esModule: true,
  default: () => ({ delete: jest.fn() }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => [
    (key) => (key === "table.chinese" ? "Chinese Name" : "English Name"),
  ],
}));

describe("MaterialTable", () => {
  it("shows nine materials per page and paginates the remaining records", () => {
    const data = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      chinese_name: `材料${index + 1}`,
      english_name: `Material ${index + 1}`,
    }));

    render(
      <MemoryRouter initialEntries={["/Material/base"]}>
        <AuthContext.Provider value={{ user: null }}>
          <MaterialTable data={data} />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(10);
    expect(within(table).getByText("材料9")).toBeTruthy();
    expect(within(table).queryByText("材料10")).toBeNull();

    fireEvent.click(screen.getByText("2"));

    expect(within(table).getAllByRole("row")).toHaveLength(10);
    expect(within(table).getByText("材料10")).toBeTruthy();
    expect(within(table).getByText("材料18")).toBeTruthy();
    expect(within(table).queryByText("材料19")).toBeNull();
  });

  it("does not render edit column even when user is logged in if editable is false", () => {
    const data = [{ id: 1, chinese_name: "琴酒", english_name: "Gin" }];

    render(
      <MemoryRouter initialEntries={["/Material/base"]}>
        <AuthContext.Provider value={{ user: { username: "admin" } }}>
          <MaterialTable data={data} editable={false} />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("編輯")).toBeNull();
    expect(screen.queryByRole("link", { name: "更新" })).toBeNull();
    expect(screen.queryByRole("button", { name: "刪除" })).toBeNull();
  });
});
