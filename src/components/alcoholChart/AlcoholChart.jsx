import "./alcoholChart.scss";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import API_BASE_URL from '../../apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

const AlcoholChart = () => {
  const [alcoholChart, setAlcoholChart] = useState([]);

  useEffect(() => {
    const fetchAlcoholChart = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/alcohol-chart/`);
        setAlcoholChart(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAlcoholChart();
  }, []);

  const alcoholChartData = {
    labels: alcoholChart.map((data) => data.label),
    datasets: [
      {
        label: "其他酒類使用數量",
        data: alcoholChart.map((data) => data.size),
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
    <div className="alcoholChart">
      <Doughnut data={alcoholChartData} />
    </div>
  );
};

export default AlcoholChart;
