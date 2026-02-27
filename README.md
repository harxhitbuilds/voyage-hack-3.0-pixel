<p align="center">
  <img src="./client/public/marketing/landing.png" alt="Nimbus — AI Heritage Travel Platform" width="100%" />
</p>

<h1 align="center">🏛️ Nimbus</h1>

<p align="center">
  <strong>AI-Powered Heritage Travel Platform for India</strong><br/>
  Voice-guided trips · AR/VR/3D experiences · 2D→3D generation · Smart recommendations
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Vapi_AI-Voice-7C3AED?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
</p>

<p align="center">
  <a href="https://pixel-symbiosis-skill-hackathon.vercel.app"><strong>🌐 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="https://pixel-symbiosis-skill-hackathon.onrender.com/health"><strong>⚡ API Status</strong></a>
</p>

---

## What is Nimbus?

Nimbus bridges traditional Indian heritage tourism with next-generation AI technology. In one platform, users can:

- 📞 **Full Offline Booking** Agentic AI Call Voice Agent that plans their entire trip through natural voice conversation in your native language .
- 🎨 **Convert any photo into a 3D model** using a transformer pipeline trained from scratch
- 🏛️ **Explore 500+ monuments** in interactive 3D, augmented reality, and full VR walkthroughs

---

## 🎬 Demo Video

<p align="center">
  <video src="./client/public/marketing/promotional_video.mp4" controls width="100%" style="border-radius:12px;max-width:860px">
    Your browser does not support the video tag.
    <a href="./client/public/marketing/promotional_video.mp4">▶ Watch the Nimbus demo video</a>
  </video>
</p>

---

## 🖥️ Screenshots

| Dashboard                                             | Trips                                         |
| ----------------------------------------------------- | --------------------------------------------- |
| ![Dashboard](./client/public/marketing/dashboard.png) | ![Trips](./client/public/marketing/trips.png) |

| Heritage Explorer                                   | AR Studio (2D→3D)                                     |
| --------------------------------------------------- | ----------------------------------------------------- |
| ![Experience](./client/public/marketing/models.png) | ![AR Studio](./client/public/marketing/ar-studio.png) |

| AR / VR Experience                                 | AI Recommendations                                      |
| -------------------------------------------------- | ------------------------------------------------------- |
| ![AR/VR](./client/public/marketing/expirience.png) | ![Recommendations](./client/public/marketing/recom.png) |

---

## 🚀 Core Features

### 1 · 📞 Voice Agent & End-to-End Trip Booking

> _Vapi AI · Twilio · Gemini 2.5 Flash · MCP Server · SSE · Gmail API · Amadeus / RapidAPI_

The flagship feature. One click → outbound phone call to the user's number. The AI agent doesn't just plan — it **books everything and sends a confirmed itinerary to your inbox, all on the call**:

```
Click "New Trip"
   → Vapi outbound call to user's phone
   → Natural voice conversation (any language)
   → MCP tools fire in real time mid-call:
        ┌─ search_flights()     Amadeus API — live fare + seat availability
        ├─ book_flight()        Confirms ticket, returns PNR
        ├─ search_hotels()      RapidAPI Hotels — live inventory by city/date
        ├─ book_hotel()         Confirms room, returns booking ID
        └─ send_itinerary()     Gmail API — full PDF itinerary to user's email
   → Transcript → Gemini 2.5 Flash extraction
   → Structured day-by-day plan saved to MongoDB
   → Rich trip detail page live on dashboard
```

**MCP (Model Context Protocol) server** exposes a tool registry to the Vapi assistant, so the agent can call real APIs mid-sentence without dropping the conversation. The user hears _"I've found a ₹4,200 IndiGo flight on the 15th — shall I book it?"_ and a confirmation email lands in their inbox before the call ends.

Call status (`queued → ringing → in-progress → ended`) is streamed to the UI in real time via **Server-Sent Events**. Once the call ends, Gemini extracts costs, activities, tips, and monument recommendations into a full structured itinerary.

| MCP Tool         | Provider              | What it does                                  |
| ---------------- | --------------------- | --------------------------------------------- |
| `search_flights` | Amadeus API           | Live fares, stops, duration                   |
| `book_flight`    | Amadeus API           | Confirms booking, returns PNR                 |
| `search_hotels`  | RapidAPI Hotels       | Real-time room availability + pricing         |
| `book_hotel`     | RapidAPI Hotels       | Confirms room, returns booking ref            |
| `get_monuments`  | MongoDB (internal)    | AR-enabled heritage sites near destination    |
| `send_itinerary` | Gmail API (OAuth 2.0) | Sends formatted PDF itinerary to user's inbox |

---

### 2 · 🎨 2D → 3D Gen AI Self Trained (NimbusAI)

> _Custom transformer model · Hugging Face Spaces · `@gradio/client` · `<model-viewer>`_

**NimbusAI** is a proprietary image-to-3D pipeline trained from scratch on monument and object photographs paired with photogrammetry ground-truth meshes:

```
Photo → Background Segmentation → Geometry Mesh → PBR Texture Baking → .glb
```

