# Pipeline Early Warning Monitoring System (EWMS)

## 📌 Overview

This project is a **frontend prototype** of a Pipeline Early Warning Monitoring System (EWMS)  
designed to visualize sensor conditions along a **1000-meter pipeline**.

The system displays:

- Sensor nodes every **100 meters**
- Status classification (**Normal / Warning / Critical**)
- Time-based data views (**Daily, Weekly, Monthly, Yearly**)
- Sensor trend charts with **threshold indicators**

> ⚠️ All data in this project is **dummy data** for demonstration purposes.

---

## 🧭 Features

- Visual pipeline with sensor nodes (100 m – 1000 m)
- Color-coded node status:
  - 🟢 Normal
  - 🟡 Warning (threshold exceeded)
  - 🔴 Critical (critical threshold exceeded)
- Interactive charts:
  - Inclinometer
  - Tilt Meter
  - GNSS / Settlement
  - Piezometer
- Threshold lines (Warning & Critical)
- Fixed Y-axis scaling for realistic visualization

---

## 🖥️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Chart.js

---

## 🚀 How to Run Locally

1. Clone this repository
   ```bash
   git clone https://github.com/bintangsrilaksono/pipeline-ews-demo.git
   ```
