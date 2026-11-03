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

const MaterialHorizontalBarChart = ({ chartData = [] }) => {
  const [t, i18n] = useTranslation("global");

  // 依使用次數由大到小排序，呈現排行榜效果
  const sortedData = [...chartData].sort((a, b) => (b.size || 0) - (a.size || 0));

  const labels = sortedData.map((data) =>
    i18n.language === "chinese" ? data.chinese_label : data.english_label
  );

  const colors = [
    "rgba(232, 168, 56, 0.75)",
    "rgba(54, 162, 235, 0.75)",
    "rgba(153, 102, 255, 0.75)",
    "rgba(75, 192, 192, 0.75)",
    "rgba(255, 99, 132, 0.75)",
    "rgba(255, 159, 64, 0.75)",
  ];

  const borderColors = [
    "rgba(232, 168, 56, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(255, 159, 64, 1)",
  ];

  const materialChartData = {
    labels,
    datasets: [
      {
        label: t("chart.label", "使用數量"),
        data: sortedData.map((data) => data.size),
        backgroundColor: sortedData.map((_, i) => colors[i % colors.length]),
        borderColor: sortedData.map((_, i) => borderColors[i % borderColors.length]),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${t("chart.label", "使用數量")}: ${ctx.raw} 款調酒`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
    },
  };

  const chartHeight = Math.max(340, Math.min(sortedData.length * 28 + 40, 520));

  return (
    <div className="materialHorizontalBarChart w-100" style={{ height: `${chartHeight}px` }}>
      <Bar data={materialChartData} options={options} />
    </div>
  );
};

export default MaterialHorizontalBarChart;
