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
- Password hashing using bcryptjs

### Multiplayer Rooms

- Create a multiplayer room
- Generate unique 6-character room codes
- Join rooms using room codes
- Support up to 4 players
- Host and player roles
- Player ready system
- Player connection status
- Host promotion when the host leaves
- Room status management
- Reconnection support

### Real-Time Multiplayer

Implemented using Socket.IO/WebSockets.

Supported real-time events include:

- Player Joined
- Player Ready
- Player Online
- Player Disconnected
- Player Reconnected
- Game Started
- Puzzle Completed
- Score Updated
- Game Completed
- Real-Time Team Chat
- Real-Time Room Activity Updates

### Persistent Real-Time Communication

Chat messages and room activity events are persisted in MongoDB using dedicated `ChatMessage` and `RoomActivity` collections.

Socket.IO provides real-time delivery to connected players, while MongoDB stores the communication history.

This allows:

- Chat history to survive backend restarts
- Room activity history to survive backend restarts
- Players joining or reconnecting to receive recent chat history
- Players joining or reconnecting to receive recent activity history
- Historical communication to remain separate from the live Socket.IO communication layer

### Escape Room Gameplay

- 5 puzzles per game
- Sequential puzzle progression
- Server-authoritative game timer
- Server-side answer validation
- Hint system
- Hint penalties
- Server-side score calculation
- Puzzle attempt tracking
- Automatic game completion
- Automatic game failure when the timer expires
- Game session tracking
- Replay support

### Results & Statistics

- Game results
- Game history
- Player statistics
- Room scores
- Leaderboards
- Player contributions
- Puzzle attempt records
- Score tracking

### Security

- JWT authentication
- Protected API routes
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
- Authenticated Socket.IO connections

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
- Cookie Parser

### Database

- MongoDB Atlas
- Mongoose ODM

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
│   │   │   ├── GameResult.js
│   │   │   ├── ChatMessage.js
│   │   │   └── RoomActivity.js
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
```

---

## 🗄️ Database Design

The backend uses MongoDB Atlas with Mongoose.

### Core Models

#### User

Stores registered player information.

Main fields:

- Name
- Email
- Password hash
- Avatar
- Role
- Timestamps

#### Room

Stores multiplayer room information.

Main fields:

- Room name
- Unique room code
- Host
- Room status
- Maximum players
- Timestamps

#### RoomPlayer

Represents the relationship between users and rooms.

Main fields:

- Room
- User
- Player role
- Ready status
- Connection status

#### Puzzle

Stores the escape room puzzles.

Main fields include:

- Puzzle number/order
- Puzzle question
- Answer
- Puzzle metadata

Puzzle answers are never exposed to normal frontend puzzle requests.

#### Hint

Stores hints associated with puzzles.

#### GameSession

Tracks an individual game session.

Main fields include:

- Room
- Session status
- Current puzzle
- Puzzles solved
- Total score
- Hints used
- Start time
- End time
- Duration

Multiple game sessions can exist for the same room, allowing replay support.

#### PuzzleAttempt

Tracks individual puzzle attempts.

Main fields include:

- Room
- Game session
- Puzzle
- User
- Submitted answer
- Correct/incorrect result
- Points earned
- Attempt timestamp

#### GameResult

Stores the final result of a game session.

Main fields include:

- Room
- Game session
- Result status
- Puzzles solved
- Total score
- Hints used
- Duration
- Completion timestamp

#### ChatMessage

Stores persistent team chat messages.

Main fields include:

- Room
- User
- Player name
- Avatar
- Message text
- Timestamp

Recent chat history is loaded from MongoDB whenever a player joins or reconnects to a room.

#### RoomActivity

Stores persistent room activity events.

Examples include:

- Player joined
- Player reconnected
- Other room activity events

Recent activity history is loaded from MongoDB when a player joins or reconnects.

---

## 🎯 Game Flow

```text
User Registration
       ↓
