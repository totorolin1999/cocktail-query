import React from "react";
import { render, screen } from "@testing-library/react";
import IbaBadge from "./IbaBadge";

jest.mock("react-i18next", () => ({
  useTranslation: () => [(key) => (key === "detail.ibaTag" ? "IBA Cocktail" : key)],
}));

describe("IbaBadge", () => {
  it("labels cocktails with an IBA category", () => {
    render(<IbaBadge category="The Unforgettables" />);

    expect(screen.getByText("IBA Cocktail")).toBeTruthy();
  });

  it("does not render a label without an IBA category", () => {
    render(<IbaBadge />);

    expect(screen.queryByText("IBA Cocktail")).toBeNull();
  });
});
