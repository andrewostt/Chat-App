# Chat Application

## Authors
- **Андрей Остапченко** - Tech Lead
- **Андрей Остапченко** - Backend Developer
- **Андрей Остапченко** - Frontend Developer

## Project Overview
A modern real-time chat application with multiple chat rooms, built using React, Node.js, and WebSocket technology.

## Key Features
- Real-time messaging using WebSocket
- Multiple chat rooms
- User authentication
- Modern UI with dark theme
- Responsive design
- Message history
- User presence indicators

## Tech Stack

### Frontend
- React 18 with TypeScript
- Chakra UI for components
- React Router for navigation
- Socket.IO Client for real-time communication
- Axios for HTTP requests
- Vite as build tool

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Prisma ORM
- Socket.IO for WebSocket
- Jest for testing

## Project Structure
```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React contexts
│   │   └── ...
│   └── ...
└── server/                # Node.js backend
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Data models
    │   ├── routes/        # API routes
    │   └── ...
    └── ...
```

## Requirements
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation and Running

1. Clone the repository:
```bash
git clone https://github.com/andrewostt/Chat-App.git
cd Chat-App
```

2. Set up the database:
```bash
cd server
npm install
npx prisma migrate dev
```

3. Start the server:
```bash
npm run dev
```

4. In a new terminal, start the client:
```bash
cd client
npm install
npm run dev
```

## Usage
1. Open your browser and navigate to `http://localhost:5173`
2. Enter your username
3. Select a chat room
4. Start chatting!

## Testing
Run tests for the server:
```bash
cd server
npm test
```

## License
This project is licensed under the MIT License. 