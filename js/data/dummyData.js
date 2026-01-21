// js/data/dummyData.js

const GAGE_LENGTH_MM = 500;

// resolusi waktu (BENAR secara domain)
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;

export const pipelineData = {
  M100: makeNode(),
  M200: makeNode(),
  M300: makeNode(),
  M400: makeNode(),
  M500: makeNode(),
  M600: makeNode({ eventDay: 220 }), // hanya ini ada deformasi nyata
  M700: makeNode(),
  M800: makeNode(),
  M900: makeNode(),
  M1000: makeNode(),
};

function makeNode({ eventDay = null } = {}) {
  // === MASTER SERIES: 1 tahun penuh ===
  const yearlySeries = buildYearlyOutputs(DAYS_IN_YEAR, eventDay);

  // === DERIVED TIME WINDOWS ===
  const monthlySeries = sliceLast(yearlySeries, DAYS_IN_MONTH);
  const weeklySeries = sliceLast(yearlySeries, DAYS_IN_WEEK);
  const dailySeries = sliceLast(yearlySeries, HOURS_IN_DAY);

  return {
    daily: dailySeries,
    weekly: weeklySeries,
    monthly: monthlySeries,
    yearly: yearlySeries,
  };
}

function buildYearlyOutputs(count, eventDay) {
  const tiltX = [];
  const tiltY = [];
  const tiltAngle = [];

  let baseX = randomInRange(-0.003, 0.003);
  let baseY = randomInRange(-0.003, 0.003);

  for (let i = 0; i < count; i++) {
    let x = baseX + randomInRange(-0.0003, 0.0003);
    let y = baseY + randomInRange(-0.0003, 0.0003);

    // deformasi nyata hanya setelah eventDay
    if (eventDay !== null && i >= eventDay) {
      const drift = (i - eventDay) * 0.00001; // mikro-drift realistis
      x += drift;
      y += drift * 0.8;
    }

    tiltX.push(Number(x.toFixed(5)));
    tiltY.push(Number(y.toFixed(5)));

    const theta = Math.sqrt(x * x + y * y);
    tiltAngle.push(Number(theta.toFixed(5)));
  }

  // === Local displacement sesuai rumus vendor ===
  const theta0 = tiltAngle[0];

  const localDisplacement = tiltAngle.map((theta) => {
    const dx =
      GAGE_LENGTH_MM * (Math.sin(theta) - Math.sin(theta0)) +
      randomInRange(-0.001, 0.001); // noise mikro mm
    return Number(dx.toFixed(4));
  });

  // === Profil deformasi (akumulasi segmen) ===
  const cumulativeDisplacement = [];
  localDisplacement.reduce((acc, v, i) => {
    const sum = acc + v;
    cumulativeDisplacement[i] = Number(sum.toFixed(4));
    return sum;
  }, 0);

  // === Settlement & Heave (skala kecil, konsisten domain) ===
  const settlement = cumulativeDisplacement.map((v) =>
    Number((v * 0.25).toFixed(4)),
  );

  const heave = cumulativeDisplacement.map((v) =>
    Number((v * 0.08).toFixed(4)),
  );

  // === Deformation rate ===
  const deformationRate = tiltAngle.map((v, i) =>
    i === 0 ? 0 : Number((v - tiltAngle[i - 1]).toFixed(5)),
  );

  return {
    tiltX,
    tiltY,
    tiltAngle,
    localDisplacement,

    // 🔧 INI YANG MEMPERBAIKI CHART KOSONG
    cumulativeDisplacement,

    settlement,
    heave,
    deformationRate,
  };
}

function sliceLast(source, count) {
  const result = {};

  Object.keys(source).forEach((key) => {
    const values = source[key];
    result[key] = values.slice(-count);
  });

  return result;
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
