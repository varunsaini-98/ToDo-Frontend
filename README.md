## ToDo-Backend = https://github.com/varunsaini-98/Todo-Backend.git


# Full-Stack ToDo App (Node.js + Express + MongoDB + React)

A full-stack, production-ready Todo Management Application with **JWT Authentication**, user-isolated task storage, search, sorting, pagination, and a modern **React (Vite)** frontend.

---

## 🗄️ Database Configurations

- **Database Name:** `todo_db`
- **Connection URI:** `mongodb://localhost:27017/todo_db`
- **Collections:**
  - `users` — Stores registered user accounts (Name, Email, Hashed Password).
  - `todos` — Stores individual task items linked to specific users via ObjectIDs.

---

## ⚙️ Environment Configurations (`.env`)

Create a `.env` file inside the `backend/` root directory:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/todo_db
JWT_SECRET=123
```

---

## 💾 Mongoose Data Schemas

### 1. User Model (`models/user.model.js` → `users` collection)

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
```

### 2. Todo Model (`models/todo.model.js` → `todos` collection)

```javascript
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links task strictly to the creator's user account
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
export default Todo;
```

---

## 🔌 API Reference

### Auth Endpoints (`Base URL: http://localhost:3001/api/auth`)

| Method | Endpoint   | Access    | Description                                               |
| :----- | :--------- | :-------- | :-------------------------------------------------------- |
| `POST` | `/signup`  | Public    | Registers a new user account with bcrypt password hashing |
| `POST` | `/login`   | Public    | Authenticates credentials and returns a JWT token         |
| `GET`  | `/profile` | Protected | Retrieves authenticated user profile details              |

### Todo Endpoints (`Base URL: http://localhost:3001/api/todo`)

_All Todo endpoints require `Authorization: Bearer <JWT_TOKEN>` header._

| Method   | Endpoint      | Description                                                                         |
| :------- | :------------ | :---------------------------------------------------------------------------------- |
| `POST`   | `/add`        | Creates a new task bound to `req.userId`                                            |
| `GET`    | `/`           | Retrieves tasks for the logged-in user (Supports `search`, `sort`, `page`, `limit`) |
| `GET`    | `/:id`        | Retrieves a specific task by ObjectID                                               |
| `PUT`    | `/update/:id` | Updates title, description, or completion status for a specific task                |
| `DELETE` | `/delete/:id` | Deletes a task owned by the authenticated user                                      |

---

## 🚀 Setup & Execution Instructions

### 1. Backend Setup (`backend`)

```bash
# Navigate to backend directory
cd ToDo-Backend

# Install dependencies
npm install

# Start server in development mode
npm run dev
# Running on http://localhost:3001
```

### 2. Frontend Setup (`frontend`)

```bash
# Navigate to frontend directory
cd ToDo-Frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Running on http://localhost:5173
```

---

## 🔒 Security & User Isolation

1. **Password Encryption:** Raw passwords are automatically hashed using `bcryptjs` before being persisted in the `users` collection.
2. **Session Verification:** Protected API endpoints utilize `authMiddleware` to verify JWT signatures against `JWT_SECRET`.
3. **Data Isolation:** All database queries (`find`, `findOneAndUpdate`, `findOneAndDelete`) enforce `{ user: req.userId }`, ensuring users can only view and manipulate their own tasks.
