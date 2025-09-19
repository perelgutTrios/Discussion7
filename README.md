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


## Like/Dislike Feature (feature/like-dislike branch)

### Overview
This branch adds a like/dislike feature for both subjects and comments. Users can upvote (like) or downvote (dislike) any subject or comment. Each item displays a count and colored Bootstrap arrow buttons, with toggling logic to ensure only one can be active at a time per user.

### Data Schema Changes
- **Subject model (`server/models/Subject.js`):**
  - Added `likes` and `dislikes` fields (arrays of user ObjectIds).
- **Comment model (`server/models/Comment.js`):**
  - Added `likes` and `dislikes` fields (arrays of user ObjectIds).

### Database Migration
- A script (`server/initLikesDislikes.js`) was created and run to initialize all existing subjects and comments with empty `likes` and `dislikes` arrays, ensuring a count of 0 for all items in old databases.

### Backend API Changes
- **Endpoints added:**
  - `POST /api/subjects/:id/like` — Like/dislike a subject. Expects `{ action: 'like' | 'dislike' | null }` in the body.
  - `POST /api/comments/:id/like` — Like/dislike a comment. Expects `{ action: 'like' | 'dislike' | null }` in the body.
- **Files changed:**
  - `server/routes/subjects.js` (new endpoint, logic for toggling likes/dislikes)
  - `server/routes/comments.js` (new endpoint, logic for toggling likes/dislikes)

### Frontend UI Changes
- **Subject list and detail pages:**
  - Added up/down arrow buttons (Bootstrap Icons) for like/dislike, with outlined/solid states and color coding.
  - Count is displayed between the buttons.
  - Buttons toggle state and update count immediately on click.
- **Comment list in subject detail:**
  - Each comment now has like/dislike buttons and a count, with the same toggling logic as subjects.
- **Files changed:**
  - `client/src/pages/SubjectListPage.js` (UI, logic for subject like/dislike)
  - `client/src/pages/SubjectListPage.css` (custom button styles)
  - `client/src/pages/SubjectDetailPage.js` (UI, logic for subject and comment like/dislike)
  - `client/src/api/subjects.js` (API utility for like/dislike)
  - `client/src/api/comments.js` (API utility for like/dislike)

### Usage
- Users must be logged in to like or dislike.
- Clicking an outlined up arrow turns it solid green and increments the count; clicking again removes the like.
- Clicking an outlined down arrow turns it solid red and decrements the count; clicking again removes the dislike.
- Switching from like to dislike (or vice versa) updates the state and count accordingly.

---

---

## Additional Notes
- Ensure MongoDB is running and accessible from your environment.
- The `.env` file is required for backend configuration and should not be committed to version control.
- For production deployment, configure environment variables and security settings appropriately.

---

## License
This project is for educational purposes. Modify and use as needed.