User Login
       ↓
Dashboard
       ↓
Create / Join Room
       ↓
Waiting Lobby
       ↓
Players Ready
       ↓
Host Starts Game
       ↓
Game Session Created
       ↓
Puzzle 1
       ↓
Submit Answer
       ↓
Backend Validation
       ↓
Score Updated
       ↓
Next Puzzle
       ↓
Puzzle 2 → Puzzle 3 → Puzzle 4 → Puzzle 5
       ↓
All Puzzles Solved
       ↓
Game Result
       ↓
Leaderboard / History / Statistics
```

If the timer expires before all puzzles are solved:

```text
Game Session Active
       ↓
Timer Expires
       ↓
Backend Marks Session Failed
       ↓
Room Completed
       ↓
Game Result Created
       ↓
Failure Result Displayed
```

---

## ⏱️ Server-Authoritative Game State

The backend is the authoritative source of truth for gameplay.

The client does not determine:

- Whether an answer is correct
- How many points are awarded
- Whether a puzzle is completed
- Which puzzle comes next
- Whether the game has expired
- Whether a hint can be used
- Whether the game can start

These decisions are handled by the backend.

### Server-Authoritative Timer

The game session stores:

- `startedAt`
- `durationSeconds`
- `endedAt`

The backend calculates the actual expiry time.

The frontend displays the remaining time based on server-provided game state.

This prevents players from extending the timer by manipulating the client-side clock.

---

## 🔄 Real-Time Communication

Socket.IO is used for real-time multiplayer communication.

### Connection Authentication

Socket connections are authenticated using the player's JWT.

The server verifies the token before allowing the socket connection to proceed.

### Room Communication

Players join a Socket.IO room using the six-character room code.

Messages and multiplayer events are broadcast to players within the room.

### Supported Events

```text
room:join

player:joined
player:ready
player:online
player:disconnected
player:reconnected
player:offline

game:started
game:activity
game:completed

puzzle:completed
score:updated

chat:send
chat:message
chat:history

room:activity
activity:history

room:error
```

### Persistent Chat and Activity

Real-time delivery and persistence are separated:

```text
Player Action
     ↓
Socket.IO Event
     ↓
Backend Validation
     ↓
MongoDB Persistence
     ↓
Socket.IO Broadcast
     ↓
All Connected Players
```

When a player joins or reconnects:

```text
Player Joins Room
       ↓
Backend Loads History
       ↓
MongoDB
   ↙       ↘
Chat       Activity
History    History
   ↓          ↓
Socket.IO → Player
```

This ensures that recent communication and activity remain available even after a backend restart.

---

## 🔌 API Overview

The backend exposes REST APIs under:

```text
/api
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Rooms

```text
POST   /api/rooms
GET    /api/rooms/:code
GET    /api/rooms/:code/players
POST   /api/rooms/:code/join
PATCH  /api/rooms/:code/ready
DELETE /api/rooms/:code/leave
```

### Puzzles

```text
GET  /api/puzzles
GET  /api/puzzles/:id
GET  /api/puzzles/:id/hints
POST /api/puzzles/:id/hint
POST /api/puzzles/:id/attempt
```

### Game Sessions

```text
POST /api/game-sessions/start
GET  /api/game-sessions/:roomId
```

### Results

```text
GET  /api/results/:roomId
POST /api/results
GET  /api/results/history
GET  /api/results/statistics
```

### Scores

```text
GET /api/scores/:roomId
GET /api/scores/:roomId/leaderboard
GET /api/scores/:roomId/contributions
```

### Health Check

```text
GET /api/health
```

---

## 🛡️ Validation & Security

The backend implements multiple security and validation layers.

### Authentication

- JWT-based authentication
- Protected REST API routes
- Authenticated Socket.IO connections
- User existence verification

### Input Validation

Express Validator is used for validating incoming API data.

Validation includes:

