# Smart Three-Phase Power Distribution Fault Reporting and Monitoring System

Full-stack web application built with AngularJS (frontend), Node.js/Express (backend), and MongoDB.

## Features

- Home
- About
- Live Power Status
- Report Fault (with location, image URL, severity)
- Track Complaint (register + track by complaint ID)
- Pay Bill
- Dashboard
- Notifications
- Contact Us
- Admin Login
- Responsive UI for mobile, tablet, and desktop

## Project Structure

- `client/` AngularJS + HTML + CSS app
- `server/` Node.js + Express + MongoDB API

## Setup Instructions

### 1) Backend Setup

1. Go to backend:
   - `cd server`
2. Install packages:
   - `npm install`
3. Create environment file:
   - Copy `.env.example` to `.env`
4. Start backend server:
   - `npm run dev`

### 2) Seed Initial Data (one-time)

Use Postman/Thunder Client or browser API tools:

- `POST http://localhost:5000/api/power/seed`
- `POST http://localhost:5000/api/bills/seed`
- `POST http://localhost:5000/api/notifications/seed`
- `POST http://localhost:5000/api/auth/seed-admin`

### 3) Frontend Setup

Since this is a static AngularJS app, run with any local static server:

1. Open new terminal:
   - `cd client`
2. Start a simple local server (example):
   - `npx http-server -p 8080`
3. Open:
   - `http://localhost:8080`

## Default Admin

- Email: `admin@powerboard.com`
- Password: `admin123`
