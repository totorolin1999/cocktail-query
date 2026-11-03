import React, { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import MaterialBarChart from "./MaterialBarChart";
import MaterialHorizontalBarChart from "./MaterialHorizontalBarChart";
import MaterialPieChart from "./MaterialPieChart";
import MaterialDoughnutChart from "./MaterialDoughnutChart";

const InteractiveChartPanel = ({
  chartData = [],
  defaultType = "bar",
  title = "",
}) => {
  const [chartType, setChartType] = useState(defaultType);
  const [t] = useTranslation("global");

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h6 className="chart-title">
          {title || t("chart.distribution", "使用分布統計")}
        </h6>
        <ButtonGroup size="sm" className="chart-type-toggle flex-wrap">
          <Button
            variant={chartType === "horizontal" ? "warning" : "outline-secondary"}
            onClick={() => setChartType("horizontal")}
            className={chartType === "horizontal" ? "btn-accent" : ""}
            title="橫向排行圖（依熱門度排序，長文字清晰好讀）"
            aria-label="排行圖"
          >
            📑 {t("chart.horizontal", "排行圖")}
          </Button>
          <Button
            variant={chartType === "bar" ? "warning" : "outline-secondary"}
            onClick={() => setChartType("bar")}
            className={chartType === "bar" ? "btn-accent" : ""}
            title="直向長條圖"
            aria-label="長條圖"
          >
            📊 {t("chart.bar", "長條圖")}
          </Button>
          <Button
            variant={chartType === "doughnut" ? "warning" : "outline-secondary"}
            onClick={() => setChartType("doughnut")}
            className={chartType === "doughnut" ? "btn-accent" : ""}
            title="環狀甜甜圈圖"
            aria-label="環狀圖"
          >
            🍩 {t("chart.doughnut", "環狀圖")}
          </Button>
          <Button
            variant={chartType === "pie" ? "warning" : "outline-secondary"}
            onClick={() => setChartType("pie")}
            className={chartType === "pie" ? "btn-accent" : ""}
            title="實心圓餅圖"
            aria-label="圓餅圖"
          >
            🥧 {t("chart.pie", "圓餅圖")}
          </Button>
        </ButtonGroup>
      </div>

      <div className="chart-body">
        {chartData.length === 0 ? (
          <div className="text-muted text-center py-5">
            尚無足夠統計資料
          </div>
        ) : chartType === "horizontal" ? (
          <MaterialHorizontalBarChart key="horizontal" chartData={chartData} />
        ) : chartType === "doughnut" ? (
          <MaterialDoughnutChart key="doughnut" chartData={chartData} />
        ) : chartType === "pie" ? (
          <MaterialPieChart key="pie" chartData={chartData} />
        ) : (
          <MaterialBarChart key="bar" chartData={chartData} />
        )}
      </div>
    </div>
  );
};

export default InteractiveChartPanel;
