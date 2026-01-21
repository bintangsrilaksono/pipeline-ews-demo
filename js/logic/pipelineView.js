import { pipelineData } from "../data/dummyData.js";
import { renderCharts } from "../charts/renderCharts.js";
import { analyzeNode } from "./insightEngine.js";

let currentRange = "daily";
let currentKM = "M100";

function evaluateStatus(nodeData, range) {
  const analysis = analyzeNode(nodeData, range);
  if (!analysis) return "normal";

  if (analysis.riskLevel === "EXTREME" || analysis.riskLevel === "HIGH")
    return "critical";

  if (analysis.riskLevel === "MEDIUM") return "warning";

  return "normal";
}

const pipelineEl = document.getElementById("pipeline-nodes");

Object.keys(pipelineData).forEach((kmKey) => {
  const meter = Number(kmKey.replace("M", ""));
  const node = document.createElement("div");

  node.className = "sensor-node";
  node.dataset.km = meter;
  node.style.left = `${(meter / 1000) * 100}%`;

  const status = evaluateStatus(pipelineData[kmKey], currentRange);
  node.classList.add(status);

  node.onclick = () => {
    currentKM = kmKey;
    renderCharts(currentKM, currentRange);
  };

  pipelineEl.appendChild(node);
});

document.querySelectorAll(".time-range li").forEach((li) => {
  li.onclick = () => {
    document
      .querySelectorAll(".time-range li")
      .forEach((x) => x.classList.remove("active"));

    li.classList.add("active");
    currentRange = li.dataset.range;

    document.querySelectorAll(".sensor-node").forEach((node) => {
      const km = "M" + node.dataset.km;
      const status = evaluateStatus(pipelineData[km], currentRange);

      node.classList.remove("normal", "warning", "critical");
      node.classList.add(status);
    });

    renderCharts(currentKM, currentRange);
    emitRangeChange(currentRange);
  };
});

function emitRangeChange(range) {
  document.dispatchEvent(
    new CustomEvent("timeRangeChanged", {
      detail: { range },
    }),
  );
}

renderCharts(currentKM, currentRange);
