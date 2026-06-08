# Smart Health Wristband Dashboard

Real-time health monitoring dashboard for a smart wristband — 
built with Node.js, MongoDB, ThingSpeak, and Socket.io.

## What it does

Collects real-time health data from a smart wristband and 
displays it on a live dashboard. All data synced to cloud 
and updated in real time without page refresh.

## Sensors Monitored

| Metric | Sensor |
|--------|--------|
| Heart Rate | Pulse sensor |
| SpO2 | MAX30100/MAX30102 |
| Temperature | DS18B20 / MLX90614 |
| Steps | Accelerometer |

## Software Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| IoT Data | ThingSpeak API |
| Realtime | Socket.io |
| Frontend | HTML/CSS/JavaScript |

## How It Works

Wristband sensors collect health data continuously
Data sent to ThingSpeak IoT platform
Node.js backend fetches from ThingSpeak
Data stored in MongoDB Atlas
Socket.io pushes updates to dashboard in real time
Dashboard displays live graphs and current readings

## Features

- Real-time data updates via Socket.io
- Historical data storage in MongoDB Atlas
- ThingSpeak IoT integration
- Heart rate, SpO2, temperature, steps monitoring
- No page refresh needed — live dashboard
- REST API for data access

## Architecture

Wristband Hardware
        ↓
ThingSpeak IoT Platform
        ↓
Node.js + Express Backend
        ↓
MongoDB Atlas Database
        ↓
Socket.io Real-time Updates
        ↓
Live Web Dashboard

## Tech Stack

Node.js · Express · MongoDB Atlas · ThingSpeak · Socket.io · JavaScript

## Part of

Building toward a complete Edge AI health monitoring system —
edge inference on wristband, cloud dashboard for analytics.

EDGE-AI repo: github.com/saumyajichkar21-a11y/EDGE-AI
