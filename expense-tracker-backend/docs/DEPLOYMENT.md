# 🚀 Deployment Guide

This guide outlines how to deploy the Expense Tracker application, including the FastAPI backend, React frontend, and PostgreSQL database. We'll cover both local development with Docker Compose and considerations for production environments.

## Table of Contents

1.  [Overview](#1-overview)
2.  [Prerequisites](#2-prerequisites)
3.  [PostgreSQL Database Deployment](#3-postgresql-database-deployment)
4.  [FastAPI Backend Deployment](#4-fastapi-backend-deployment)
5.  [React Frontend Deployment](#5-react-frontend-deployment)
6.  [Connecting Components](#6-connecting-components)
7.  [Production Best Practices](#7-production-best-practices)

## 1. Overview

The Expense Tracker is a full-stack application consisting of:

-   **Backend**: FastAPI (Python) - Serves the API endpoints and interacts with the database.
-   **Frontend**: React (JavaScript) - A single-page application that consumes the backend API.
-   **Database**: PostgreSQL - Stores all application data.

For local development, we use Docker Compose to manage all three components. For production, you might consider various cloud hosting options.

## 2. Prerequisites

-   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (for local deployment and containerization)
-   [Python 3.8+](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installation/) (for backend development/local testing)
-   [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) (for frontend development/local testing)
-   Familiarity with environment variables and basic shell commands.

## 3. PostgreSQL Database Deployment

### Local Development (Docker Compose)

The easiest way to run PostgreSQL locally is using the provided `docker-compose.yml` file in the `expense-tracker-backend/` directory.

```bash
cd expense-tracker-backend
docker-compose up -d postgres
```

This will start a PostgreSQL container named `expense_tracker_db` on port `5432`. The database name, user, and password are defined in `docker-compose.yml` and can be overridden via environment variables or directly in the file.

After starting the database, you'll need to run migrations to create the necessary tables:

```bash
make init-db
```

### Production Considerations

For production, it's highly recommended to use a managed PostgreSQL service from a cloud provider (e.g., AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL). This offloads database management, backups, and scaling.

-   **Connection String**: Ensure your `DATABASE_URL` environment variable is correctly configured to point to your managed database.
-   **Security**: Implement strong passwords, network isolation, and encryption.
-   **Backups**: Configure automated backups.
-   **Monitoring**: Set up monitoring and alerting for database performance and health.

## 4. FastAPI Backend Deployment

### Local Development (Python/Uvicorn)

For local development, you can run the FastAPI application directly with Uvicorn:

```bash
cd expense-tracker-backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Deployment (Gunicorn + Uvicorn Workers)

For production, Uvicorn should be run with a production-ready WSGI server like Gunicorn to handle multiple worker processes and better concurrency.

1.  **Install Gunicorn**: Add `gunicorn` to your `requirements.txt` and install it.

    ```bash
    pip install gunicorn
    ```

2.  **Run with Gunicorn**: Use a command similar to this (adjust `--workers` based on your server's CPU cores, typically `2 * CPU_CORES + 1`):

    ```bash
    gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
    ```

### Containerization (Docker)

Creating a `Dockerfile` for your backend allows for consistent deployment across different environments.

**Example `Dockerfile` for Backend (in `expense-tracker-backend/`):**

```dockerfile
# Use a lightweight Python image
FROM python:3.9-slim-buster

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Command to run the application with Gunicorn
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

To build and run this Docker image:

```bash
docker build -t expense-tracker-backend .
docker run -p 8000:8000 --env-file .env expense-tracker-backend
```

### Environment Variables

Ensure all necessary environment variables (e.g., `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`) are set in your production environment. Use a `.env` file for local development and your deployment platform's secrets management for production.

## 5. React Frontend Deployment

### Local Development (Vite)

For local development, you can run the React application with Vite's development server:

```bash
cd expense-tracker-frontend
npm install
npm run dev
```

### Production Build

To prepare your React application for production, you need to build it. This generates optimized static HTML, CSS, and JavaScript files.

```bash
cd expense-tracker-frontend
npm install
npm run build
```

This will create a `dist` folder containing the static assets.

### Serving Static Files (Nginx/Cloud Storage)

In production, these static files are typically served by a web server (like Nginx) or a cloud storage service (like AWS S3, Google Cloud Storage, Azure Blob Storage) with a CDN.

**Example Nginx configuration (e.g., `/etc/nginx/sites-available/expense-tracker`):**

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    root /var/www/expense-tracker-frontend/dist; # Path to your frontend build directory
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html; # For React routing
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://localhost:8000; # Or your backend service URL
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Containerization (Docker)

You can also containerize your frontend application. This `Dockerfile` often uses a multi-stage build to first build the React app and then serve it with a lightweight Nginx server.

**Example `Dockerfile` for Frontend (in `expense-tracker-frontend/`):**

```dockerfile
# Stage 1: Build the React application
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default Nginx config and add custom one (see example above)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

To build and run this Docker image:

```bash
docker build -t expense-tracker-frontend .
docker run -p 80:80 expense-tracker-frontend
```

## 6. Connecting Components

When deploying, especially with Docker, it's crucial for your components to find each other.

-   **Backend to Database**: The `DATABASE_URL` environment variable in your backend needs to point to your PostgreSQL instance. If using Docker Compose, service names can be used (e.g., `postgresql://user:password@postgres:5432/dbname`). For cloud, use the provided connection string.

-   **Frontend to Backend**: The frontend needs to know the URL of your backend API. This is usually configured in the frontend's environment variables (e.g., `VITE_API_URL` for Vite). If you're using Nginx to proxy API requests, the frontend can make requests to `/api/` which Nginx will then forward to the backend.

-   **CORS**: Ensure your FastAPI backend's `ALLOWED_ORIGINS` are correctly configured to include the domain(s) where your frontend is hosted.

## 7. Production Best Practices

-   **Environment Variables**: Never hardcode sensitive information. Use environment variables and a secrets management system provided by your cloud provider.
-   **HTTPS**: Always deploy with HTTPS to encrypt traffic.
-   **Monitoring & Logging**: Implement robust monitoring and logging for both frontend and backend applications.
-   **CI/CD**: Set up Continuous Integration and Continuous Deployment pipelines to automate testing and deployment.
-   **Scaling**: Design your application to scale horizontally (running multiple instances of your backend/frontend) to handle increased load.
-   **Security**: Regularly update dependencies, perform security audits, and follow best practices for API security.
-   **Backup Strategy**: Implement a comprehensive backup strategy for your database.

This guide provides a solid foundation for deploying your Expense Tracker application. The specific tools and services might vary based on your chosen cloud provider (AWS, Google Cloud, Azure, Heroku, Vercel, Netlify, etc.).
