# StreamPulse — QoE Analytics Dashboard

StreamPulse is a real-time Quality of Experience (QoE) analytics dashboard designed for video streaming operations and network reliability engineers. It provides instant visibility into playback health, stalls, startup performance, and infrastructure delivery across CDNs, devices, and countries.

---

## 1. Quick Start & Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

The application is available at: `https://rupakboral.github.io/StreamPlus/`.

### Production Build & Typecheck

```bash
# Typecheck with TypeScript strict mode and compile production bundle
npm run build
```


-----


## 2. AI Tools Used
- **Claude**: Used to turn the assignment brief into structured planning docs (PRD, PLAN and SKILL) I
  reviewed and worked from — helped me nail down the requirements and edge cases before writing
  code.
- **Antigravity**: Used as a coding assistant for boilerplate (component scaffolding, TanStack
  Query setup, chart config) under my direction — I made the architecture and implementation
  decisions and reviewed/adjusted the generated code.


----


## 3. Incident Investigation Report

### Incident Summary

| Dimension | Finding |
|---|---|
| **Affected CDN** | Fastly |
| **Affected Device** | SmartTV |
| **Time Window** | September 25, 2026, 08:30 – 23:30 IST |
| **Duration** | ~15 hours |

### Impact

| Metric | Baseline | During Incident |
|---|---|---|
| Rebuffer Ratio | 0.98% | 5.24% |
| Avg Bitrate | 4.58 Mbps | 2.48 Mbps |
| Avg Startup Time | 2.61s | 6.52s |
| Error Rate | 0.46% | 2.11% |
| Plays Affected | — | ~7,413 plays |
| Unique Viewers Affected | — | ~4,813 viewers |

### Concrete Steps Used to Discover the Incident

1. **Initial inspection** — Default "Last 7 days" view, Rebuffering metric active. An
   isolated spike was visible on the overall traffic line chart around September 25.
2. **CDN grouping** — Set `Group by: CDN`. The spike isolated to the Fastly line, while
   Akamai and CloudFront remained flat at baseline.
3. **Device narrowing** — Filtered to Fastly and set `Group by: Device`. The spike
   concentrated on SmartTV; other devices on Fastly showed normal metrics during the
   same window.
4. **Cross-metric confirmation** — Average bitrate dropped and error rate rose on the
   same Fastly/SmartTV slice during the same window, confirming a real delivery
   degradation rather than a display artifact.