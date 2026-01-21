import { pipelineData } from "../data/dummyData.js";
import {
  OUTPUT_CONFIG,
  SENSOR_DETAIL_OUTPUTS,
} from "../config/outputConfig.js";
import { analyzeNode } from "./insightEngine.js";

let currentRange = "daily";
let currentLocation = "M100";
let currentOutputType = "tiltAngle";
let chartInstance = null;
let initialized = false;

function initSensorView() {
  const section = document.getElementById("view-sensor");
  if (!section || !section.classList.contains("active")) return;

  const locationSelect = document.getElementById("sensor-location-select");
  const typeSelect = document.getElementById("sensor-output-select");
  const canvas = document.getElementById("sensorDetailChart");

  if (!locationSelect || !typeSelect || !canvas) return;

  if (!initialized) {
    initialized = true;

    Object.keys(pipelineData).forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = `${key.replace("M", "")} m`;
      locationSelect.appendChild(opt);
    });

    typeSelect.innerHTML = SENSOR_DETAIL_OUTPUTS.map(
      (k) => `<option value="${k}">${OUTPUT_CONFIG[k].label}</option>`,
    ).join("");

    locationSelect.value = currentLocation;
    typeSelect.value = currentOutputType;

    locationSelect.addEventListener("change", () => {
      currentLocation = locationSelect.value;
      renderSensorDetail();
    });

    typeSelect.addEventListener("change", () => {
      currentOutputType = typeSelect.value;
      renderSensorDetail();
    });
  }

  renderSensorDetail();
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

function renderSensorDetail() {
  const section = document.getElementById("view-sensor");
  if (!section || !section.classList.contains("active")) return;

  const nodeRangeData = pipelineData[currentLocation]?.[currentRange];
  if (!nodeRangeData) return;

  let values;

  // ✅ FIX: mapping cumulativeDisplacement → deformationProfile
  if (currentOutputType === "cumulativeDisplacement") {
    values = nodeRangeData.deformationProfile;
  } else {
    values = nodeRangeData[currentOutputType];
  }

  if (!values || !Array.isArray(values)) return;

  const analysis = analyzeNode(pipelineData[currentLocation], currentRange);

  const metaEl = document.getElementById("sensor-meta");
  if (metaEl && analysis) {
    metaEl.textContent =
      `Location: ${currentLocation.replace("M", "")} m | ` +
      `Output: ${OUTPUT_CONFIG[currentOutputType].label} | ` +
      `Risk Level: ${analysis.riskLevel}`;
  }

  if (chartInstance) chartInstance.destroy();

  const labels = values.map((_, i) => `T${i + 1}`);
  const datasets = buildDatasets(currentOutputType, labels, values);

  const canvas = document.getElementById("sensorDetailChart");
  if (!canvas) return;

  chartInstance = new Chart(canvas, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  const insightEl = document.getElementById("sensor-insight");
  if (insightEl && analysis) {
    insightEl.innerHTML = `
      <strong>Risk Level:</strong> ${analysis.riskLevel}<br/>
      <strong>Root Cause:</strong> ${
        analysis.rootCause.join(", ") || "None"
      }<br/>
      <strong>Actions:</strong>
      <ul>
        ${analysis.actions.map((a) => `<li>${a}</li>`).join("")}
      </ul>
      <strong>Confidence:</strong> ${Math.round(analysis.confidence * 100)}%
    `;
  }
}

document.addEventListener("viewChanged", (e) => {
  if (e.detail.view === "sensor") {
    initSensorView();
  }
});

document.addEventListener("timeRangeChanged", (e) => {
  currentRange = e.detail.range;
  renderSensorDetail();
});

document.addEventListener("jumpToSensorDetail", (e) => {
  const { location } = e.detail;
  currentLocation = location;

  const locationSelect = document.getElementById("sensor-location-select");
  if (locationSelect) locationSelect.value = currentLocation;

  renderSensorDetail();
});
