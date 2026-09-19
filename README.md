# 🚦 MargaNetra: Neura-X Integrated Traffic Intelligence System

> **Next-Generation Metropolitan Traffic Surveillance, Predictive Shockwave Modeling, and Emergency Green-Wave Orchestration.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Zero External API Keys Needed](https://img.shields.io/badge/Gemini_API_Key-Not_Required_(100%25_Offline)-brightgreen)](#-zero-cloud-api-dependencies)

---

## 📌 Executive Summary

**MargaNetra (मार्गानेत्र / మార్గనేత్ర)** is a production-grade Intelligent Transportation System (ITS) and traffic command center. Powered by the **Neura-X Traffic Engine**, it blends transportation physics equations—such as the **Bureau of Public Roads (BPR)** formulation and **Lighthill-Whitham-Richards (LWR)** kinematic shockwaves—with spatial graph algorithms to simulate, predict, and mitigate urban congestion in real time across a 120-junction metropolitan highway network.

The platform requires **zero external cloud API keys** (including Google Gemini) to run its predictive physics, signal timing, and audio synthesis routines.

---

## 🌟 Core Modules & Architecture

### 1. 🎛️ Metropolitan Command Center
* **Citywide Health Index**: Real-time evaluation of network fluidity, average corridor speed ($39.6\text{ km/h}$ baseline), aggregate volume, and active bottleneck count.
* **Active Incident Monitor**: Live radar tracking of stalled vehicles, demand inflow surges, and construction work zones with one-click dispatch triggers.
* **Synchronized Signal Overview**: Status telemetry for 89 signalized traffic controllers across the grid.

### 2. 🗂️ 436 Roads Directory
* **Complete Asset Catalog**: Complete index of all 436 directed highway corridors (`R0001` – `R0436`).
* **Multi-Parametric Filtering**: Filter by Road Class (*Arterials, Collectors, Expressways*) and AI Risk Level (*Critical, Elevated, Monitored, Optimal*).
* **Live Sorting**: Real-time sorting by Congestion Index ($V/C$), Speed Drop, Delay Minutes, and Queue Length.
* **Modal Deep-Dive**: Inspect individual link metrics, free-flow speeds, lane capacities, structural bottleneck classifications, and signal cycle ties.

### 3. 🗺️ Interactive Network Topology Graph
* **High-Density Vector Map**: SVG-based graph visualizing all **120 Junction Nodes** (`N001` – `N120`) in a $12 \times 10$ spatial matrix alongside all 436 connecting directional links.
* **Interactive Controls**: Smooth pan and zoom ($60\%$ to $300\%$) with canvas reset.
* **Live Link Coloring**: Links dynamically colored by congestion state (Green $\rightarrow$ Cyan $\rightarrow$ Amber $\rightarrow$ Crimson).
* **Hover & Click Inspection**: Direct link telemetry overlay with instant shortcuts to Forecast, Spillback Trace, and Diversion Planning.

### 4. 📈 Spatial-Temporal Traffic Predictor
* **Multi-Horizon Forecasting**: Projects corridor conditions for $+15$, $+30$, $+45$, and $+60$ minutes into the future.
* **Confidence & Uncertainty Bands**: Visualizes upper and lower confidence intervals for predicted speeds and flow volumes.
* **Trend Detection**: Flags deteriorating corridors before congestion becomes visible to manual monitoring.

### 5. 🌊 Causal Spillback Engine (LWR Shockwave Propagation)
* **Kinematic Fluid Dynamics**: Implements the Lighthill-Whitham-Richards (LWR) equation:
  $$w = \frac{\Delta q}{\Delta k} = \frac{q_{\text{in}} - q_{\text{out}}}{k_{\text{jam}} - k_{\text{free}}}$$
  modeling backward-propagating shockwaves at realistic urban speeds ($\approx 12\text{ km/h}$).
* **Upstream Cascade Tracing**: Computes exact shockwave arrival times ($\text{ETA}$) and physical vehicle queue accumulation across multi-tier upstream hops.
* **Origin-Destination (OD) Flow Impact**: Identifies commuter, freight, and transit corridors impacted by downstream incidents.

### 6. 🔀 Incident Bypass & Diversion Planning (K-Shortest Paths)
* **K-Shortest Path Search**: Automatically computes 3 distinct detours around any blocked or incident corridor:
  1. **Primary Recommended Bypass**: Highest-capacity arterial alternate.
  2. **Secondary Alternate**: Parallel service corridor.
  3. **Contingency Route**: Outer perimeter or bypass loop.
* **Neighborhood Capacity Safeguards**: Evaluates spare road capacity ($C_{\text{spare}}$) and lane configurations to prevent spilling highway traffic onto residential streets.
* **Turn Restriction Verification**: Ensures routes are legally and physically traversable by commercial and emergency vehicles.

### 7. 🚑 Emergency Green Wave Corridor Dispatch
* **Preemptive Signal Coordination**: Prioritizes emergency vehicles (Ambulance, Fire, Police, VIP Escort) across up to 8 consecutive signalized intersections.
* **Dynamic Cycle Offsets**: Calculates arrival times based on current corridor speeds and shifts signal phase offsets to guarantee a green corridor before the vehicle arrives.
* **Impact Reduction**: Reduces emergency response transit delay by up to **68%**.

### 8. 🏗️ Infrastructure Investment Planner (BPR Optimization)
* **Counterfactual BPR Delay Modeling**: Simulates travel-time reduction across 90 predefined civil engineering interventions (`candidates`):
  * Lane additions & highway widening
  * Grade-separated flyovers & underpasses
  * Smart adaptive signal coordination
* **Cost vs. Delay ROI**: Compares intervention cost indices against vehicle-hours saved to prioritize municipal highway budgets.

### 9. 🛡️ Network Resilience & Stress Simulator
* **Percolation Theory Simulation**: Stress-tests grid resilience under severe synthetic disruptions:
  * Monsoon Downpours (+45% delay penalty)
  * Peak Commute Surges
  * Critical Arterial Severance
* **Vulnerability Mapping**: Highlights structural single-points-of-failure across the metropolitan network.

### 10. 📅 Weekly Macro Patterns & Weather Sensitivity Profiler
* **Day-of-Week Demand Cycles**: Explores recurrent commuter rhythms across Monday through Sunday.
* **Diurnal Rush-Hour Curves**: Visualizes morning ($08:00 - 10:30$) and evening ($17:00 - 21:00$) rush-hour peaks.
* **Interactive Weather Multipliers**: Toggle between **Dry (1.0x)**, **Light Rain (+20%)**, and **Monsoon (+45%)** to simulate precipitation impact on network velocity.
* **Macro Societal KPIs**: Weekly Vehicle Kilometers Traveled ($14.2\text{M VKT}$), Lost Commuter Time ($246,000\text{ hrs}$), and Idling Fuel Inefficiency ($380,000\text{ Liters}$).

### 11. 🎥 CCTV Surveillance & 3D Global Visualization
* **Multi-Channel CCTV Grid**: Simulated live highway cameras with automated bounding-box overlays, vehicle velocity detection, and plate resolution telemetry.
* **3D Earth Megacity Globe**: Interactive WebGL globe (Three.js) visualizing velocity profiles, fleet counts, and peak hours across 25+ global megacities (Hyderabad, Tokyo, New York, London, Singapore, Dubai, etc.).
* **Live Radar View**: Interactive Google Maps overlay for real-time spatial positioning.

### 12. 🎙️ Multilingual Radio Dispatcher
* **Voice Broadcasts**: Broadcasts operational traffic advisories in **English**, **Hindi (हिंदी)**, and **Telugu (తెలుగు)**.
* **Native Speech Synthesis**: Uses the browser's built-in `window.speechSynthesis` and Web Audio API synthesizer chimes—no cloud voice tokens required.

---

## 🔒 Zero Cloud API Dependencies

A core design principle of MargaNetra is that it is **entirely self-contained**:
* **No Gemini API Key Needed**: All forecasting, physics math, graph routing, and risk classifications execute client-side in TypeScript.
* **No Database Server Required**: Network structures, incident catalogs, and signal tables are bundled directly within `neuraxData.json`.
* **Zero Cost to Run**: Operates in any modern web browser with instantaneous response times.

---

## 💻 Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Component architecture & strict type safety |
| **Bundler & Server** | Vite 6 | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | Tailwind CSS 4 + Lucide Icons | Responsive command-center design system |
| **Charts & Visuals** | Recharts + Native SVG | High-density diurnal charts and vector network topology |
| **3D Graphics** | Three.js + `react-globe.gl` | 3D Megacity Earth Globe rendering |
| **Audio & Speech** | Web Speech API + Web Audio API | Client-side audio chimes and multilingual voice broadcast |
| **Maps (Optional)** | `@vis.gl/react-google-maps` | Spatial mapping (graceful fallback if key omitted) |

---

## 📁 Repository Structure

```
├── public/                     # Static assets and icons
├── src/
│   ├── components/
│   │   ├── neurax/             # Core Neura-X Intelligence Modules
│   │   │   ├── CommandOverview.tsx       # City health, macro stats & active incidents
│   │   │   ├── RoadsIntelligenceView.tsx # 436 Roads directory & search table
│   │   │   ├── NetworkTopologyMap.tsx    # 120-junction interactive SVG vector canvas
│   │   │   ├── PredictorView.tsx         # 15-60 min forward horizon forecasting
│   │   │   ├── SpillbackView.tsx         # LWR kinematic shockwave cascade tracer
│   │   │   ├── DiversionView.tsx         # K-shortest path detour planning
│   │   │   ├── GreenWaveView.tsx         # Emergency vehicle signal preemption
│   │   │   ├── PlanningView.tsx          # BPR infrastructure countermeasure optimizer
│   │   │   ├── ResilienceView.tsx        # Grid stress-testing & failure simulation
│   │   │   ├── WeeklyView.tsx            # Weekly macro profiles & weather sensitivity
│   │   │   ├── CCTVFeedsView.tsx         # Multi-channel camera surveillance grid
│   │   │   ├── CityGlobeView.tsx         # 3D Three.js Earth megacity globe
│   │   │   ├── RadioDispatchModal.tsx    # Multilingual (EN/HI/TE) voice alert modal
│   │   │   └── RoadDetailModal.tsx       # Single road segment deep-dive modal
│   │   └── ui/                 # Reusable atomic UI elements
│   ├── data/
│   │   ├── neuraxData.json     # 120 nodes, 436 links, 90 projects, signals & scenarios
│   │   └── cities.ts           # 25+ global megacities telemetry dataset
│   ├── services/
│   │   ├── neuraxService.ts    # BPR physics, LWR equations, graph BFS & audio synthesizer
│   │   └── soundService.ts     # Web Audio API emergency siren & radio chimes
│   ├── types/
│   │   └── neurax.ts           # Comprehensive TypeScript domain interfaces
│   ├── App.tsx                 # Main layout & navigation state machine
│   ├── index.css               # Tailwind CSS entrypoint
│   └── main.tsx                # Application bootstrapping
├── index.html                  # HTML entry point with metadata tags
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite plugins and build setup
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js** (v18.0 or higher)
* **npm** or **bun** / **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone <REPO_URL>
   cd marganetra
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled static bundle will be generated in `dist/`.

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in the root directory if you wish to enable Google Maps:

```env
# Optional: Only needed for the Google Maps Live Radar tab
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

*(Note: If omitted, all other intelligence, topology, 3D globe, and CCTV features will continue to work seamlessly.)*

---

## 📜 Mathematical Foundations

### 1. Bureau of Public Roads (BPR) Link Congestion Function
$$t = t_0 \left[ 1 + \alpha \left( \frac{V}{C} \right)^\beta \right]$$
* $t$: Actual travel time on the segment
* $t_0$: Free-flow travel time ($L / v_{\text{free}}$)
* $V$: Vehicle flow volume (veh/hr)
* $C$: Practical road capacity (veh/hr)
* $\alpha = 0.15$, $\beta = 4.0$ (standard transportation calibration parameters)

### 2. Kinematic Shockwave Propagation (LWR)
$$w_{\text{shockwave}} = \frac{q_B - q_A}{k_B - k_A}$$
* $q$: Traffic flow (vehicles/hour)
* $k$: Traffic density (vehicles/km)
* Backward wave velocity is calibrated to an urban arterial standard of $12\text{ km/h}$.

---

## 👥 Contributors & Acknowledgements
Built for modern metropolitan traffic management departments, smart city command centers, and transportation planners.
For feedback or questions, reach out to `nikshithnooka@gmail.com`.
