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

The application will start at `http://localhost:5173/`.

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

#### Affected device and CDN
| Dimension | Finding |
|---|---|
| **Affected CDN** | **Fastly** |
| **Affected Device** | **SmartTV** |
| **Time Window** | **Tuesday, September 25, 2026, 8:30 IST – Wednesday, September 25, 2026, 23:30 IST** |
| **Duration** | **15 hours** |

#### Impact
| Dimension | Finding |
|---|---|
| **Total Plays Affected** | **7,413 plays (~4,813 unique viewers)** |
| **Rebuffering Rate** | **Surged from 0.98% to 5.24%** |
| **Average Bitrate** | **Dropped from 4.58Mbps to 2.48Mbps%** |
| **Average Startup Time** | **Moved from 2.61 sec to 6.52 sec** |
| **Playback Error Rate** | **0.46% to at a high of 2.11%** |
| **Unique Views** | **868 to 2.8K unique views of SmartTV were exposed to degraded playback** |
| **Total Plays** | **1.3K to 4.2K plays of SmartTV were exposed to degraded playback** |


### Concrete Steps Used to Discover the Incident
1. **Initial Inspection**: With the default "Last 7 days" view and "Rebuffering" active, an isolated spike was visible on the overall traffic line chart around September 25.
2. **CDN Grouping**: Selected `Group by: CDN` in the time-series chart. The spike was immediately isolated to the **Fastly** delivery line, while **Akamai** and **CloudFront** remained flat at their baselines.
3. **Device Narrowing**: Now, filtering by Fastly since it was affected and grouping by `Device type` completely concentrated on **SmartTV** devices. Other devices on Fastly experienced normal playback metrics during the same window.
4. **Average Bitrate Drop and rise in Playback Error**: Since bitrate directly implies the quality of the video, the sudden drop of bitrate during the exact time frame and increase in playback error proves it further.