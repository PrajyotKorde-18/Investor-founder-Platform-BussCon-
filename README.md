# 🚀 BussCon: Founder-Investor & Operations Analytics Platform

**🌟 Live Demo:** [View the Platform Here](https://busscon-app.vercel.app)

Welcome to **BussCon**, a full-stack web platform designed to seamlessly connect ambitious founders with strategic investors while also providing powerful operations analytics.

This project is now a **full-stack architecture** consisting of a robust **Java Spring Boot backend** with built-in Thymeleaf templating and an **interactive React (Vite) frontend**.

---

## 📖 Overview
BussCon acts as a bridge and a dashboard. For founders, it's a place to submit innovative ideas, receive uniqueness checks, and find the right investors. For investors, it offers a streamlined pipeline to discover, evaluate, and connect with promising startups. It also includes comprehensive analytics and reporting tools to support operational excellence.

---

## ✨ Key Features

### 💻 Frontend (React & CSS)
* **Interactive Dashboards:** Stunning modern charts, metrics, and micro-interactions for both founders and investors.
* **Founder Financials Hub:** Track funding requirements, monthly runway, cash burn, and project future financials dynamically.
* **Investor Pipeline:** Visual, interactive deal flow board with drag-and-drop capabilities to move startups through stages (Discovery, Diligence, Proposal, Funded).
* **Smart Matching:** Discovery interface to search and filter startup ideas by industry, funding requirements, and uniqueness scores.

### ⚙️ Backend (Spring Boot & JPA)
* **Idea Management REST API:** Robust CRUD controllers for startup idea submissions, complete with category classification and uniqueness rating calculation.
* **Deal Flow Pipeline API:** Backend endpoints for adding notes, tracking pipeline milestones, updating stages, and recording interactive touchpoints.
* **Investment Automation:** Rules engine enabling auto-approval, automatic notification alerts, or automated pipeline updates when deals match specified criteria.
* **Operational Analytics & Analytics REST API:** Real-time data aggregation to serve total statistics (e.g., funding amounts, top sectors, monthly sign-ups, engagement ratios).
* **Multi-View Thymeleaf Interface:** Integrated server-side templating supporting standard web requests.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Core** | Java 22, Spring Boot 3.3.0 |
| **Database & Persistence** | Spring Data JPA, H2 Database (In-Memory) |
| **Server-Side UI** | Thymeleaf, HTML5, CSS3 |
| **Frontend UI** | React (Vite), Modern CSS Grid & Flexbox, Lucide React (Icons) |
| **APIs** | RESTful Web Services, JSON, CORS-Enabled Configurations |
| **Build Tools** | Maven, npm / Vite |

---

## 📂 Directory Structure

```bash
Investor-founder-Platform-BussCon-/
├── .mvn/                     # Maven Wrapper directory
├── mvnw / mvnw.cmd           # Maven Wrapper executable scripts
├── pom.xml                   # Root Maven configuration (dependencies & plugins)
├── src/                      # Java Spring Boot backend source code
│   ├── main/
│   │   ├── java/com/busscon/ # Backend Controller, Model, Repository & Config files
│   │   └── resources/
│   │       ├── templates/    # Server-Side Thymeleaf template pages
│   │       └── static/       # Static assets (custom CSS, JS, Images)
│   └── test/                 # JUnit & MockMvc automated tests
│
└── busscon-app/              # React frontend workspace (Vite)
    ├── src/                  # React components, pages, utils, and assets
    ├── package.json          # Node dependencies & scripts
    └── vite.config.ts        # Vite compilation & proxy config
```

---

## 🚀 Getting Started Locally

To run the full-stack system locally, you can spin up the Spring Boot backend and the React frontend concurrently.

### 1️⃣ Prerequisite
Make sure you have **Java 22 (or higher)** and **Node.js (v18+ recommended)** installed on your machine.

---

### 2️⃣ Run the Spring Boot Backend

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrajyotKorde-18/Investor-founder-Platform-BussCon-.git
   cd Investor-founder-Platform-BussCon-
   ```
2. **Build and start the Spring Boot app:**
   * **On Windows (Command Prompt/PowerShell):**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   * **On macOS/Linux:**
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
3. The server will launch at: `http://localhost:8080`
   * **H2 Database Console:** Access the in-memory database at `http://localhost:8080/h2-console`
     * **JDBC URL:** `jdbc:h2:mem:busscondb`
     * **Username:** `sa`
     * **Password:** *leave blank*

---

### 3️⃣ Run the React Frontend

1. **Navigate to the frontend directory:**
   ```bash
   cd busscon-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. The frontend will launch at: `http://localhost:5173` (Vite config is pre-configured to proxy API requests to `http://localhost:8080`).

---

## 🌐 Deployment
This project is live! You can view the platform here: [BussCon Live App](https://busscon-app.vercel.app) (Hosted on Vercel).