- Registration fields
- Login fields
- Room codes
- Room data
- Puzzle IDs
- Game session IDs
- Puzzle answers

### Room Authorization

Room operations verify that the requesting user is a member of the room.

Protected operations include:

- Viewing room information
- Viewing players
- Joining rooms
- Game operations
- Score access
- Result access

### Server-Side Game Validation

The backend validates:

- Current game session
- Current puzzle
- Submitted answer
- Player membership
- Game status
- Timer expiration
- Hint availability

### Rate Limiting

Two rate limiting layers are implemented.

#### Authentication Rate Limiting

Limits repeated authentication requests to reduce brute-force attempts.

#### Game Action Rate Limiting

Limits excessive game-related requests such as:

- Puzzle attempts
- Hint requests

### Error Handling

The backend uses centralized error handling and production-safe responses.

Internal server errors do not expose sensitive implementation details to clients.

### CORS

CORS is configured using the frontend deployment URL.

---

## 🧩 Hint System

Players can request hints for the current puzzle.

The backend:

1. Verifies room membership.
2. Verifies the active game session.
3. Verifies the current puzzle.
4. Prevents repeated hint usage for the same player and puzzle.
5. Applies the configured score penalty.
6. Tracks hint usage.
7. Stores the related attempt information.
8. Broadcasts the activity to the room.

Hint penalties cannot reduce the score below zero.

---

## 🏆 Scoring System

Scores are calculated by the backend.

The frontend cannot directly assign points.

When a correct answer is submitted:

```text
Answer Submitted
       ↓
Backend Validates Answer
       ↓
Correct?
   ↙       ↘
 YES       NO
 ↓          ↓
Score      No Score
Updated
 ↓
Puzzle Progression
```

The backend stores score information in the game session and exposes it through the score APIs.

---

## 👥 Multiplayer Synchronization

The application synchronizes:

- Player joining
- Player readiness
- Player connection status
- Player reconnection
- Game start
- Current puzzle
- Puzzle completion
- Score changes
- Game completion
- Team chat
- Room activity

The frontend also refreshes important backend state during gameplay to ensure the UI remains synchronized with the authoritative server state.

---

## 🔁 Disconnect & Reconnect Handling

If a player disconnects:

```text
Socket Disconnect
       ↓
RoomPlayer.isConnected = false
       ↓
Other Players Receive Disconnect Event
```

When the player reconnects:

```text
Socket Reconnect
       ↓
JWT Authentication
       ↓
Room Membership Verification
       ↓
Room Rejoin
       ↓
Connection Status Updated
       ↓
Chat History Loaded
       ↓
Activity History Loaded
       ↓
Reconnection Event Broadcast
```

This allows players to recover their multiplayer session without losing the room's persistent communication history.

---

## 📊 Results, History & Statistics

After a game reaches a terminal state, the backend can create and retrieve a game result.

The system supports:

- Current game result
- Historical games
- Player statistics
- Room scores
- Leaderboards
- Player contribution information

Game results are associated with individual `GameSession` records, allowing multiple completed games to exist for the same room.

---

## 🖥️ Frontend Integration

The React frontend communicates with the backend through:

### REST API

Used for:

- Authentication
- Room management
- Puzzle retrieval
- Game session operations
- Results
- Scores
- Statistics

### Socket.IO

Used for:

- Multiplayer presence
- Real-time player updates
- Game events
- Puzzle completion
- Score updates
- Team chat
- Room activity

### Game Context

`GameContext.jsx` provides shared game and room state to the frontend components.

---

## 🚀 Deployment

The project is deployed using Render.

### Backend

The backend runs as a Node.js web service.

```text
Runtime: Node
Root Directory: server
Build Command: npm install
Start Command: npm start
```

The backend connects to MongoDB Atlas using environment variables.

### Frontend

The frontend runs as a Render Static Site.

