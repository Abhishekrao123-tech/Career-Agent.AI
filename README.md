# 🎯 AI Career Roadmap Agent

> An intelligent, full-stack career planning platform that transforms academic and professional ambiguity into structured, actionable, and data-driven learning paths.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://frontend-drab-nu-30.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 Live Deployment

| Service | Component | Production URL |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | [frontend-drab-nu-30.vercel.app](https://frontend-drab-nu-30.vercel.app) |
| **Backend** | Node.js + Express | [backend-eta-six-83.vercel.app](https://backend-eta-six-83.vercel.app) |

---

## 💡 Why This Project Matters

Navigating career transitions and skill building can feel overwhelming without clear direction. The **AI Career Roadmap Agent** bridges the gap between ambition and execution by leveraging AI agents to assess current skill levels, pinpoint gaps, recommend targeted projects, and build structured, daily actionable milestones.

---

## ✨ Key Features

- **👤 Smart Onboarding & Profiling:** Tailored profile creation based on current expertise, career interests, and goals.
- **🗺️ AI-Generated Roadmaps:** Personalized multi-phase milestone and career path planning.
- **🔍 Skill Gap Analysis:** Automated identification of missing competencies required for target roles.
- **🚀 Targeted Project Recommendations:** Tailored practical projects to build real-world experience.
- **📈 Progress & Task Tracking:** Interactive dashboard for monitoring milestones and daily goals.
- **💬 Interactive AI Guidance Agent:** Built-in chat assistant for real-time mentorship and advice.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS

### **Backend**
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) & bcrypt encryption

### **AI & Services**
- **AI Engine:** Groq SDK (LLM Integration)
- **Deployment:** Vercel

---

## ⚡ Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) account or local instance
- [Groq API Key](https://groq.com/)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/ai-career-roadmap-agent.git](https://github.com/your-username/ai-career-roadmap-agent.git)
cd ai-career-roadmap-agent
2. Backend Setup
Bash
cd backend
npm install
Create a .env file in the backend directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
Start the backend server:

Bash
npm run dev
3. Frontend Setup
Bash
cd ../frontend
npm install
Create a .env file in the frontend directory:

Code snippet
VITE_BACKEND_URL=http://localhost:5000
Start the frontend development server:

Bash
npm run dev
📜 License
This project is open-source and available under the MIT License.
