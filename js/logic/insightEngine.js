import { OUTPUT_CONFIG } from "../config/outputConfig.js";
import { pipelineData } from "../data/dummyData.js";

export function computeOverview(range) {
  let activeAlerts = 0;
  let worstStatus = "NORMAL";

  Object.entries(pipelineData).forEach(([meterKey, node]) => {
    const analysis = analyzeNode(node, range);

    if (analysis.riskLevel === "EXTREME" || analysis.riskLevel === "HIGH") {
      activeAlerts++;
      worstStatus = "CRITICAL";
    } else if (analysis.riskLevel === "MEDIUM" && worstStatus !== "CRITICAL") {
      worstStatus = "WARNING";
    }
  });

  return { activeAlerts, worstStatus };
}

function maxOf(arr) {
  return Math.max(...arr);
}

function trendSlope(arr) {
  if (arr.length < 2) return 0;
  return arr[arr.length - 1] - arr[0];
}

export function analyzeNode(nodeData, range) {
  if (!nodeData || !nodeData[range]) {
    return {
      range,
      riskLevel: "LOW",
      rootCause: [],
      actions: ["No data available"],
      confidence: 0.2,
      outputs: {},
    };
  }

  const node = nodeData[range];

  const result = {
    range,
    riskLevel: "LOW",
    rootCause: [],
    actions: [],
    confidence: 0.4,
    outputs: {},
  };

  let riskScore = 0;

  Object.entries(node).forEach(([outputType, values]) => {
    const config = OUTPUT_CONFIG[outputType];
    if (!config) return;

    const max = maxOf(values);
    const slope = trendSlope(values);

    let status = "normal";
    if (max >= config.critical) status = "critical";
    else if (max >= config.warning) status = "warning";

    result.outputs[outputType] = { status, max, slope };

    if (status === "critical") {
      riskScore += 3;
      result.rootCause.push(`${outputType} critical`);
    }

    if (status === "warning") {
      riskScore += 2;
      result.rootCause.push(`${outputType} warning`);
    }

    if (slope > 0.5 * config.warning) {
      riskScore += 1;
      result.rootCause.push(`${outputType} accelerating trend`);
    }
  });

  if (riskScore >= 8) result.riskLevel = "EXTREME";
  else if (riskScore >= 6) result.riskLevel = "HIGH";
  else if (riskScore >= 4) result.riskLevel = "MEDIUM";
  else result.riskLevel = "LOW";

  if (result.riskLevel === "EXTREME") {
    result.actions.push(
      "Immediately reduce operating pressure",
      "Deploy emergency geotechnical team",
      "Install temporary soil stabilization",
    );
    result.confidence = 0.9;
  }

  if (result.riskLevel === "HIGH") {
    result.actions.push(
      "Reduce operating pressure",
      "Conduct immediate field inspection",
      "Install additional monitoring sensors",
      "Prepare soil stabilization plan",
    );
    result.confidence = 0.8;
  }

  if (result.riskLevel === "MEDIUM") {
    result.actions.push(
      "Increase monitoring frequency",
      "Inspect slope and foundation condition",
    );
    result.confidence = 0.65;
  }

  if (result.riskLevel === "LOW") {
    result.actions.push("Continue routine monitoring");
    result.confidence = 0.5;
  }

  return result;
}
