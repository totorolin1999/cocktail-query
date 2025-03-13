import "./ingredientChart.scss";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
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
import API_BASE_URL from '../../apiConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IngredientChart = () => {
  const [ingredientChart, setIngredientChart] = useState([]);

  useEffect(() => {
    const fetchIngredientChart = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ingredient-chart/`);
        setIngredientChart(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIngredientChart();
  }, []);

  const ingredientChartData = {
    labels: ingredientChart.map((data) => data.label),
    datasets: [
      {
        label: "其他成分使用數量",
        data: ingredientChart.map((data) => data.size),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
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
      },
    ],
  };

  return (
    <div className="ingredientChart">
      <Bar data={ingredientChartData} />
    </div>
  );
};

export default IngredientChart;
