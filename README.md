# To-Do List App (MERN Stack)

A beautifully designed, mobile-first To-Do List application built with the MERN stack. It allows users to organize their tasks efficiently, track weekly progress, and manage everything with an intuitive UI.

## Features
- **Weekly Organization**: Tasks are automatically grouped and displayed by week (Monday to Sunday).
- **Task Summary Cards**: Each week's card shows the number of open and completed tasks, complete with a visual progress bar.
- **Task Management**: Create, edit, search, and delete tasks.
- **Swipe-to-Delete**: Intuitive mobile-style swipe gesture to delete tasks (or just click to edit/mark as complete).
- **Search**: Real-time debounce search by task title or description.
- **Priority Tracking**: Assign Low, Medium, or High priority to tasks.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (v4), Framer Motion, date-fns, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Database (Local Testing)**: `mongodb-memory-server` is configured to run automatically if no `MONGO_URI` is provided, meaning **you do not need a local MongoDB installation to test this!**

## Getting Started

### 1. Backend Setup
Navigate to the `backend` folder and start the server.
```bash
cd backend
npm install
npm run dev
```
*Note: If you want to use a real MongoDB database, add a `.env` file in the `backend` directory with `MONGO_URI=your_connection_string`. Otherwise, it seamlessly uses an in-memory database for testing.*

### 2. Frontend Setup
Open a new terminal, navigate to the `frontend` folder, and start the Vite dev server.
```bash
cd frontend
npm install
npm run dev
```

### 3. View Application
Open your browser to `http://localhost:5173`.
*For the best experience, open Developer Tools (F12) and toggle the Device Toolbar (Ctrl+Shift+M) to view the app in a mobile viewport (e.g., iPhone 12/13), as it is built with a mobile-first approach.*

## API Endpoints
- `GET /api/tasks` : Get all tasks (supports `?search=` query).
- `POST /api/tasks` : Create a new task.
- `PUT /api/tasks/:id` : Update an existing task or its status.
- `DELETE /api/tasks/:id` : Delete a task.

## Design Highlights
- Fluid micro-animations (Framer Motion) for expanding week cards and swiping.
- Tailwind Custom Theme variables for a premium look.
- Clean typography and spacing following modern app design guidelines.
