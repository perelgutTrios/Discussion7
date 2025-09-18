# Control Flow Documentation for Discussion7

This document describes the flow of control in the Discussion7 application, starting from `App.js` and following each user path: registration, login, listing subjects, selecting a subject, adding a comment, and adding a subject. It also explains which files are involved and how data is managed via MongoDB.

---

## 1. Application Entry Point: `App.js`
- **File:** `client/src/App.js`
- **Role:** Sets up React Router routes and manages authentication state.
- **Main Routes:**
  - `/login` → `LoginPage.js`
  - `/register` → `RegisterPage.js`
  - `/subjects` → `SubjectListPage.js`
  - `/subjects/:id` → `SubjectDetailPage.js`
  - `/add-subject` → `AddSubjectPage.js`

---

## 2. Registration Flow
- **User Action:** Clicks 'Register' and fills out the form.
- **Frontend:**
  - `RegisterPage.js` handles form state, validation, and error display.
  - On submit, calls `registerUser` from `api/auth.js` (sends POST to `/api/auth/register`).
- **Backend:**
  - `server/routes/auth.js` (POST `/api/auth/register`) validates input, hashes password, and creates a new user in MongoDB via `models/User.js`.
- **MongoDB:**
  - User document is created in the `users` collection.
- **Result:**
  - On success, user is redirected to the login page.

---

## 3. Login Flow
- **User Action:** Enters credentials and submits login form.
- **Frontend:**
  - `LoginPage.js` manages form state and error display.
  - Calls `loginUser` from `api/auth.js` (POST to `/api/auth/login`).
- **Backend:**
  - `server/routes/auth.js` (POST `/api/auth/login`) verifies credentials, issues JWT on success.
- **MongoDB:**
  - User credentials are checked against the `users` collection.
- **Result:**
  - JWT is stored in localStorage; user is redirected to the subject list.

---

## 4. List Subjects
- **User Action:** Navigates to `/subjects` (after login).
- **Frontend:**
  - `SubjectListPage.js` fetches subjects via `getSubjects` from `api/subjects.js` (GET `/api/subjects`).
- **Backend:**
  - `server/routes/subjects.js` (GET `/api/subjects`) retrieves all subjects from MongoDB via `models/Subject.js`.
- **MongoDB:**
  - Subjects are read from the `subjects` collection.
- **Result:**
  - List of subjects is displayed.

---

## 5. Select a Subject (View Details & Comments)
- **User Action:** Clicks a subject from the list.
- **Frontend:**
  - `SubjectDetailPage.js` fetches subject details and comments via `getSubjectById` and `getCommentsBySubject` from `api/subjects.js` and `api/comments.js` (GET `/api/subjects/:id`, GET `/api/comments/subject/:subjectId`).
- **Backend:**
  - `server/routes/subjects.js` (GET `/api/subjects/:id`) fetches subject details.
  - `server/routes/comments.js` (GET `/api/comments/subject/:subjectId`) fetches comments for the subject.
- **MongoDB:**
  - Subject and comment data are read from `subjects` and `comments` collections.
- **Result:**
  - Subject details and associated comments are displayed.

---

## 6. Add a Comment
- **User Action:** Submits a comment on a subject detail page.
- **Frontend:**
  - `SubjectDetailPage.js` handles comment form and calls `addComment` from `api/comments.js` (POST `/api/comments`).
- **Backend:**
  - `server/routes/comments.js` (POST `/api/comments`) validates and saves the comment via `models/Comment.js`.
- **MongoDB:**
  - New comment is inserted into the `comments` collection, linked to the subject and user.
- **Result:**
  - Comment appears under the subject.

---

## 7. Add a Subject
- **User Action:** Navigates to `/add-subject` and submits the form.
- **Frontend:**
  - `AddSubjectPage.js` manages form state and validation, calls `addSubject` from `api/subjects.js` (POST `/api/subjects`).
- **Backend:**
  - `server/routes/subjects.js` (POST `/api/subjects`) validates and saves the subject via `models/Subject.js`.
- **MongoDB:**
  - New subject is inserted into the `subjects` collection, linked to the user.
- **Result:**
  - User is redirected to the subject list; new subject appears.

---

## 8. Data Flow and MongoDB Management
- **Frontend:**
  - Uses API utility files (`api/auth.js`, `api/subjects.js`, `api/comments.js`) to communicate with backend via HTTP requests.
  - Manages authentication state with JWT in localStorage.
- **Backend:**
  - Express routes handle validation, authentication, and CRUD operations.
  - Mongoose models (`User.js`, `Subject.js`, `Comment.js`) define data schemas and interact with MongoDB.
- **MongoDB:**
  - Stores users, subjects, and comments in separate collections.
  - Relationships are managed via ObjectId references (e.g., comments reference subject and user).

---

## 9. Summary Table: Files Involved in Each Path

| Path                | Frontend Files                | Backend Files                  | MongoDB Collections |
|---------------------|------------------------------|-------------------------------|---------------------|
| Register            | RegisterPage.js, api/auth.js  | routes/auth.js, models/User.js | users               |
| Login               | LoginPage.js, api/auth.js     | routes/auth.js, models/User.js | users               |
| List Subjects       | SubjectListPage.js, api/subjects.js | routes/subjects.js, models/Subject.js | subjects            |
| Subject Details     | SubjectDetailPage.js, api/subjects.js, api/comments.js | routes/subjects.js, routes/comments.js, models/Subject.js, models/Comment.js | subjects, comments  |
| Add Comment         | SubjectDetailPage.js, api/comments.js | routes/comments.js, models/Comment.js | comments            |
| Add Subject         | AddSubjectPage.js, api/subjects.js | routes/subjects.js, models/Subject.js | subjects            |

---

## 10. Notes
- All data validation and authentication are enforced on both frontend and backend.
- MongoDB is the single source of truth for all persistent data.
- JWT tokens are used for secure authentication and authorization.
- The flow is designed for clarity, maintainability, and extensibility.
