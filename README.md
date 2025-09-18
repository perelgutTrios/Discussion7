# Discussion7

A full-featured discussion board web application with user registration, login, subject creation, and commenting. Built with a React frontend and Node.js/Express backend, using MongoDB for data storage.

---

## Project Structure

```
Discussion7/
│
├── client/           # React frontend
│   ├── public/       # Static assets
│   └── src/          # React components, pages, and API utilities
│
├── server/           # Node.js/Express backend
│   ├── models/       # Mongoose models (User, Subject, Comment)
│   └── routes/       # Express routes (auth, subjects, comments)
│
├── .gitignore        # Git ignore rules
├── package.json      # Project-level dependencies and scripts
├── discussion7_chat_log.md  # Chat log of project creation
└── README.md         # This file
```

---

## Dependencies

### Frontend (client)
- React
- react-router-dom
- Bootstrap
- axios

### Backend (server)
- Node.js
- Express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors

---

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/<your-username>/Discussion7.git
cd Discussion7
```

### 2. Install Dependencies

#### Backend
```
cd server
npm install
```

#### Frontend
```
cd ../client
npm install
```

### 3. Configure Environment Variables

- In `server/`, create a `.env` file with:
  ```
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

### 4. Run the Application

#### Start Backend
```
cd server
npm start
```

#### Start Frontend
```
cd ../client
npm start
```

- The frontend will run on `http://localhost:3000` by default.
- The backend API will run on `http://localhost:5000` by default.

---

## Features
- User registration and login with validation
- Secure password hashing and JWT authentication
- Create, view, and comment on discussion subjects
- Responsive UI with Bootstrap
- Full code documentation and chat log included

---

## Additional Notes
- Ensure MongoDB is running and accessible from your environment.
- The `.env` file is required for backend configuration and should not be committed to version control.
- For production deployment, configure environment variables and security settings appropriately.

---

## License
This project is for educational purposes. Modify and use as needed.