Upload any JPEG/PNG (≤ 20 MB) in the AR Studio. A live 5-step progress indicator walks through the pipeline. The output is a fully textured `.glb` file, rendered with Google's `<model-viewer>` and available for direct download — usable in Blender, Unity, or Unreal. Warm-up fallback returns a showcase model so the feature always demos well.

---

### 3 · 🥽 AR / VR / 3D Heritage Experiences

> _Sketchfab · A-Frame · WebXR · AR.js_

Every monument supports three immersive modes:

| Mode   | Tech                          | Experience                                                  |
| ------ | ----------------------------- | ----------------------------------------------------------- |
| **3D** | Sketchfab Viewer API          | Orbitable, lit 3D model embedded in-browser                 |
| **AR** | A-Frame + AR.js (WebAR)       | Overlay the monument on the real world via phone camera     |
| **VR** | A-Frame (self-contained HTML) | Fullscreen 360° walkthrough with audio narration & hotspots |

Every interaction is tracked via `trackVisit` → powers the user's **Heritage Score** on their profile.

---

### 4 · 🤖 AI-Powered Recommendations

> _Gemini 2.0 Flash · Unsplash API · Zustand_

Users complete a one-time preference profile (travel style, budget, group size, hometown). This is sent as structured context to **Gemini 2.0 Flash**, which returns a ranked list of Indian destinations with **semantic match scores** (0–1), descriptions, and live Unsplash photography. A separate Gemini call powers **Trending Destinations** — scored by seasonal relevance and cultural significance. A curated static fallback ensures the page is never empty.

---

## 💼 Business Model & Revenue Streams

> India's heritage tourism sector is a **₹2.3 lakh crore (~$28B) opportunity** — yet less than 4% of ASI monuments have any digital presence. Nimbus is positioned to own that gap.

<table>
<tr>
<td width="50%" valign="top">

### 🔌 1 · NimbusAI API-as-a-Service

**Sell our trained 2D→3D model as a cloud API.**

Museums, e-commerce platforms, interior design apps, and ed-tech companies all need holistic 3D views from a single product/artefact photo — without building the ML pipeline themselves.

- **Tier 1 — Free:** 10 generations/month (developer onboarding)
- **Tier 2 — Studio ₹4,999/mo:** 500 generations + priority queue
- **Tier 3 — Enterprise:** Unlimited + white-label + SLA

> 🎯 Target: 500 API customers in Year 1 → **₹2.5 Cr ARR**

</td>
<td width="50%" valign="top">

### 🇮🇳 2 · Govt & Incredible India Partnerships

**B2G revenue via ASI, Ministry of Tourism & state tourism boards.**

The Govt's _Dekho Apna Desh_ and _Incredible India 2.0_ initiatives have active digital mandates with allocated budgets. Nimbus provides a white-label, plug-and-play AR/VR/3D layer for any heritage site — no in-house tech team needed.

- **Integration fee** per monument digitised
- **Annual licence** for the AI voice-guide assistant
- **Co-branding** on national tourism campaigns

> 🎯 Pilot with 3 state tourism boards → **₹1.8 Cr contract pipeline**

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🏨 3 · B2B SaaS for Travel & Hospitality

**Subscription platform for tour operators, OTAs & hotels.**

Operators (MakeMyTrip, SOTC, Thomas Cook India) pay a monthly licence to embed Nimbus's AI trip-planning voice agent and AR monument experiences directly into their own apps — turning a commodity booking flow into a premium experiential product.

- **Per-seat SaaS licence** for travel agents
- **Revenue share** on bookings generated by AI recommendations
- **Custom AI assistant** fine-tuned on operator's inventory

> 🎯 5 OTA integrations in Year 1 → **₹3.2 Cr ARR**

</td>
<td width="50%" valign="top">

### 🎓 4 · EdTech & Institutional Licensing

**License the 3D monument library + AR experiences to schools, universities & cultural institutions.**

