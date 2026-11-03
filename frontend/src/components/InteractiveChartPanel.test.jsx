import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InteractiveChartPanel from "./InteractiveChartPanel";

// Mock Chart components because Canvas doesn't render in jsdom
jest.mock("./MaterialBarChart", () => () => <div data-testid="mock-bar-chart">Bar Chart</div>);
jest.mock("./MaterialHorizontalBarChart", () => () => <div data-testid="mock-horizontal-chart">Horizontal Chart</div>);
jest.mock("./MaterialPieChart", () => () => <div data-testid="mock-pie-chart">Pie Chart</div>);
jest.mock("./MaterialDoughnutChart", () => () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>);

jest.mock("react-i18next", () => ({
  useTranslation: () => [(key, fallback) => fallback || key, { language: "chinese" }],
}));

describe("InteractiveChartPanel", () => {
  const sampleData = [
    { chinese_label: "琴酒", english_label: "Gin", size: 10 },
    { chinese_label: "蘭姆酒", english_label: "Rum", size: 8 },
  ];

  it("renders with default chart type and allows toggling between all chart formats", () => {
    render(<InteractiveChartPanel chartData={sampleData} defaultType="horizontal" title="基酒分布" />);

    expect(screen.getByText("基酒分布")).toBeTruthy();
    expect(screen.getByTestId("mock-horizontal-chart")).toBeTruthy();

    // Toggle to Bar Chart
    fireEvent.click(screen.getByRole("button", { name: "長條圖" }));
    expect(screen.getByTestId("mock-bar-chart")).toBeTruthy();

    // Toggle to Doughnut Chart
    fireEvent.click(screen.getByRole("button", { name: "環狀圖" }));
    expect(screen.getByTestId("mock-doughnut-chart")).toBeTruthy();

    // Toggle to Pie Chart
    fireEvent.click(screen.getByRole("button", { name: "圓餅圖" }));
    expect(screen.getByTestId("mock-pie-chart")).toBeTruthy();

    // Toggle back to Horizontal
    fireEvent.click(screen.getByRole("button", { name: "排行圖" }));
    expect(screen.getByTestId("mock-horizontal-chart")).toBeTruthy();
  });

  it("shows empty state when chartData is empty", () => {
    render(<InteractiveChartPanel chartData={[]} />);
    expect(screen.getByText("尚無足夠統計資料")).toBeTruthy();
  });
});
