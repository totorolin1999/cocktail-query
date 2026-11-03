import "./components.scss";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const MaterialDoughnutChart = ({ chartData = [] }) => {
  const [t, i18n] = useTranslation("global");

  const materialChartData = {
    labels: chartData.map((data) =>
      i18n.language === "chinese" ? data.chinese_label : data.english_label
    ),
    datasets: [
      {
        label: t("chart.label", "使用數量"),
        data: chartData.map((data) => data.size),
        backgroundColor: [
          "rgba(232, 168, 56, 0.75)",
          "rgba(54, 162, 235, 0.75)",
          "rgba(255, 99, 132, 0.75)",
          "rgba(75, 192, 192, 0.75)",
          "rgba(153, 102, 255, 0.75)",
          "rgba(255, 159, 64, 0.75)",
          "rgba(102, 187, 106, 0.75)",
          "rgba(239, 83, 80, 0.75)",
        ],
        borderColor: [
          "rgba(232, 168, 56, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(102, 187, 106, 1)",
          "rgba(239, 83, 80, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 12,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} 款調酒`,
        },
      },
    },
  };

  return (
    <div className="materialDoughnutChart w-100" style={{ height: "340px" }}>
      <Doughnut data={materialChartData} options={options} />
    </div>
  );
};

export default MaterialDoughnutChart;
