import mongoose from "mongoose";
import os from "os";
import process from "process";

/** Format uptime seconds → "2d 3h 14m 5s" */
const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`]
        .filter(Boolean)
        .join(" ");
};

/** Format bytes → "128.4 MB" */
const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

const dbStateLabel = {
    0: { label: "Disconnected", ok: false },
    1: { label: "Connected", ok: true },
    2: { label: "Connecting", ok: false },
    3: { label: "Disconnecting", ok: false },
};

export const buildStatusData = () => {
    const dbState = mongoose.connection.readyState;
    const db = dbStateLabel[dbState] ?? { label: "Unknown", ok: false };
    const mem = process.memoryUsage();
    const uptime = process.uptime();

    const envVars = [
        "MONGO_URL",
        "JWT_SECRET",
        "GEMINI_API_KEY",
        "VAPI_PRIVATE_KEY",
        "VAPI_PHONE_NUMBER_ID",
        "VAPI_ASSISTANT_ID",
        "VAPI_CUSTOMER_PHONE_NUMBER",
    ];

    const envStatus = envVars.map((key) => ({
        key,
        present: Boolean(process.env[key]),
    }));

    const services = [
        { name: "REST API", status: "operational" },
        { name: "MongoDB", status: db.ok ? "operational" : "degraded" },
        {
            name: "Gemini AI",
            status: process.env.GEMINI_API_KEY ? "operational" : "missing_key",
        },
        {
            name: "VAPI Voice",
            status: process.env.VAPI_PRIVATE_KEY ? "operational" : "missing_key",
        },
        {
            name: "Firebase Auth",
            status: process.env.FIREBASE_PROJECT_ID ? "operational" : "unknown",
        },
    ];

    const allOk = services.every(
        (s) => s.status === "operational" || s.status === "unknown"
    );

    return {
        overall: allOk ? "operational" : "degraded",
        uptime: formatUptime(uptime),
        uptimeSeconds: Math.floor(uptime),
        nodeVersion: process.version,
        platform: `${os.type()} ${os.arch()}`,
        memory: {
            rss: formatBytes(mem.rss),
            heapUsed: formatBytes(mem.heapUsed),
            heapTotal: formatBytes(mem.heapTotal),
        },
        database: { ...db, state: dbState },
        services,
        env: envStatus,
        timestamp: new Date().toISOString(),
    };
};

export const renderStatusPage = (data) => {
    const statusColor = {
        operational: "#22c55e",
        degraded: "#f59e0b",
        missing_key: "#ef4444",
        unknown: "#71717a",
    };

    const statusDot = (s) =>
        `<span class="dot" style="background:${statusColor[s] ?? "#71717a"}"></span>`;

    const statusBadge = (s) => {
        const labels = {
            operational: "Operational",
            degraded: "Degraded",
            missing_key: "Missing Key",
            unknown: "Unknown",
        };
        return `<span class="badge" style="color:${statusColor[s] ?? "#71717a"};border-color:${statusColor[s] ?? "#71717a"}20;background:${statusColor[s] ?? "#71717a"}10">${labels[s] ?? s}</span>`;
    };

    const overallColor = data.overall === "operational" ? "#22c55e" : "#f59e0b";
    const overallLabel =
        data.overall === "operational"
            ? "All Systems Operational"
            : "Some Systems Degraded";

    const servicesHtml = data.services
        .map(
            (s) => `
    <div class="row">
      <div class="row-left">${statusDot(s.status)}<span>${s.name}</span></div>
      ${statusBadge(s.status)}
    </div>`
        )
        .join("");

    const envHtml = data.env
        .map(
            (e) => `
    <div class="row">
      <div class="row-left">
        ${statusDot(e.present ? "operational" : "missing_key")}
        <code>${e.key}</code>
      </div>
      <span class="badge" style="color:${e.present ? "#22c55e" : "#ef4444"};border-color:${e.present ? "#22c55e" : "#ef4444"}20;background:${e.present ? "#22c55e" : "#ef4444"}10">
        ${e.present ? "Set" : "Missing"}
      </span>
    </div>`
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="30" />
  <title>Nimbus API — Status</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #09090b;
      color: #e4e4e7;
      min-height: 100vh;
      padding: 2rem 1rem 4rem;
    }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 760px; margin: 0 auto; }

    /* Header */
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; }
    .logo-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: #18181b; border: 1px solid #27272a;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.25rem;
    }
    .logo-text h1 { font-size: 1rem; font-weight: 700; color: #fff; }
    .logo-text p { font-size: 0.7rem; color: #52525b; margin-top: 1px; }
    .refresh-note { font-size: 0.7rem; color: #3f3f46; }

    /* Overall banner */
    .banner {
      border-radius: 14px;
      border: 1px solid;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .banner-icon { font-size: 1.5rem; }
    .banner h2 { font-size: 1rem; font-weight: 700; }
    .banner p { font-size: 0.75rem; margin-top: 2px; }

    /* Cards */
    .card {
      background: #111113;
      border: 1px solid #1f1f23;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
    }
    .card-title {
      font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #52525b; margin-bottom: 1rem;
    }

    /* Rows */
    .row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.6rem 0;
      border-bottom: 1px solid #1a1a1e;
    }
    .row:last-child { border-bottom: none; }
    .row-left { display: flex; align-items: center; gap: 0.6rem; font-size: 0.82rem; color: #d4d4d8; }
    .row-left code { font-size: 0.75rem; color: #a1a1aa; font-family: "SF Mono", "Fira Code", monospace; }

    /* Status dot */
    .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

    /* Badge */
    .badge {
      font-size: 0.68rem; font-weight: 600;
      padding: 0.2rem 0.6rem; border-radius: 999px;
      border: 1px solid; white-space: nowrap;
    }

    /* Stats grid */
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
    .stat {
      background: #0e0e10;
      border: 1px solid #1f1f23;
      border-radius: 10px;
      padding: 0.9rem 1rem;
    }
    .stat-label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #52525b; margin-bottom: 0.35rem; }
    .stat-value { font-size: 0.95rem; font-weight: 700; color: #fff; }
    .stat-sub { font-size: 0.68rem; color: #52525b; margin-top: 2px; }

    /* Footer */
    .footer { margin-top: 2.5rem; text-align: center; font-size: 0.68rem; color: #3f3f46; }

    @media (max-width: 500px) {
      .stats { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <div class="logo">
        <div class="logo-icon">🌐</div>
        <div class="logo-text">
          <h1>Nimbus API</h1>
          <p>Status Dashboard</p>
        </div>
      </div>
      <span class="refresh-note">Auto-refreshes every 30s</span>
    </div>

    <!-- Overall banner -->
    <div class="banner" style="border-color:${overallColor}20;background:${overallColor}08">
      <span class="banner-icon">${data.overall === "operational" ? "✅" : "⚠️"}</span>
      <div>
        <h2 style="color:${overallColor}">${overallLabel}</h2>
        <p style="color:#71717a">Last checked: ${data.timestamp}</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats" style="margin-bottom:1rem">
      <div class="stat">
        <div class="stat-label">Uptime</div>
        <div class="stat-value">${data.uptime}</div>
        <div class="stat-sub">${data.uptimeSeconds.toLocaleString()}s total</div>
      </div>
      <div class="stat">
        <div class="stat-label">Heap Used</div>
        <div class="stat-value">${data.memory.heapUsed}</div>
        <div class="stat-sub">of ${data.memory.heapTotal}</div>
      </div>
      <div class="stat">
        <div class="stat-label">RSS Memory</div>
        <div class="stat-value">${data.memory.rss}</div>
        <div class="stat-sub">resident set size</div>
      </div>
      <div class="stat">
        <div class="stat-label">Node.js</div>
        <div class="stat-value">${data.nodeVersion}</div>
        <div class="stat-sub">${data.platform}</div>
      </div>
    </div>

    <!-- Services -->
    <div class="card">
      <div class="card-title">Services</div>
      ${servicesHtml}
    </div>

    <!-- Environment Variables -->
    <div class="card">
      <div class="card-title">Environment Variables</div>
      ${envHtml}
    </div>

    <!-- Footer -->
    <div class="footer">
      Nimbus API &mdash; ${data.timestamp} &mdash; Node ${data.nodeVersion}
    </div>
  </div>
</body>
</html>`;
};
