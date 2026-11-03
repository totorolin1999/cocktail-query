import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuickAddMaterialModal from "./QuickAddMaterialModal";

const mockPost = jest.fn();
jest.mock("../utils/useAxios", () => ({
  __esModule: true,
  default: () => ({ post: mockPost }),
}));

describe("QuickAddMaterialModal", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("renders modal form when show is true", () => {
    render(
      <QuickAddMaterialModal
        show={true}
        onHide={jest.fn()}
        onCreated={jest.fn()}
      />
    );

    expect(screen.getByText("快速建立新材料")).toBeTruthy();
    expect(screen.getByPlaceholderText(/例如：紫蘇利口酒/)).toBeTruthy();
  });

  it("submits form and calls onCreated on success", async () => {
    const handleCreated = jest.fn();
    const handleHide = jest.fn();

    mockPost.mockResolvedValueOnce({
      data: {
        id: 99,
        chinese_name: "紫蘇利口酒",
        english_name: "Shiso Liqueur",
        category: "liqueur",
      },
    });

    render(
      <QuickAddMaterialModal
        show={true}
        onHide={handleHide}
        onCreated={handleCreated}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/例如：紫蘇利口酒/), {
      target: { value: "紫蘇利口酒" },
    });
    fireEvent.change(screen.getByPlaceholderText(/例如：Shiso Liqueur/), {
      target: { value: "Shiso Liqueur" },
    });

    fireEvent.click(screen.getByRole("button", { name: "建立並加入" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(handleCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 99,
          chinese_name: "紫蘇利口酒",
        })
      );
    });
  });
});
