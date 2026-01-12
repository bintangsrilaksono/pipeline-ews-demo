import { pipelineData } from "../data/dummyData.js";
import { renderCharts } from "../charts/renderCharts.js";

/* ======================
   STATE
====================== */
let currentRange = "daily";
let currentKM = "M100"; // default node pertama

/* ======================
   THRESHOLD
====================== */
const thresholds = {
  inclinometer: { warning: 0.3, critical: 0.45 },
  tilt: { warning: 0.1, critical: 0.18 },
  gnss: { warning: 1.0, critical: 2.0 },
  piezometer: { warning: 120, critical: 160 },
};

function evaluateStatus(sensorData) {
  let status = "normal";

  for (const sensor in thresholds) {
    const maxValue = Math.max(...sensorData[sensor]);

    if (maxValue >= thresholds[sensor].critical) {
      return "critical";
    }

    if (maxValue >= thresholds[sensor].warning) {
      status = "warning";
    }
  }

  return status;
}

/* ======================
   RENDER PIPELINE
====================== */
const pipelineEl = document.getElementById("pipeline-nodes");

Object.keys(pipelineData).forEach((kmKey) => {
  const meter = Number(kmKey.replace("M", "")); // 100,200,...
  const node = document.createElement("div");

  node.className = "sensor-node";
  node.dataset.km = meter;

  /* posisi berdasarkan meter (0–1000 m) */
  node.style.left = `${(meter / 1000) * 100}%`;

  /* status berdasarkan DATA */
  const status = evaluateStatus(pipelineData[kmKey][currentRange]);
  node.classList.add(status);

  node.onclick = () => {
    currentKM = kmKey;
    renderCharts(currentKM, currentRange);
  };

  pipelineEl.appendChild(node);
});

/* ======================
   TIME RANGE HANDLER
====================== */
document.querySelectorAll(".time-range li").forEach((li) => {
  li.onclick = () => {
    document
      .querySelectorAll(".time-range li")
      .forEach((x) => x.classList.remove("active"));

    li.classList.add("active");
    currentRange = li.dataset.range;

    /* update warna pipeline */
    document.querySelectorAll(".sensor-node").forEach((node) => {
      const km = "M" + node.dataset.km;
      const status = evaluateStatus(pipelineData[km][currentRange]);

      node.classList.remove("normal", "warning", "critical");
      node.classList.add(status);
    });

    renderCharts(currentKM, currentRange);
  };
});

/* ======================
   INITIAL RENDER
====================== */
renderCharts(currentKM, currentRange);
