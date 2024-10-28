# Internship_Apply

OTP Verification System
This OTP Verification System is built as part of a solution for an internship project, implementing a secure OTP (One-Time Password) system with JWT token-based session management. The goal of the project is to create a reliable and user-friendly interface for generating and verifying OTPs, ensuring robust authentication and security standards.

Key Features

(1)OTP Generation and Verification:
Users can generate a secure 4-digit OTP that expires after a set period, enhancing security. The OTP can only be verified once per session and is stored securely in a hashed form.

(2)Session Management with JWT Authentication:
Each user session is authenticated with a JWT token, enabling secure, stateless authentication. This helps in managing user sessions effectively.

(3)Rate Limiting and Attempt Tracking: The system tracks the number of OTP verification attempts, restricting multiple incorrect attempts for added security.

(4)Data Management and Display: The dashboard shows session information such as attempts, OTP generation times, and status. Data of the session is stored in the mongo db.

Tech Stack =>
Frontend: React, Tailwind CSS
Backend: Node.js, Express, JSON Web Token (JWT) for authentication
Database: Mongodb

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
```

### Step 2: Install Dependencies

1. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

2. **Backend Setup**

   ```bash
   cd ../backend
   npm install
   ```

### Step 3: Configure Environment Variables

1. In the `backend` folder, create a `.env` file and add the following variables:

   ```plaintext
   JWT_SECRET=your_secret_key
   PORT=your_port
   MONGO_URI=your_mongo_uri
   ```

### Step 4: Run the Application

1. Open **two terminals** to run the frontend and backend concurrently.

2. In the first terminal, navigate to the `frontend` folder and start the frontend:

   ```bash
   npm run dev
   ```

3. In the second terminal, navigate to the `backend` folder and start the backend:

   ```bash
   npm run dev
   ```

The application should now be up and running on the specified ports. Open your browser and go to `http://localhost:<frontend-port>` to access the OTP verification system.
