# AI Usage and Development Prompts

## 1. Overview

AI assistance was used during the development of the Multiplayer Escape Room project to support backend architecture, database design, game-state management, validation, WebSocket integration, security, testing, debugging, documentation, and UI improvements.

The final implementation was reviewed, tested, and integrated into the project manually.

---

## 2. Backend Architecture

AI assistance was used to plan and structure the backend into separate layers instead of implementing the complete game engine inside a single controller.

The backend was organized into:

- Models
- Routes
- Controllers
- Services
- Middleware
- Validators
- Configuration
- Socket.IO services

This modular structure improves maintainability, separation of concerns, and reusability.

---

## 3. Database Design

AI assistance was used to design the MongoDB/Mongoose data model for the multiplayer game.

The following models were implemented:

- User
- Room
- RoomPlayer
- Puzzle
- Hint
- GameSession
- PuzzleAttempt
- GameResult

Relationships between rooms, players, puzzles, sessions, attempts, and results were considered while designing the schema.

Multiple GameSession and GameResult records can exist for the same room so that completed rooms can support replay sessions.

---

## 4. Authentication

AI assistance was used to implement and validate the authentication architecture.

The system uses:

- User registration
- User login
- bcrypt password hashing
- JWT authentication
- Protected routes
- Authentication middleware

JWT tokens contain the authenticated user's identity and role and are used to protect backend resources.

---

## 5. Room and Multiplayer Management

AI assistance was used to design the room lifecycle and player management logic.

The implemented functionality includes:

- Room creation
- Unique six-character room codes
- Joining rooms
- Room membership validation
- Host and player roles
- Ready state management
- Maximum player limits
- Player connection state
- Player leaving
- Host promotion

The backend validates room membership before allowing protected room operations.

---

## 6. Game-State Management

AI assistance was used to design the GameSession architecture so that important game state is controlled by the backend.

The server manages:

- Game status
- Current puzzle
- Puzzle progression
- Start time
- Game duration
- Puzzle completion
- Total score
- Hints used
- Game completion
- Game expiration

The frontend does not determine whether an answer is correct or how many points should be awarded.

---

## 7. Server-Authoritative Timer

The game timer was implemented as a server-authoritative mechanism.

When a game starts, the backend records:

- `startedAt`
- `durationSeconds`

The server calculates the expiration time and remaining time.

The backend can automatically expire an active session when the configured duration has elapsed.

This prevents the client from manipulating the timer to gain additional gameplay time.

---

## 8. Puzzle Validation and Scoring

AI assistance was used to design the puzzle attempt and scoring flow.

Puzzle answers are validated on the backend.

The server:

1. Identifies the current game session.
2. Identifies the current puzzle.
3. Validates the submitted answer.
4. Creates a PuzzleAttempt record.
5. Calculates points.
6. Updates the GameSession.
7. Advances the current puzzle when the answer is correct.
8. Completes the game after the final puzzle.

Puzzle answers are excluded from normal puzzle retrieval responses so that clients cannot directly obtain the answer.

---

## 9. Hint System

AI assistance was used to implement the hint workflow.

The backend:

- Validates the player's room membership.
- Checks the active game session.
- Identifies the current puzzle.
- Prevents repeated hint usage by the same player for the same puzzle.
- Applies a score penalty.
- Increments the session hint count.
- Records the hint usage as a puzzle attempt.

---

## 10. WebSockets / Socket.IO

AI assistance was used to implement real-time multiplayer synchronization using Socket.IO.

The backend and frontend communicate through Socket.IO rooms using the room code.

Real-time events include:

- `player:joined`
- `player:ready`
- `game:started`
- `puzzle:completed`
- `score:updated`
- `player:disconnected`
- `player:reconnected`
- `game:completed`

This allows multiple players to receive game-state changes without manually refreshing the application.

---

## 11. Reconnection Handling

AI assistance was used to implement player connection and reconnection handling.

When a Socket.IO client disconnects, the backend updates the player's connection state.

When the player reconnects and joins the room again, the backend restores the connection state and broadcasts the appropriate event.

The game session itself remains controlled by the backend.

---

## 12. API Validation

AI assistance was used to implement request validation using Express Validator.

Validation was added for important inputs such as:

- Authentication data
- Room codes
- Room information
- Puzzle IDs
- Puzzle answers
- Game session room IDs

Invalid requests return appropriate HTTP error responses instead of being processed by the game logic.

---

## 13. Authorization and Security

AI assistance was used to review authorization and security requirements.

Security measures implemented include:

- JWT authentication
- Protected API endpoints
- Room membership checks
- Host authorization
- Server-side scoring
- Server-side answer validation
- Server-authoritative game state
- Input validation
- CORS configuration
- Production-safe error handling
- Rate limiting

Score-related endpoints also verify that the requesting user belongs to the requested room.

---

## 14. Rate Limiting

AI assistance was used to add rate limiting for sensitive endpoints.

Authentication requests are rate limited to reduce excessive login and registration attempts.

Game-sensitive operations such as puzzle attempts and hint usage are also rate limited.

This provides basic protection against request flooding and abuse.

---

## 15. Error Handling

AI assistance was used to create centralized backend error handling.

The backend handles errors such as:

- Unauthorized requests
- Invalid input
- Missing resources
- Invalid game state
- Room membership violations
- Full rooms
- Duplicate operations
- Internal server errors

Production responses avoid exposing unnecessary internal implementation details.

---

## 16. API and Security Testing

AI assistance was used to design API test cases covering:

- Registration
- Login
- Protected endpoints
- Invalid room codes
- Invalid puzzle IDs
- Invalid game session IDs
- Empty answers
- Unauthorized room access
- Unauthorized score access
- Non-host game start attempts
- Starting before all players are ready
- Rate limiting

The APIs were tested using HTTP requests and multiplayer browser sessions.

---

## 17. UI and Frontend Integration

AI assistance was also used to debug and improve the React frontend.

Examples include:

- Connecting the frontend to the backend API.
- Displaying backend room names.
- Synchronizing room and player information.
- Integrating Socket.IO events.
- Displaying synchronized game progress.
- Displaying scores and puzzle progression.
- Improving the Dashboard.
- Displaying game history and player statistics.

Backend data is used as the source of truth where appropriate.

---

## 18. Deployment

AI assistance was used during deployment and production debugging.

The application was deployed using Render with:

- React/Vite frontend as a Static Site
- Node.js/Express backend as a Web Service
- MongoDB Atlas as the production database
- Environment variables for configuration
- CORS configuration for the production frontend
- Socket.IO/WebSocket support
- Production health-check endpoint

The backend provides:

```text
GET /api/health