# KoinX API and Frontend

## Overview

This project consists of a Node.js backend and a React frontend. The backend provides APIs for uploading and fetching cryptocurrency trade data, while the frontend allows users to interact with these APIs and test functionalities.

## Backend

### Overview

The backend is built with Node.js, Express, and MongoDB. It includes the following features:
- **Upload CSV File:** Uploads a CSV file to GridFS and parses the data.
- **Fetch All Trades:** Retrieves all trade data from the database.
- **Get Asset Balance:** Provides asset-wise balance at a specific timestamp.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/koinx-api.git
   cd koinx-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

### API Endpoints

- **POST /upload**
  - Uploads a CSV file to GridFS and parses it.
  - **Request:** `multipart/form-data` with a file field named `file`.
  - **Response:** Success or error message.

- **GET /all**
  - Retrieves all trades from the database.
  - **Response:** JSON array of trades.

- **GET /balance**
  - Retrieves asset-wise balance at a specific timestamp.
  - **Query Parameters:** `timestamp` in `YYYY-MM-DDTHH:MM:SSZ` format.
  - **Response:** JSON object with asset balances.

### Deployment

Deploy the backend to Vercel by connecting your GitHub repository to Vercel and following the Vercel deployment process.

## Frontend

### Overview

The frontend is built with React and styled using Tailwind CSS. It provides interfaces for testing the backend APIs.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/koinx-frontend.git
   cd koinx-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   REACT_APP_SERVER=https://koinx-api-backend.vercel.app/
   ```

4. **Start the Development Server**

   ```bash
   npm start
   ```

### Features

- **Fetch All Trades:** Displays a list of all trades from the backend.
- **Get Asset Balance:** Fetches the asset-wise balance at a specified timestamp.
- **Upload CSV File:** Allows uploading a CSV file to the backend.

### Deployment

Frontend API Tested -  https://koinx-api-frontend.vercel.app/
Bakcend - https://koinx-api-backend.vercel.app/