```text
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables

Backend:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

Frontend:

```env
VITE_API_URL=
```

The frontend API URL points to the deployed backend root URL.

---

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/aditisaxena06/multiplayer-escape-room.git
cd multiplayer-escape-room
```

### 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

For the frontend, configure:

```env
VITE_API_URL=http://localhost:5000
```

### 5. Start Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start Frontend

From the project root:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🧪 Testing

The backend APIs were tested using Postman.

Testing covers:

- Health check
- User registration
- User login
- Current user
- Unauthorized requests
- Room creation
- Room retrieval
- Player retrieval
- Invalid room code
- Player readiness
- Puzzle retrieval
- Invalid puzzle ID
- Empty answer validation
- Puzzle hints
- Game start
- Game session retrieval
- Invalid game session ID
- Game result handling
- Game history
- Player statistics
- Room scores
- Leaderboard
- Player contributions
- Authentication rate limiting
- Game-action validation
- Room membership authorization

### Expected Error Cases

The API handles cases such as:

- Missing authentication
- Invalid JWT
- Invalid room code
- Invalid puzzle ID
- Invalid game session ID
- Empty puzzle answer
- Non-existent room
- Non-member room access
- Non-host game start attempts
- Starting before all players are ready
- Full rooms
- Starting or submitting actions after game expiration

---

## 👨‍👩‍👧‍👦 Multiplayer Testing

For multiplayer testing:

1. Register two or more accounts.
2. Log in with the first account.
3. Create a room.
4. Copy the room code.
5. Log in with another account using a separate browser profile or Incognito window.
6. Join the room using the room code.
7. Mark players as ready.
8. Start the game from the host account.
9. Submit puzzles from different players.
10. Verify real-time score and puzzle updates.
11. Send messages through team chat.
12. Verify all players receive the messages.
13. Verify room activity is visible to all players.
14. Disconnect and reconnect a player.
15. Verify the player returns to the room correctly.
16. Restart the backend and rejoin the room.
17. Verify persistent chat and activity history is restored.

---

## 📁 Project Documentation

The project includes:

### README.md

Contains:

- Project overview
- Features
- Technology stack
- Architecture
- Database design
- Game flow
- Real-time communication
- API overview
- Security
- Deployment
- Testing
- Local development

### Prompts.md

Contains documentation of the AI-assisted development process, including prompts and development areas covering:

- Backend architecture
- Database design
- Authentication
- Room management
- Multiplayer functionality
- Game sessions
- Server-authoritative timers
- Puzzle validation
- Scoring
- Hints
- Socket.IO
- Reconnection
- Validation
- Security
- Rate limiting
- Error handling
- Frontend integration
- Deployment
- Testing
- Documentation

---

## 🎯 Engineering Objective

The backend acts as the authoritative source of truth for the multiplayer escape room.

It manages:

- Users
- Rooms
- Players
- Puzzles
- Hints
- Game sessions
- Puzzle attempts
- Scores
- Results
- Persistent chat messages
- Persistent room activity
- Real-time multiplayer events

The frontend provides the user interface while the backend controls game state, validation, scoring, timing, authorization, and persistent multiplayer data.

---

## 📌 Current Implementation Summary

The project implements the complete multiplayer escape room workflow:

```text
Authentication
      ↓
Room Creation / Joining
      ↓
Waiting Lobby
      ↓
Player Readiness
      ↓
Real-Time Multiplayer Connection
      ↓
Game Session
      ↓
Server-Authoritative Timer
      ↓
Puzzle Solving
      ↓
Backend Answer Validation
      ↓
Score Calculation
      ↓
Hint Management
      ↓
Real-Time Synchronization
      ↓
Persistent Chat & Activity
      ↓
Game Completion / Failure
      ↓
Results
      ↓
History / Statistics / Leaderboards
```

Escape Together combines REST APIs, MongoDB persistence, and Socket.IO real-time communication to provide a secure and synchronized multiplayer escape room experience.