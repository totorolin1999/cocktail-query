import "./components.scss";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MaterialBarChart = ({ chartData = [] }) => {
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
          "rgba(255, 99, 132, 0.25)",
          "rgba(54, 162, 235, 0.25)",
          "rgba(255, 206, 86, 0.25)",
          "rgba(75, 192, 192, 0.25)",
          "rgba(153, 102, 255, 0.25)",
          "rgba(255, 159, 64, 0.25)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 隱藏單一數據集冗餘的圖例
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${t("chart.label", "使用數量")}: ${ctx.raw} 款調酒`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="materialBarChart w-100" style={{ height: "340px" }}>
      <Bar data={materialChartData} options={options} />
    </div>
  );
};

export default MaterialBarChart;
