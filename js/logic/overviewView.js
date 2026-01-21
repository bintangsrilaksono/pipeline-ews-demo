import { pipelineData } from "../data/dummyData.js";
import { analyzeNode, computeOverview } from "./insightEngine.js";
import { OUTPUT_CONFIG } from "../config/outputConfig.js";

let currentRange = "daily";

function renderOverview(range = "daily") {
  const root = document.getElementById("view-overview");

  const nodeKeys = Object.keys(pipelineData);

  const nodes = nodeKeys.map((key) => {
    const nodeData = pipelineData[key];
    const analysis = analyzeNode(nodeData, range);

    let status =
      analysis.riskLevel === "EXTREME" || analysis.riskLevel === "HIGH"
        ? "critical"
        : analysis.riskLevel === "MEDIUM"
          ? "warning"
          : "normal";

    return {
      id: key,
      meter: key.replace("M", ""),
      status,
      analysis,
    };
  });

  const alerts = nodes.filter(
    (n) =>
      n.analysis.riskLevel === "HIGH" || n.analysis.riskLevel === "EXTREME",
  );

  const monitoringPoints = nodeKeys.length;

  const sampleNode = pipelineData[nodeKeys[0]];
  const sensorChannelsPerNode = Object.keys(sampleNode[range]).length;

  const totalSensorChannels = monitoringPoints * sensorChannelsPerNode;

  const { activeAlerts, worstStatus } = computeOverview(range);

  const topAlert = alerts.sort(
    (a, b) => b.analysis.confidence - a.analysis.confidence,
  )[0];

  root.innerHTML = `
    <h1>Early Warning Monitoring Dashboard – MFO Pipeline</h1>

    <div class="overview-summary">
      <div class="summary-card summary-blue">
        Pipeline Length<br />1000 m
      </div>

      <div class="summary-card summary-purple">
        Monitoring Points<br />${monitoringPoints}
      </div>

      <div class="summary-card summary-purple">
        Sensor Channels<br />${totalSensorChannels}
      </div>

      <div class="summary-card summary-green">
        Active Alerts<br />${activeAlerts}
      </div>

      <div class="summary-card summary-red">
        Status<br />${worstStatus}
      </div>
    </div>

    <div class="pipeline-status-box">
      <strong>PIPELINE 1000 m</strong>
      <div class="pipeline-dots">
        ${nodes
          .map(
            (n) =>
              `<span class="pipeline-dot ${n.status}" title="${n.id}"></span>`,
          )
          .join("")}
      </div>
    </div>

    ${
      topAlert
        ? `<div class="alert-box">
            <strong>ALERT | Sensor ${topAlert.id} (${topAlert.meter} m)</strong><br/>
            <strong>Risk Level:</strong> ${topAlert.analysis.riskLevel}<br/>
            <strong>Root Cause:</strong> ${
              topAlert.analysis.rootCause.join(", ") || "None"
            }<br/>
            <strong>Recommendation:</strong> ${topAlert.analysis.actions.join(
              "; ",
            )}
          </div>`
        : ""
    }
  `;
}

renderOverview();

document.addEventListener("viewChanged", (e) => {
  if (e.detail.view === "overview") {
    renderOverview(currentRange);
  }
});

document.addEventListener("timeRangeChanged", (e) => {
  currentRange = e.detail.range;
  renderOverview(currentRange);
});
