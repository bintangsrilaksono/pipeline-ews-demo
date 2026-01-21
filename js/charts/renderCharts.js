import { pipelineData } from "../data/dummyData.js";
import { OUTPUT_CONFIG, DASHBOARD_OUTPUTS } from "../config/outputConfig.js";

let charts = {};

const canvasIds = ["chart-1", "chart-2", "chart-3", "chart-4"];

function drawChart(canvasId, title, outputKey, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (charts[canvasId]) charts[canvasId].destroy();

  const labels = values.map((_, i) => `T${i + 1}`);
  const datasets = buildDatasets(outputKey, labels, values);

  charts[canvasId] = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      layout: {
        padding: {
          top: 10,
          bottom: 30, // ← ruang untuk sumbu X
          left: 10,
          right: 10,
        },
      },

      scales: {
        x: {
          ticks: {
            padding: 8, // ← jarak label X dari chart
            maxRotation: 0,
            autoSkip: true,
          },
        },
        y: {
          ticks: {
            padding: 6,
          },
        },
      },

      plugins: {
        legend: {
          labels: {
            boxWidth: 30,
            padding: 12,
          },
        },
      },
    },
  });
}

function buildDatasets(outputKey, labels, values) {
  const config = OUTPUT_CONFIG[outputKey];

  const datasets = [
    {
      label: config.label,
      data: values,
      borderColor: "#2563eb",
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 4,
    },
  ];

  // ===== WARNING LINE =====
  if (config.warning !== undefined) {
    datasets.push({
      label: "Warning Threshold",
      data: labels.map(() => config.warning),
      borderColor: "#f59e0b",
      borderDash: [6, 6],
      pointRadius: 0,
      fill: false,
    });
  }

  // ===== CRITICAL LINE =====
  if (config.critical !== undefined) {
    datasets.push({
      label: "Critical Threshold",
      data: labels.map(() => config.critical),
      borderColor: "#dc2626",
      borderDash: [6, 6],
      pointRadius: 0,
      fill: false,
    });
  }

  return datasets;
}

export function renderCharts(meterKey, range) {
  const node = pipelineData[meterKey]?.[range];
  if (!node) return;

  const meterLabel = meterKey.replace("M", "") + " m";

  DASHBOARD_OUTPUTS.forEach((outputKey, idx) => {
    const canvasId = canvasIds[idx];
    const config = OUTPUT_CONFIG[outputKey];
    const data = node[outputKey];

    if (data) {
      drawChart(
        canvasId,
        `${config.label} – Position ${meterLabel}`,
        outputKey,
        data,
      );
    }
  });
}
