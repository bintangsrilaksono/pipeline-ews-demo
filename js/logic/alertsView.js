// js/logic/alertsView.js

import { pipelineData } from "../data/dummyData.js";
import { OUTPUT_CONFIG } from "../config/outputConfig.js";

let currentRange = "daily";
let initialized = false;

function initAlertsView() {
  if (initialized) return;
  initialized = true;
  renderAlerts();
}

function renderAlerts() {
  const tbody = document.getElementById("alerts-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  Object.keys(pipelineData).forEach((location) => {
    const node = pipelineData[location][currentRange];
    if (!node) return;

    Object.keys(node).forEach((outputKey) => {
      const values = node[outputKey];
      const config = OUTPUT_CONFIG[outputKey];
      if (!values || !config) return;

      const maxValue = Math.max(...values);

      let status = "Normal";
      let riskLevel = "LOW";

      if (config.critical !== undefined && maxValue >= config.critical) {
        status = "Critical";
        riskLevel = "HIGH";
      } else if (config.warning !== undefined && maxValue >= config.warning) {
        status = "Warning";
        riskLevel = "MEDIUM";
      }

      if (status === "Normal") return; // hanya tampilkan yg warning/critical

      const statusDot =
        status === "Critical"
          ? `<span class="status-dot status-critical" title="Critical"></span>`
          : status === "Warning"
            ? `<span class="status-dot status-warning" title="Warning"></span>`
            : `<span class="status-dot status-normal" title="Normal"></span>`;

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${location.replace("M", "")} m</td>
        <td>${config.label}</td>
        <td class="status-cell">${statusDot}</td>
        <td>${maxValue.toFixed(2)}</td>
        <td>${status === "Critical" ? config.critical : config.warning}</td>
        <td>${currentRange}</td>
        <td class="risk-${riskLevel.toLowerCase()}">${riskLevel}</td>
      `;

      tbody.appendChild(tr);
    });
  });
}

// ===== EVENTS =====
document.addEventListener("viewChanged", (e) => {
  if (e.detail.view === "alerts") {
    initAlertsView();
    renderAlerts();
  }
});

document.addEventListener("timeRangeChanged", (e) => {
  currentRange = e.detail.range;
  if (initialized) renderAlerts();
});
