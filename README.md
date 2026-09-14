# 🔐 Escape Together — Multiplayer Escape Room

A real-time multiplayer escape room game where players collaborate to solve puzzles, use hints, communicate through team chat, and escape before the timer runs out.

The application uses a React/Vite frontend, Node.js/Express backend, MongoDB Atlas for persistent data, and Socket.IO for real-time multiplayer synchronization.

---

## 🎮 Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected API routes
- Password hashing using bcrypt

### Multiplayer Rooms
- Create a multiplayer room
- Generate unique 6-character room codes
- Join rooms using room codes
- Support up to 4 players
- Host and player roles
- Player ready system
- Player connection status
- Host promotion when the host leaves

### Real-Time Multiplayer
Implemented using Socket.IO/WebSockets.

Supported real-time events include:

- Player Joined
- Player Ready
- Game Started
- Puzzle Completed
- Score Updated
- Player Disconnected
- Player Reconnected
- Game Completed

### Escape Room Gameplay
- 5 puzzles per game
- Sequential puzzle progression
- Server-authoritative game timer
- Answer validation on the backend
- Hint system
- Hint penalties
- Score calculation
- Puzzle attempt tracking
- Automatic game completion
- Automatic game failure when the timer expires

### Results & Statistics
- Game results
- Game history
- Player statistics
- Room scores
- Leaderboards
- Player contributions

### Security
- JWT authentication
- Protected room operations
- Room membership validation
- Server-side answer validation
- Server-side scoring
- Server-authoritative timer
- Input validation using Express Validator
- Authentication rate limiting
- Game-action rate limiting
- Production-safe error responses
- CORS configuration

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- React Router
- Socket.IO Client
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcryptjs
- Express Validator
- Express Rate Limit
- CORS

### Deployment

- Render
- MongoDB Atlas

---

## 🏗️ Project Architecture

```text
Escape-Together/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PlayerList.jsx
│   │   ├── PlayerCard.jsx
│   │   ├── Timer.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── PuzzleRenderer.jsx
│   │   ├── Inventory.jsx
│   │   ├── Chat.jsx
│   │   ├── HintPanel.jsx
│   │   ├── PuzzleCard.jsx
│   │   ├── RoomCard.jsx
│   │   ├── GameHeader.jsx
│   │   ├── PuzzleSection.jsx
│   │   ├── RoomEnvironment.jsx
│   │   ├── GamePlayers.jsx
│   │   ├── GameInteractions.jsx
│   │   ├── NextPuzzle.jsx
│   │   ├── ScoreBoard.jsx
│   │   └── PlayerContribution.jsx
│   │
│   ├── context/
│   │   └── GameContext.jsx
│   │
│   ├── data/
│   │   ├── mockData.js
│   │   ├── puzzles.js
│   │   ├── gameData.js
│   │   └── players.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateRoom.jsx
│   │   ├── JoinRoom.jsx
│   │   ├── WaitingLobby.jsx
│   │   ├── EscapeRoom.jsx
│   │   ├── GameResult.jsx
│   │   ├── Leaderboard.jsx
│   │   └── GameHistory.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── room.controller.js
│   │   │   ├── player.controller.js
│   │   │   ├── puzzle.controller.js
│   │   │   ├── gameSession.controller.js
│   │   │   ├── score.controller.js
│   │   │   └── result.controller.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   ├── RoomPlayer.js
│   │   │   ├── Puzzle.js
│   │   │   ├── Hint.js
│   │   │   ├── GameSession.js
│   │   │   ├── PuzzleAttempt.js
│   │   │   └── GameResult.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── room.routes.js
│   │   │   ├── player.routes.js
│   │   │   ├── puzzle.routes.js
│   │   │   ├── gameSession.routes.js
│   │   │   ├── score.routes.js
│   │   │   └── result.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── room.service.js
│   │   │   ├── puzzle.service.js
│   │   │   ├── gameSession.service.js
│   │   │   ├── score.service.js
│   │   │   ├── socket.js
│   │   │   └── result.service.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── notFound.js
│   │   │   ├── validate.js
│   │   │   └── rateLimit.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── room.validator.js
│   │   │   └── puzzle.validator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── Prompts.md
├── README.md
├── .gitignore
└── package.json