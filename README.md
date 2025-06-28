# Todo & Task Manager Frontend

A modern React/Next.js frontend for the Todo & Task Manager application with role-based access control.

## Features

- **Role-based Access**: Admin, User, and Guest roles with different permissions
- **Todo Management**: Create, edit, delete, and complete todos with notes
- **Task Management**: Create, edit, delete, and complete tasks with types and deadlines
- **Export Functionality**: Export tasks to Excel and PDF formats
- **Statistics**: View completion rates and task priorities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14.2.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-frontend-repo-url>
   cd todo-task-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Update the `API_CONFIG.BASE_URL` in `src/config/api.ts` to point to your backend:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://localhost:5000', // Update this to your backend URL
     ENDPOINTS: {
       TODOS: '/api/todos',
       TASKS: '/api/tasks',
       EXPORT: '/api/export',
     },
   } as const
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── ExportButtons.tsx # Export functionality
│   └── RoleSelector.tsx  # Role switching component
├── config/               # Configuration files
│   └── api.ts           # API configuration
├── features/            # Feature-based modules
│   ├── todo/           # Todo feature
│   │   ├── components/ # Todo-specific components
│   │   └── TodoFeature.tsx
│   └── tasks/          # Tasks feature
│       ├── components/ # Task-specific components
│       └── TaskFeature.tsx
├── hooks/              # Custom React hooks
│   ├── useTodos.ts    # Todo data management
│   └── useTasks.ts    # Task data management
└── lib/               # Utility functions
    └── utils.ts       # Common utilities
```

## Architecture

This frontend follows a clean architecture with separation of concerns:

- **Components**: Pure UI components with minimal logic
- **Hooks**: Business logic and API interactions
- **Features**: Self-contained feature modules
- **Config**: Centralized configuration

## API Integration

The frontend expects a REST API with the following endpoints:

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/complete` - Toggle completion
- `DELETE /api/todos/:id` - Delete todo

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Toggle completion
- `DELETE /api/tasks/:id` - Delete task

### Export
- `GET /api/export/tasks/excel` - Export tasks to Excel
- `GET /api/export/tasks/pdf` - Export tasks to PDF

## Role-Based Access

The application supports three user roles:

- **Guest**: Read-only access to todos and tasks
- **User**: Full CRUD operations on todos and tasks
- **Admin**: Same as user (extensible for additional permissions)

Roles are simulated via a header `x-user-role` sent with each request.

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License