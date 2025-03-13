import "./liqueurChart.scss";
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

const LiqueurChart = () => {
  const [liqueurChart, setLiqueurChart] = useState([]);

  useEffect(() => {
    const fetchLiqueurChart = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/liqueur-chart/`);
        setLiqueurChart(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLiqueurChart();
  }, []);

  const liqueurChartData = {
    labels: liqueurChart.map((data) => data.label),
    datasets: [
      {
        label: "利口酒使用數量",
        data: liqueurChart.map((data) => data.size),
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
    <div className="liqueurChart">
      <Bar data={liqueurChartData} />
    </div>
  );
};

export default LiqueurChart;
