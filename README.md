# genai_task_management
Task Management with genAI

# My Project

This project is a full-stack application with both front-end and back-end components contained within a single repository. The project allows users to interact with a web interface (front-end) and performs backend operations (server-side API).

## Folder Structure

- `/backend`: Contains all server-side logic and API endpoints.
- `/frontend`: Contains all client-side React (or other front-end framework) code.

## Installation

### Prerequisites

- Node.js and npm/yarn installed
- Python and pip installed

### Backend Setup

1. Navigate to the `/backend` directory:
   ```bash
   cd backend/src
   pip install requirement.txt
   uvicorn main:app --reload

2. Navigate to the `/frontend` directory:
    ```bash
    cd frontend
    npm install
    update the rest api endpoint in config.js. example: http://localhost:8000
    npm start
