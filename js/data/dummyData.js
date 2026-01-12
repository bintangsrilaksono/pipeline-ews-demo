// js/data/dummyData.js

export const pipelineData = {
  M100: makeNode(0.2, 0.05, 0.3, 85),
  M200: makeNode(0.21, 0.051, 0.32, 87),
  M300: makeNode(0.22, 0.052, 0.34, 89),
  M400: makeNode(0.23, 0.053, 0.36, 91),
  M500: makeNode(0.24, 0.054, 0.38, 93),

  // ⚠️ 600 m MENDEKATI / MELEWATI THRESHOLD
  M600: makeNode(0.5, 0.04, 0.35, 200),

  M700: makeNode(0.25, 0.055, 0.4, 95),
  M800: makeNode(0.24, 0.054, 0.38, 93),
  M900: makeNode(0.23, 0.053, 0.36, 91),
  M1000: makeNode(0.22, 0.052, 0.34, 89),
};

function makeSeries(base, delta, count = 6) {
  return Array.from({ length: count }, (_, i) =>
    Number((base + i * delta).toFixed(3))
  );
}

function makeNode(inc, tilt, gnss, piezo) {
  return {
    daily: {
      inclinometer: makeSeries(inc, 0.002),
      tilt: makeSeries(tilt, 0.001),
      gnss: makeSeries(gnss, 0.02),
      piezometer: makeSeries(piezo, 1),
    },
    weekly: {
      inclinometer: makeSeries(inc, 0.003),
      tilt: makeSeries(tilt, 0.0015),
      gnss: makeSeries(gnss, 0.04),
      piezometer: makeSeries(piezo, 2),
    },
    monthly: {
      inclinometer: makeSeries(inc, 0.005),
      tilt: makeSeries(tilt, 0.002),
      gnss: makeSeries(gnss, 0.08),
      piezometer: makeSeries(piezo, 3),
    },
    yearly: {
      inclinometer: makeSeries(inc, 0.01),
      tilt: makeSeries(tilt, 0.004),
      gnss: makeSeries(gnss, 0.15),
      piezometer: makeSeries(piezo, 5),
    },
  };
}
