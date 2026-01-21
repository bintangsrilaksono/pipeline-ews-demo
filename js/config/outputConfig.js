// js/config/outputConfig.js

export const OUTPUT_CONFIG = {
  // ===== PRIMARY =====
  tiltX: {
    label: "Tilt X (deg)",
    warning: 0.25,
    critical: 0.4,
  },
  tiltY: {
    label: "Tilt Y (deg)",
    warning: 0.25,
    critical: 0.4,
  },

  // ===== DERIVED =====
  tiltAngle: {
    label: "Tilt Resultant (deg)",
    warning: 0.3,
    critical: 0.45,
  },
  localDisplacement: {
    label: "Local Displacement (mm)",
    warning: 3,
    critical: 6,
  },
  cumulativeDisplacement: {
    label: "Cumulative Displacement (mm)",
    warning: 15,
    critical: 30,
  },
  settlement: {
    label: "Settlement (mm)",
    warning: 5,
    critical: 12,
  },
  heave: {
    label: "Heave (mm)",
    warning: 2,
    critical: 5,
  },
  deformationRate: {
    label: "Deformation Rate (deg/step)",
    warning: 0.02,
    critical: 0.05,
  },
};

// 4 grafik utama dashboard
export const DASHBOARD_OUTPUTS = [
  "tiltAngle",
  "localDisplacement",
  "cumulativeDisplacement",
  "deformationRate",
];

// 6 grafik sensor detail
export const SENSOR_DETAIL_OUTPUTS = [
  "tiltX",
  "tiltY",
  "tiltAngle",
  "localDisplacement",
  "settlement",
  "deformationRate",
];