India has 1.5M+ schools. History and social-science teachers have zero immersive tools. Nimbus packages curated monument AR/VR experiences as curriculum-aligned modules sold to CBSE/ICSE schools and ed-tech platforms (BYJU'S, Unacademy, Diksha).

- **Annual school licence ₹12,000/year** per institution
- **Platform deal** with national ed-tech players
- **Content creation fee** for new monument modules

> 🎯 1,000 schools in Year 1 → **₹1.2 Cr ARR**

</td>
</tr>
</table>

<p align="center">
  <strong>Combined Year-1 Revenue Target: ₹8.7 Cr ARR</strong> &nbsp;|&nbsp;
  TAM: ₹2.3 lakh crore &nbsp;|&nbsp;
  3,691 ASI-protected monuments undigitised &nbsp;|&nbsp;
  10.9 Cr domestic heritage tourists annually
</p>

---

## 🏗️ Architecture

```
Client (Next.js 16 + Zustand)
        │  Axios + SSE
        ▼
Server (Express + Node.js)
  ├── /api/auth             Firebase Admin → JWT
  ├── /api/vapi             Vapi SDK · Gemini 2.5 Flash · SSE polling
  │       └── MCP Server ──► search_flights()   Amadeus API
  │                        ► book_flight()       Amadeus API
  │                        ► search_hotels()     RapidAPI Hotels
  │                        ► book_hotel()        RapidAPI Hotels
  │                        ► get_monuments()     MongoDB (internal)
  │                        ► send_itinerary()    Gmail API (OAuth 2.0)
  ├── /api/recommendations  Gemini 2.0 Flash · Unsplash
  ├── /api/3dmodel          MongoDB monument library
  └── /api/model3d          NimbusAI transformer → .glb
        │
        ▼
MongoDB · Vapi AI · Twilio · Gemini · Amadeus · Gmail · Hugging Face
```

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Shadcn/ui · Firebase · GSAP · Leaflet · `<model-viewer>`

**Backend:** Express · MongoDB/Mongoose · Firebase Admin · `@vapi-ai/server-sdk` · `@google/generative-ai` · `@gradio/client` · multer · winston

**External:** Vapi AI · Twilio · Gemini 2.5 Flash · Gemini 2.0 Flash · Unsplash · Sketchfab · Hugging Face Spaces · **Amadeus Flights API** · **RapidAPI Hotels** · **Gmail API (OAuth 2.0)** · Vercel · Render

---

## 📦 Key Data Models

<details>
<summary><strong>User</strong></summary>

```js
{ name, email, hometown, onBoarded,
  travelPreferences: { travelStyle[], budgetRange[], groupSize[], ... },
  trips: [Trip], visitedMonuments: [ThreeDModel] }
```

</details>

<details>
<summary><strong>Trip</strong></summary>

```js
{ userId, callId, transcript, callStatus, callDuration,
  tripDetails: { destination, startDate, endDate, budget, travelers },
  aiInsights: { keyPoints[], tripSummary },
  itinerary: [{ day, title, activities[], estimatedCost, tips }] }
```

</details>

<details>
<summary><strong>Monument (ThreeDModel)</strong></summary>

```js
{
  (name,
    description,
    location,
    yearBuilt,
    architecture,
    imageUrl,
    sketchfabUid,
    arlink,
    vrHTMLPath);
}
```

</details>

---

## 📡 API Highlights

| Method | Endpoint                            | Description                           |
| ------ | ----------------------------------- | ------------------------------------- |
| `POST` | `/api/vapi/create-call`             | Start AI voice trip call              |
| `GET`  | `/api/vapi/trips`                   | List all user trips                   |
| `GET`  | `/api/vapi/call-status/:callId`     | SSE stream — live call status updates |
| `POST` | `/api/mcp/search-flights`           | Live flight search via Amadeus        |
| `POST` | `/api/mcp/book-flight`              | Confirm flight, returns PNR           |
| `POST` | `/api/mcp/search-hotels`            | Live hotel search via RapidAPI        |
| `POST` | `/api/mcp/book-hotel`               | Confirm hotel, returns booking ref    |
| `POST` | `/api/mcp/send-itinerary`           | Send PDF itinerary via Gmail API      |
| `GET`  | `/api/recommendations/personalized` | Gemini-powered destination picks      |
| `GET`  | `/api/3dmodel/`                     | Full monument library                 |
| `POST` | `/api/model3d/generate`             | 2D image → textured `.glb`            |

**`POST /api/model3d/generate`** — `multipart/form-data`, `?texture=true`  
Returns: `{ glbUrl, texturedGlbUrl, segmentedImageUrl, seed, isPreview }`

---

## ⚡ Getting Started

```bash
# 1. Clone
git clone https://github.com/your-org/nimbus.git

# 2. Install
cd client && npm install
cd ../server && npm install

# 3. Configure — copy and fill both .env files
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 4. Seed monuments
cd server && npm run seed:3dmodels

# 5. Run
npm run dev          # in /server
npm run dev          # in /client  →  http://localhost:3000
```

<details>
<summary><strong>Required Environment Variables</strong></summary>

**`server/.env`**

```env
MONGO_URL=
JWT_SECRET=
GEMINI_API_KEY=
UNSPLASH_ACCESS_KEY=
VAPI_PRIVATE_KEY=
VAPI_PHONE_NUMBER_ID=
VAPI_ASSISTANT_ID=
VAPI_CUSTOMER_PHONE_NUMBER=
MODEL3D_SPACE=
HF_TOKEN=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
# Flight booking (Amadeus)
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
# Hotel booking (RapidAPI)
RAPIDAPI_HOTELS_KEY=
# Gmail itinerary (OAuth 2.0)
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_SENDER_ADDRESS=
```

**`client/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

</details>

---

## 👥 Team · Pixel — Symbiosis Skills Hackathon 2026

| Role                     | Contribution                                                 |
| ------------------------ | ------------------------------------------------------------ |
| **Full-Stack Lead**      | Next.js + Express architecture, API design, state management |
| **AI/ML Engineer**       | 2D→3D model training, Gemini integration, recommendations    |
| **Voice Agent Engineer** | Vapi + Twilio, MCP server, transcript → itinerary pipeline   |
| **UI/UX Designer**       | Premium dark SaaS design system, AR/VR experience flows      |

---

<p align="center">
  <strong>Nimbus</strong> — Rediscovering India, one monument at a time.
</p>
