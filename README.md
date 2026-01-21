# CivicConnect Belagavi - AI-Powered Civic Grievance Platform 🏛️

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-11.1-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.0-8E75B2?style=flat&logo=google-gemini&logoColor=white)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> 🏆 **Built for TechSprint Belgaum 2025** - GDG on Campus Hackathon

---

## 🌟 The Problem

Belagavi faces a critical challenge in urban management due to its **fragmented administrative landscape**. With overlapping jurisdictions between:

- **Belagavi City Corporation (BCC)** - Municipal areas
- **Cantonment Board** - Military and civil areas
- **VTU Campus** - University grounds
- **PWD** - State highways

Citizens experience "jurisdictional buck-passing" where grievances get bounced between authorities, leaving issues unresolved.

**CivicConnect eliminates this friction** by using Multimodal AI to automatically identify, classify, and route reports to the correct authority in real-time.

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| 📸 **AI-Powered Analysis** | Upload a photo and Gemini AI instantly classifies the issue, determines severity, and suggests the responsible jurisdiction |
| 🗺️ **Live Civic Heatmap** | Interactive map showing all reported issues across Belagavi with real-time updates |
| 🎮 **Gamification** | Earn Civic Points, climb the leaderboard, and unlock badges for active participation |
| 🏛️ **Smart Routing** | Auto-detection of jurisdiction boundaries ensures reports reach the right authority |
| 🔊 **Multilingual Voice Notes** | Support for Kannada, Marathi, Hindi, and English voice descriptions |
| 📊 **Admin Dashboard** | Officials can track, update, and resolve grievances with full transparency |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for modern styling
- **Leaflet/React-Leaflet** for interactive maps
- **Zustand** for state management

### Backend & AI
- **Firebase Authentication** (Google Sign-In)
- **Cloud Firestore** (Real-time database)
- **Firebase Storage** (Image uploads)
- **Cloud Functions** (Python) - Server-side AI
- **Gemini 2.0 Flash** - Multimodal AI analysis

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/harishkumbarSs/civic-connect-belagavi.git
cd civic-connect-belagavi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Demo Credentials

For testing purposes:

| Role | Email | Password |
|------|-------|----------|
| Citizen | `demo@civicconnect.in` | N/A (Demo Mode) |
| BCC Official | `official@bcc.belagavi.gov.in` | Admin Access |

> 💡 **Demo Mode**: The app works without Firebase configuration using mock data

---

## 📁 Project Structure

```
civic-connect-belagavi/
├── src/
│   ├── components/          # React UI components
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NewReportForm.tsx
│   │   ├── CivicMap.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Leaderboard.tsx
│   ├── services/            # API & business logic
│   │   ├── geminiService.ts    # AI analysis
│   │   ├── firestoreService.ts # Database ops
│   │   └── geoService.ts       # Jurisdiction detection
│   ├── contexts/            # React contexts
│   ├── data/                # Mock data for demo
│   └── types/               # TypeScript definitions
├── functions/               # Cloud Functions (Python)
│   ├── main.py
│   └── requirements.txt
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🔧 Deployment

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Deploy Cloud Functions
```bash
cd functions
firebase deploy --only functions
```

---

## 🏅 SDG Alignment

| Goal | Target | Contribution |
|------|--------|--------------|
| **SDG 11** | Sustainable Cities | Real-time waste/infrastructure monitoring |
| **SDG 16** | Strong Institutions | Transparent grievance tracking & accountability |

---

## 🎥 Demo Video

> 📹 [Watch the demo video](#) *(Link to be added)*

---

## 👥 Team

**Built with ❤️ for TechSprint Belgaum 2025**

---

## 📄 License

MIT License - feel free to use this project for your own civic initiatives!