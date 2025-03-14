# Notes App Backend

## Overview
This is the backend service for a Notes-taking application built using **Node.js, Express, PostgreSQL**, and **Sequelize ORM**. The backend provides **user authentication (JWT-based)** and **CRUD operations** for managing notes.

## Features
- **User Registration & Authentication** (bcrypt for password hashing, JWT for authentication)
- **PostgreSQL Database** using Sequelize ORM
- **REST API** for CRUD operations on notes
- **CORS support** for frontend integration
- **Environment Variables** for configuration management

## Technologies Used
- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **Sequelize** (ORM for PostgreSQL)
- **bcryptjs** (Password hashing)
- **jsonwebtoken (JWT)** (Authentication)
- **dotenv** (Environment variable management)
- **CORS** (Cross-Origin Resource Sharing)

## Installation
### Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [PostgreSQL](https://www.postgresql.org/)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd notes-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure database and JWT secrets:
   ```env
   PORT=5000
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```
4. Run database migrations:
   ```sh
   node index.js
   ```
5. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- **POST /register** → Register a new user
- **POST /login** → Authenticate and return JWT token

### Notes Management
- **GET /notes** → Fetch all notes
- **POST /notes** → Create a new note

## Usage
Use **Postman** or **cURL** to test API endpoints:
```sh
curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"user_name":"John Doe", "user_email":"john@example.com", "password":"secure123"}'
```

## Deployment
To deploy on **Heroku** or **Vercel**, configure environment variables accordingly and ensure PostgreSQL is set up in production.

## License
This project is **MIT Licensed**.

