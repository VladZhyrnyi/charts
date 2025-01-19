import { Chart, registerables } from "chart.js";
import jsPDF from "jspdf";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";

Chart.register(...registerables);

const chartConfig = {
  type: "line", // або 'bar' для стовпчастого графіка
  data: {
    labels: "",
    datasets: [
      {
        label: "T, C",
        data: null,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        // fill: true,
      },
    ],
  },
  options: {
    parsing: {
      xAxisKey: "date",
      yAxisKey: "value",
    },
    // responsive: true,
    plugins: {
      // legend: {
      //   display: true,
      // },
    },
  },
};

const openFileBtn = document.getElementById("loadFileBtn");
const savePdfBtn = document.getElementById("savePdfBtn");

openFileBtn.addEventListener("click", openFile);
savePdfBtn.addEventListener('click', savePdf)

async function openFile() {
  const file = await window.fileApi.open();

  if (!file) return;

  const fileName = file.filePath.split("/").pop(); 

  const parsedData = parseCSV(file.fileContent);

  chartConfig.data.datasets[0].data = parsedData.points;

  updateChartContainer(fileName, parsedData.date);

  buildChart(parsedData.date);

  savePdfBtn.disabled = false;
}

function savePdf() {
  const content = document.getElementById("chartContainer");

  const filename = content.children[0].children[0].innerText.slice(6, -4)

  const doc = new jsPDF();

  doc.html(content, {
    callback: function (doc) {
      doc.save(filename); // Завантажуємо PDF
    },
    margin: 5,
    x: 10,
    y: 10,

  });
}

function parseCSV(data) {
  const lines = data.split("\n").filter((line) => line.trim() !== "");
  const points = [];
  let date;

  for (const line of lines) {
    const [_date, time, __, value] = line.split(";");

    const pointDate = new Date(_date + " " + time);

    if (!date) {
      date = _date;
    }

    points.push({
      date: pointDate.toLocaleString().split(", ")[1],
      value,
    });
  }

  return { date, points };
}

function buildChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, chartConfig);
}

// DOM Handlers

function updateChartContainer(chartTitle, chartDate) {

  const chartContainer = document.getElementById("chartContainer");

  chartContainer.innerHTML = `
  <div class="chartInfo">
    <h3 id="chartTitle">Файл: ${chartTitle}</h3>
    <span id="chartDate">Дата: ${chartDate}</span>
  </div>
  <div class="chart">
    <canvas id="chart" class="chart"></canvas>
  </div>
  `;
}
