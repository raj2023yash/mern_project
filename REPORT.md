# Assignment 4 Report: Containerization, Cloud Deployment, and CI/CD Automation of a MERN Stack Blog Application

**Course:** Web Application Projects with React (CSE 3395)  
**Program:** B.Tech CSIT – 5th Semester  
**Academic Year:** 2026–2027  
**Student Name:** Yash Raj Panda  
**GitHub Profile:** [@raj2023yash](https://github.com/raj2023yash)  

---

## 1. Executive Summary & Architecture Overview

Modern full-stack web applications demand reproducible environments, scalable cloud infrastructure, and automated testing and delivery pipelines. This assignment implements a production-ready **MERN Stack Blog Application** integrated with **TanStack Query** for client-side state caching and data synchronization.

The application is containerized with **Docker**, orchestrated locally using **Docker Compose**, and automated through **GitHub Actions** for Continuous Integration (CI) and Continuous Delivery/Deployment (CD) to **Google Cloud Run** with **MongoDB Atlas** as the managed cloud database.

### Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                                   GitHub Repository                               |
|                  (Source Code, GitHub Actions Workflows, Secrets)                 |
+-----------------------------------------+-----------------------------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
             [ CI Workflow: Push/PR ]                [ CD Workflow: Merge/Push ]
             - Dependency caching                    - Multi-stage Docker Builds
             - ESLint Code Quality                   - Push to Docker Hub
             - Backend Integration Tests             - Authenticate with GCP
                                                     - Deploy to Google Cloud Run
                                                              |
                                                              v
+-------------------------------------------------------------+---------------------+
|                               Cloud Production Environment                        |
|                                                                                   |
|   +--------------------------+           +------------------------------------+   |
|   | Google Cloud Run         |           | Google Cloud Run                   |   |
|   | Frontend (Nginx + React) | --------> | Backend (Node.js Express REST API) |   |
|   +--------------------------+           +-----------------+------------------+   |
|                                                            |                      |
|                                                            v                      |
|                                          +------------------------------------+   |
|                                          | MongoDB Atlas Cluster              |   |
|                                          +------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Source Code Implementation

### 2.1 Backend Architecture (Node.js & Express.js)
The backend provides a RESTful API with modular separation of concerns:
- **`src/models/Post.js`**: Mongoose schema supporting `title`, `content`, `author`, `category`, `tags`, `coverImage`, `likes`, and automatic timestamps (`createdAt`, `updatedAt`).
- **`src/controllers/postController.js`**: Implements asynchronous operations:
  - `getAllPosts`: Search by text and category filtering, descending date sorting.
  - `getPostById`: Fetches individual post details.
  - `createPost`: Validates input and persists new blog articles.
  - `updatePost` & `deletePost`: Modifies or removes existing posts.
  - `likePost`: Atomic `$inc` updates for post engagement.
- **`src/app.js`**: Configures CORS, JSON parsing, logging, and an active `/api/health` probe used by container health checks and cloud orchestrators.
- **`tests/post.test.js`**: Automated integration test suite validating REST endpoints using Jest and Supertest.

### 2.2 Frontend Architecture (React.js & TanStack Query)
The frontend is constructed using React 18 and Vite:
- **TanStack Query (`@tanstack/react-query`)**:
  - Replaces manual `useEffect` fetching with declarative caching, automatic background refetching, and query invalidation.
  - Mutating queries (`likeMutation`, `createMutation`, `deleteMutation`) automatically revalidate and update the UI seamlessly.
- **UI Components**:
  - `Navbar.jsx`: Live backend health indicator (`API: Online`), branding, and post creation trigger.
  - `PostCard.jsx`: Glassmorphic card design displaying post cover, tags, author, date, and interactive like/delete actions.
  - `CreatePostModal.jsx`: Modal form with input validation and instant cache invalidation upon post creation.
  - `PostDetailModal.jsx`: Full-screen reading overlay.
  - `App.jsx`: Search filtering and category tabs.

---

## 3. Docker Containerization

### 3.1 Backend Dockerfile (`backend/Dockerfile`)
The backend uses a Node.js 20 Alpine Linux base image:
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "src/server.js"]
```
- **Rationale:** Minimal Alpine footprint reduces image size to under 150MB, minimizes attack surface, and leverages Docker layer caching for `npm ci`.

### 3.2 Frontend Dockerfile (`frontend/Dockerfile`)
A multi-stage build pattern separates build-time tooling from the runtime server:
```dockerfile
# Stage 1: Build static assets
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
- **Rationale:** The build environment contains Node.js, Vite, and development dependencies. The final production image only includes Nginx and static compiled files, reducing image size to ~25MB.

### 3.3 `.dockerignore` Configuration
Prevents `node_modules`, test files, `.git`, local secrets (`.env`), and markdown docs from bloating the Docker build context.

---

## 4. Multi-Container Orchestration with Docker Compose

The `docker-compose.yml` orchestrates three isolated services in a shared bridge network (`blog-network`):
1. **`mongo`**: Official MongoDB 7.0 image with persistent volume `mongo-data` and healthcheck (`mongosh ping`).
2. **`backend`**: Depends on `mongo` with `condition: service_healthy`, connecting via `mongodb://mongo:27017/blogdb`. Exposes port `5000:5000`.
3. **`frontend`**: Built with the backend URL argument, exposing port `3000:80`. Depends on the `backend` service.

