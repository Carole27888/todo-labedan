# Todo & Task Manager

A full-stack todo and task management application with role-based access control.

## Backend Setup

1. **Install Dependencies**
   ```bash
   npm install express mongodb dotenv cors exceljs pdfkit zod
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=todoapp
   PORT=5000
   REMINDER_INTERVAL_MS=60000
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Windows
   net start MongoDB

   # On Linux
   sudo systemctl start mongod
   ```

4. **Run Backend Server**
   ```bash
   node server.js
   ```

   You should see:
   ```
   MongoDB connected
   Server running on port 5000
   ```

## Frontend Setup

The frontend is already configured and running. It will connect to the backend at `http://localhost:5000`.

## Features

- **Role-based Access**: Admin, User, and Guest roles with different permissions
- **Todo Management**: Create, edit, delete, and complete todos with notes
- **Task Management**: Create, edit, delete, and complete tasks with types and deadlines
- **Export Functionality**: Export tasks to Excel and PDF formats
- **Statistics**: View completion rates and task priorities
- **Reminders**: Automatic console reminders for tasks due within 24 hours

## API Endpoints

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo (admin/user only)
- `PUT /api/todos/:id` - Update todo (admin/user only)
- `PATCH /api/todos/:id/complete` - Toggle completion (admin/user only)
- `DELETE /api/todos/:id` - Delete todo (admin/user only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (admin/user only)
- `PUT /api/tasks/:id` - Update task (admin/user only)
- `PATCH /api/tasks/:id/complete` - Toggle completion (admin/user only)
- `DELETE /api/tasks/:id` - Delete task (admin/user only)

### Export
- `GET /api/export/tasks/excel` - Export tasks to Excel (admin/user only)
- `GET /api/export/tasks/pdf` - Export tasks to PDF (admin/user only)

## Role Permissions

- **Guest**: Can only view todos and tasks
- **User**: Can create, edit, delete, and export todos and tasks
- **Admin**: Same as user (can be extended for additional permissions)