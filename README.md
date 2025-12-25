# CivicConnect Belagavi - AI-Powered Civic Orchestrator 🏛️

[![Flutter](https://img.shields.io/badge/Flutter-%2302569B.svg?style=flat&logo=Flutter&logoColor=white)](https://flutter.dev)
[![Firebase](https://img.shields.io/badge/Firebase-%23039BE5.svg?style=flat&logo=Firebase&logoColor=white)](https://firebase.google.com)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-8E75B2.svg?style=flat&logo=google-gemini&logoColor=white)](https://ai.google.dev)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?style=flat&logo=google-cloud&logoColor=white)](https://cloud.google.com)

## 🌟 The 'Why'

Belagavi faces a critical challenge in urban management due to its fragmented administrative landscape, where jurisdictions like the **Belagavi City Corporation (BCC)**, **Cantonment Board**, and **VTU Campus** often overlap. This fragmentation leads to "jurisdictional buck-passing" in waste management and road repairs, leaving citizens' grievances unresolved. **CivicConnect** eliminates this friction by using Multimodal AI to automatically identify, score, and route reports to the correct authority in real-time.

---

## 🚀 The 'How' (Technical Architecture)

Our system leverages a cutting-edge **Agentic Workflow** to transform unstructured citizen input into actionable municipal data:

### 👁️ Visual Intelligence
Utilizes **Gemini 2.0 Flash** to perform high-speed multimodal analysis. The model processes images of infrastructure failure (e.g., potholes, trash heaps) and integrates context from voice notes provided in **English, Kannada, or Marathi**.

### 🤖 Agentic Workflow
Deployed via **Python Google Cloud Functions (2nd Gen)**, the backend serves as the "Orchestrator." It uses Function Calling to generate structured JSON outputs including:
*   **Category Classification:** (Solid Waste, Roads, etc.)
*   **Severity Scoring:** (1-5 dynamic priority)
*   **Jurisdictional Routing:** Intelligent selection between BCC, Cantonment, or VTU based on visual landmarks.

### 🔄 Real-time Sync & Gamification
**Firebase Firestore** acts as the single source of truth, synchronizing data between the citizen mobile app and the official dashboard. A background trigger automatically calculates and awards **Civic Points** to users upon verified resolution, driving community engagement through a "Civic Guardian" ranking system.

---

## 🛠️ Setup Guide

Follow these steps to deploy the CivicConnect ecosystem:

### 1. Prerequisites
*   Flutter SDK (Stable)
*   Firebase CLI
*   Google Cloud Project with Vertex AI API enabled

### 2. Clone and Initialize
```bash
git clone https://github.com/harishkumbarSs/civic-connect-belagavi.git
cd civic-connect-belagavi
```

### 3. Firebase Configuration
1.  Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2.  Add an Android/iOS app and download the `google-services.json` or `GoogleService-Info.plist`.
3.  Place these files in the respective `android/app/` or `ios/Runner/` directories of the Flutter project.

### 4. Deploy Cloud Functions
Navigate to the `functions/` directory and deploy the Python backend:
```bash
cd functions
firebase deploy --only functions
```
*Note: Ensure you have set your Gemini API Key in the environment secrets or via Google Secret Manager.*

### 5. Run the Application
```bash
flutter pub get
flutter run
```

---

## 🧪 Demo Credentials

For judging and testing purposes, use the following placeholder account:

| Field | Value |
| :--- | :--- |
| **Test User** | `citizen@belagavi.in` |
| **Password** | `Belgaum@2025` |
| **BCC Dashboard** | `official@bcc.belagavi.gov.in` |

---

## 📁 Project Structure

```
civic-connect-belagavi/
├── src/
│   ├── components/      # React UI components
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NewReportForm.tsx
│   │   ├── CivicMap.tsx
│   │   └── Leaderboard.tsx
│   ├── services/        # API & business logic
│   │   ├── geminiService.ts    # AI analysis
│   │   ├── firestoreService.ts # Database ops
│   │   └── geoService.ts       # Jurisdiction detection
│   └── contexts/        # React contexts
├── functions/           # Cloud Functions backend
└── package.json
```

---

## 🏅 SDG Alignment

| Goal | Target | Contribution |
|------|--------|--------------|
| **SDG 11** | Sustainable Cities | Real-time waste/infrastructure monitoring |
| **SDG 16** | Strong Institutions | Transparent grievance tracking & accountability |

---

*Built with ❤️ for TechSprint Belgaum 2025.*