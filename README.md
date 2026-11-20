# 🚀 MERN Stack Blog Application (Containerized with CI/CD)

> **Course:** Web Application Projects with React (CSE 3395)  
> **Topic:** Containerization, Cloud Deployment and CI/CD Automation of a MERN Stack Blog Application  
> **Academic Year:** 2026–2027 &bull; B.Tech CSIT – 5th Semester  
> **Student:** Yash Raj Panda ([@raj2023yash](https://github.com/raj2023yash))

---

## 📖 Table of Contents
1. [Overview & Features](#-overview--features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [How to Launch the Website](#-how-to-launch-the-website)
   - [Method 1: Using Docker Compose (Recommended)](#method-1-using-docker-compose-recommended)
   - [Method 2: Running Locally Without Docker](#method-2-running-locally-without-docker)
5. [How to Push to GitHub](#-how-to-push-to-github)
6. [Cloud Deployment (Docker Hub & Google Cloud Run)](#-cloud-deployment-docker-hub--google-cloud-run)
7. [GitHub Actions CI/CD Automation](#-github-actions-cicd-automation)
8. [Demonstration Guide](#-demonstration-guide)

---

## 🌟 Overview & Features

A full-stack, production-ready MERN blog application that showcases:
- **TanStack Query (React Query):** Automatic server caching, background synchronization, optimistic updates, and instant query invalidation.
- **RESTful Node/Express Backend:** Complete CRUD endpoints, category filtering, search, and healthcheck `/api/health`.
- **Docker Containerization:** Optimized multi-stage Dockerfiles and `.dockerignore` for both frontend and backend.
- **Docker Compose:** One-command local orchestration of MongoDB, Express API, and React/Nginx frontend.
- **Continuous Integration (CI):** Automated linting and backend unit/integration testing on push and PR.
- **Continuous Delivery (CD):** Automated Docker image build, push to Docker Hub, and serverless deployment to Google Cloud Run.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, TanStack Query v5, Lucide Icons, Nginx
- **Backend:** Node.js, Express.js, Mongoose, Jest, Supertest
- **Database:** MongoDB 7.0 / MongoDB Atlas
- **DevOps & Cloud:** Docker, Docker Compose, Docker Hub, Google Cloud Run, GitHub Actions

---

## 📁 Project Structure

```text
mern-blog-app/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: Linting & Automated Tests for frontend & backend
│       └── cd.yml              # CD: Build, Push to Docker Hub & Deploy to Cloud Run
├── backend/
│   ├── src/
│   │   ├── controllers/        # REST API controllers
│   │   ├── models/             # Mongoose Post model
│   │   ├── routes/             # Express API routes
│   │   ├── app.js              # Express app & middlewares
│   │   └── server.js           # Server entry point & DB connection
│   ├── tests/                  # Automated Jest & Supertest integration tests
│   ├── .dockerignore           # Exclusions for backend Docker build
│   ├── Dockerfile              # Backend Alpine container
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                # TanStack Query API client & mutations
│   │   ├── components/         # Navbar, PostCard, CreatePostModal, PostDetailModal
│   │   ├── App.jsx             # Main dashboard & filters
│   │   ├── main.jsx            # QueryClientProvider setup
│   │   └── index.css           # Modern responsive design
│   ├── nginx.conf              # SPA routing & compression configuration
│   ├── .dockerignore           # Exclusions for frontend Docker build
│   ├── Dockerfile              # Multi-stage build (Vite -> Nginx Alpine)
│   ├── package.json
│   └── .env.example
├── docker-compose.yml          # Multi-container orchestration (Mongo, Backend, Frontend)
├── REPORT.md                   # Full academic report for Assignment 4
├── README.md                   # Setup and execution guide
└── .gitignore
```

---

## 🚀 How to Launch the Website

You can run the entire project in two ways:

### Method 1: Using Docker Compose (Recommended)

Make sure you have Docker Desktop running, then run:

```bash
# 1. Clone or navigate to the project directory
cd mern-blog-app

# 2. Build and start all 3 containers (MongoDB, Backend API, Frontend Nginx)
docker compose up --build -d

# 3. Verify running containers
docker compose ps
```

- **Frontend:** Open [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/posts](http://localhost:5000/api/posts)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **To stop containers:** `docker compose down`

---

### Method 2: Running Locally Without Docker

If Docker is not currently installed or running on your system, you can run the backend and frontend directly with Node.js:

#### Step 1: Start the Backend
```bash
cd backend
npm install
npm run test      # Run automated tests
npm start         # Starts backend on http://localhost:5000
```
*(Ensure a local MongoDB server is running or set `MONGO_URI` in `backend/.env` to a free MongoDB Atlas connection string).*

#### Step 2: Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📤 How to Push to GitHub

To push this codebase to your GitHub account:

### 1. Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Set the repository name to `mern-blog-app`.
3. Choose **Public** (required for assignment submission).
4. Do **not** initialize with a README, .gitignore, or license (we already created them).
5. Click **Create repository**.

### 2. Initialize and Push from Terminal
Run the following commands inside `C:\Users\Lenovo\.gemini\antigravity\scratch\mern-blog-app`:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: complete MERN blog application with Docker, Docker Compose, and CI/CD"

# Set branch to main
git branch -M main

# Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/raj2023yash/mern-blog-app.git

# Push the code to GitHub
git push -u origin main
```

---

## ☁️ Cloud Deployment (Docker Hub & Google Cloud Run)

### 1. Build and Push Images to Docker Hub
```bash
# Log in to Docker Hub
docker login

# Build & Push Backend Image
docker build -t <your-dockerhub-username>/mern-blog-backend:latest ./backend
docker push <your-dockerhub-username>/mern-blog-backend:latest

# Build & Push Frontend Image
docker build --build-arg VITE_API_BASE_URL=https://<your-backend-run-url>/api -t <your-dockerhub-username>/mern-blog-frontend:latest ./frontend
docker push <your-dockerhub-username>/mern-blog-frontend:latest
```

### 2. Deploy to Google Cloud Run
```bash
# Deploy Backend
gcloud run deploy mern-blog-backend \
  --image docker.io/<your-dockerhub-username>/mern-blog-backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars MONGO_URI="<your-mongodb-atlas-uri>",NODE_ENV="production"

# Deploy Frontend
gcloud run deploy mern-blog-frontend \
  --image docker.io/<your-dockerhub-username>/mern-blog-frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 80
```

---

## 🔄 GitHub Actions CI/CD Automation

Configure the following secrets in your GitHub repository (**Settings -> Secrets and variables -> Actions -> New repository secret**):

| Secret Name | Description |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | Your Docker Hub account username |
| `DOCKERHUB_TOKEN` | Your Docker Hub Personal Access Token |
| `GCP_PROJECT_ID` | Your Google Cloud project ID |
| `GCP_SA_KEY` | Your Google Cloud Service Account JSON key |
| `MONGO_URI` | MongoDB Atlas database connection string |
| `VITE_API_BASE_URL` | Deployed Cloud Run backend URL + `/api` |

Once configured, any push or pull request automatically executes linting, unit testing, Docker image creation, and automated Cloud Run deployment!

---

## 🎤 Demonstration Guide

When presenting for your evaluation:
1. **Docker:** Explain that `Dockerfile` packages the app and its dependencies into isolated containers, eliminating environmental discrepancies.
2. **Docker Compose:** Explain how `docker-compose.yml` launches MongoDB, Backend, and Frontend with a single command, managing networks, volumes, and service dependencies.
3. **TanStack Query:** Show that adding or liking a blog post triggers instant cache invalidation without requiring a page refresh.
4. **GitHub Actions:** Show the green checkmarks in the GitHub **Actions** tab demonstrating automated CI tests and CD deployment.
5. **Google Cloud Run:** Show the publicly accessible HTTPS URL running the containerized services in the cloud.