### Launching Services via Docker Compose:
```bash
docker compose up --build -d
docker compose ps
docker compose logs -f
```

---

## 5. Cloud Deployment & Secrets Configuration

### 5.1 MongoDB Atlas Setup
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write permissions.
3. Configure Network Access: whitelist `0.0.0.0/0` (or Cloud Run IP range).
4. Obtain connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogdb?retryWrites=true&w=majority`

### 5.2 Google Cloud Run Deployment
- Backend and frontend are deployed as serverless containers on **Google Cloud Run**.
- Google Cloud Run automatically provisions HTTPS URLs, handles auto-scaling to zero, and injects the `PORT` environment variable.

---

## 6. Continuous Integration & Continuous Delivery (CI/CD)

### 6.1 Continuous Integration (`.github/workflows/ci.yml`)
- Triggered automatically on `push` or `pull_request` to `main` branch.
- **Backend Job**: Lints codebase with ESLint, runs automated Jest integration tests against an in-memory database.
- **Frontend Job**: Lints React JSX components, executes production Vite build.

### 6.2 Continuous Delivery (`.github/workflows/cd.yml`)
- Automatically triggered on push/merge to `main`.
- Authenticates with Docker Hub using repository secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
- Builds and tags Docker images for both backend and frontend.
- Pushes images to Docker Hub.
- Authenticates with Google Cloud using a Service Account Key (`GCP_SA_KEY`).
- Deploys latest images to Google Cloud Run services.

### 6.3 Required GitHub Secrets
Under **Settings -> Secrets and variables -> Actions**, add:
- `DOCKERHUB_USERNAME`: Docker Hub username.
- `DOCKERHUB_TOKEN`: Docker Hub Personal Access Token.
- `GCP_PROJECT_ID`: Google Cloud Project ID.
- `GCP_SA_KEY`: Google Cloud Service Account JSON key.
- `MONGO_URI`: MongoDB Atlas connection URI.
- `VITE_API_BASE_URL`: Cloud Run URL of the backend API (e.g., `https://blog-backend-xxx.run.app/api`).

---

## 7. Demonstration Guide & Oral Defense Preparation

When presenting this assignment to the evaluator, explain the role of each technology:

1. **Role of Docker:**
   *Eliminates the "works on my machine" problem.* Packages code, runtime, system tools, and libraries into immutable container images that execute consistently in local development, CI testing, and cloud production.
2. **Role of Docker Compose:**
   *Declarative multi-container orchestration for development.* Starts MongoDB, the Express backend, and the React frontend with a single command (`docker compose up`), managing container networking, health-check dependencies, and volume data persistence.
3. **Role of Docker Hub:**
   *Centralized container image registry.* Serves as the intermediate release artifact repository where CI builds push verified container images and cloud providers pull them for deployment.
4. **Role of GitHub Actions:**
   *Automation engine for CI/CD.* Runs automated linting and test suites on every pull request to ensure high code quality, and automatically builds, tests, pushes, and deploys changes on branch merges without manual intervention.
5. **Role of Google Cloud Run:**
   *Fully managed serverless container runtime.* Automatically runs stateless containers behind a global load balancer, provisioning HTTPS certificates and scaling down to zero instances when idle to conserve cloud costs.

---

## 8. Challenges Encountered & Resolutions

| Challenge Encountered | Root Cause | Engineering Solution |
| :--- | :--- | :--- |
| **Cross-Origin Resource Sharing (CORS)** | Frontend running on port 3000 calling backend on port 5000 in browser | Enabled `cors()` middleware in Express with preflight headers support. |
| **Vite Single Page App 404 on Refresh** | Nginx in Docker container looking for physical directory paths matching route URLs | Configured Nginx `try_files $uri $uri/ /index.html;` in `nginx.conf`. |
| **Race Condition on Compose Startup** | Backend attempted connecting to MongoDB before the database daemon was listening | Added Docker Compose `healthcheck` on MongoDB and set `depends_on: { mongo: { condition: service_healthy } }`. |
| **Dynamic Cloud Run Port Assignment** | Cloud Run dynamically assigns a random port through `$PORT` env variable | Configured backend server to read `process.env.PORT \|\| 5000` and pass it to Express `app.listen()`. |
| **Optimistic React UI State** | Client state becoming stale after adding or liking a post | Utilized TanStack Query's `useMutation` hooks with automatic `queryClient.invalidateQueries` upon success. |

---

## 9. Submission Checklist

- [x] Complete MERN stack source code with TanStack Query integration.
- [x] Backend and frontend `Dockerfile` and `.dockerignore` files.
- [x] Multi-service `docker-compose.yml` configuration.
- [x] GitHub repository setup with Git version control.
- [x] Docker Hub image build & push configuration.
- [x] Google Cloud Run deployment workflow.
- [x] GitHub Actions CI workflow (`ci.yml`) and CD workflow (`cd.yml`).
- [x] Comprehensive demonstration guide and report.
