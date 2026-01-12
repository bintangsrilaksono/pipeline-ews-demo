// js/charts/renderCharts.js
import { pipelineData } from "../data/dummyData.js";

/* =========================
   CHART INSTANCE STORAGE
========================= */
let charts = {};

/* =========================
   SENSOR CONFIG (SINGLE SOURCE OF TRUTH)
========================= */
const SENSOR_CONFIG = {
  inclinometer: {
    label: "Inclinometer (mm)",
    thresholds: { warning: 0.3, critical: 0.45 },
    yRange: { min: 0.2, max: 0.35 },
  },

  tilt: {
    label: "Tilt Meter (mrad)",
    thresholds: { warning: 0.1, critical: 0.18 },
    yRange: { min: 0.04, max: 0.08 },
  },

  gnss: {
    label: "GNSS Settlement (mm)",
    thresholds: { warning: 1.0, critical: 2.0 },
    yRange: { min: 0.0, max: 1.5 },
  },

  piezometer: {
    label: "Piezometer (kPa)",
    thresholds: { warning: 120, critical: 160 },
    yRange: { min: 70, max: 180 },
  },
};

/* =========================
   GENERIC DRAW FUNCTION
========================= */
function drawChart(canvasId, title, data, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (charts[canvasId]) charts[canvasId].destroy();

  charts[canvasId] = new Chart(canvas, {
    type: "line",
    data: {
      labels: data.map((_, i) => `T${i + 1}`),
      datasets: [
        {
          label: config.label,
          data,
          borderColor: "#2563eb", // 🔵 data utama
          backgroundColor: "rgba(37,99,235,0.1)",
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 3,
        },
        {
          label: "Warning Threshold",
          data: data.map(() => config.thresholds.warning),
          borderColor: "#f59e0b", // 🟡 warning
          borderDash: [6, 6],
          borderWidth: 1,
          pointRadius: 0,
        },
        {
          label: "Critical Threshold",
          data: data.map(() => config.thresholds.critical),
          borderColor: "#dc2626", // 🔴 critical
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title, // 🔥 JUDUL DINAMIS
          font: { size: 14, weight: "bold" },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          min: config.yRange.min,
          max: config.yRange.max,
        },
      },
    },
  });
}

/* =========================
   PUBLIC RENDER FUNCTION
========================= */
export function renderCharts(meterKey, range) {
  const node = pipelineData[meterKey]?.[range];
  if (!node) return;

  const meterLabel = meterKey.replace("M", "") + " m";

  drawChart(
    "inclinometerChart",
    `Inclinometer – Position ${meterLabel}`,
    node.inclinometer,
    SENSOR_CONFIG.inclinometer
  );

  drawChart(
    "tiltChart",
    `Tilt Meter – Position ${meterLabel}`,
    node.tilt,
    SENSOR_CONFIG.tilt
  );

  drawChart(
    "gnssChart",
    `GNSS Settlement – Position ${meterLabel}`,
    node.gnss,
    SENSOR_CONFIG.gnss
  );

  drawChart(
    "piezometerChart",
    `Piezometer – Position ${meterLabel}`,
    node.piezometer,
    SENSOR_CONFIG.piezometer
  );
}
