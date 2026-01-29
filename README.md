# 🛡️ AgriShield AI

> **"Nature Meets Cyber"** — A Next-Gen Intelligent Platform for Crop Disease Detection.

AgriShield AI is a state-of-the-art web platform that empowers farmers with instant, AI-driven crop disease diagnosis. By combining **Google's Gemini 1.5 Flash** with **local weather intelligence** and a **specialized treatment knowledge base**, AgriShield provides not just a diagnosis, but a complete, context-aware recovery protocol.

![AgriShield AI Banner](frontend/public/vite.svg)

## ✨ Key Features

-   **🤖 Advanced AI Diagnostics**: Powered by **Gemini 1.5 Flash Multimodal AI**, capable of analyzing complex visual symptoms with high accuracy.
-   **🌤️ Context-Aware RAG**: Integrates real-time **Hyper-Local Weather Data** (precip, humidity, temp) to understand *why* the disease occurred.
-   **📚 Knowledge Retrieval**: Queries a curated `treatments.json` database to provide verified agricultural protocols, not just generic LLM advice.
-   **🎨 Cyber-Nature UI**: A stunning, responsive interface featuring glassmorphism, fluid animations, and a farmer-first UX designed for clarity.
-   **⚡ Real-Time Sync**: Syncs scan data with a robust **SQLite + Node.js** backend for historical tracking and outbreak monitoring.

## 🏗️ Tech Stack

### Frontend (User Interface)
-   **Framework**: React 19 + Vite (Speed & Modern Features)
-   **Styling**: TailwindCSS + Lucide React (Icons)
-   **Storage**: IndexedDB (`idb`) for offline-capable caching
-   **HTTP Client**: Native `fetch` with robust error handling

### Backend (Intelligence Layer)
-   **Runtime**: Node.js + Express
-   **AI Core**: Google Generative AI SDK (Gemini 1.5 Flash)
-   **Database**: SQLite3 (Lightweight, reliable storage)
-   **External APIs**: Open-Meteo (Weather), Google AI Studio

## 🚀 Getting Started

Follow these instructions to get the complete platform running locally.

### Prerequisites
-   **Node.js** (v18 or higher)
-   **Google Gemini API Key** (Get one at [aistudio.google.com](https://aistudio.google.com/))

### 1. Backend Setup

The backend handles AI analysis, database operations, and weather data fetching.

```bash
cd backend

# 1. Install Dependencies
npm install

# 2. Configure Environment
# Create a .env file in the backend directory and add your key:
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# 3. Start the Server
npm run dev
```

> The server will start on `http://localhost:5000`. You should see "Connected to the SQLite database."

### 2. Frontend Setup

The frontend provides the user interface for capturing images and viewing results.

```bash
cd frontend

# 1. Install Dependencies
npm install

# 2. Start the Development Server
npm run dev
```

> The app will launch at `http://localhost:5173`. Open this URL in your browser.

## 📖 How It Works (RAG Pipeline)

1.  **Image Capture**: User uploads or snaps a photo of a crop.
2.  **Context Gathering**:
    *   **Weather**: Backend fetches past 7-day weather history for the user's GPS location.
    *   **Knowledge Base**: Backend loads known treatment protocols for potential matches.
3.  **Multimodal Analysis**:
    *   The Image, Weather Data, and Knowledge Base are sent to **Gemini 1.5**.
    *   Gemini reasons across these inputs to determine the disease and recommend a cure.
4.  **Result**: The user receives a structured report with Confidence Score, Reasoning, and verified Treatment.

## 🌐 API Reference

### `POST /api/analyze`
Analyzes a plant image for disease.
*   **Body**: `{ "imageBase64": "...", "latitude": 12.34, "longitude": 56.78 }`
*   **Returns**: JSON with disease name, confidence, reasoning, and treatment.

### `GET /api/scans`
Retrieves history of recent scans from the local database.

### `GET /api/scans/stats`
Returns aggregate statistics like disease distribution and average confidence levels.

## 🤝 Contributing

We welcome contributions! Please fork the repository and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for Kisaan (Farmers)**
