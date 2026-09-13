const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType =
    response.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = {
      message:
        text ||
        `Request failed with status ${response.status}`,
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};


// =========================================
// AUTHENTICATION
// =========================================

export const registerUser = async ({
  name,
  email,
  password,
}) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};


export const loginUser = async ({
  email,
  password,
}) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};


export const getCurrentUser = async (token) => {
  return apiRequest("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// =========================================
// ROOMS
// =========================================

export const createRoom = async ({ maxPlayers }, token) => {
  const response = await fetch(`${API_BASE_URL}/api/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      maxPlayers: Number(maxPlayers),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create room");
  }

  return data;
};


export const getRoomByCode = async (
  roomCode,
  token
) => {
  if (!roomCode) {
    throw new Error("Room code is required");
  }

  return apiRequest(
    `/rooms/${roomCode.toUpperCase()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getRoomPlayers = async (
  roomCode,
  token
) => {
  if (!roomCode) {
    throw new Error("Room code is required");
  }

  return apiRequest(
    `/rooms/${roomCode.toUpperCase()}/players`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const joinRoom = async (
  roomCode,
  token
) => {
  if (!roomCode) {
    throw new Error("Room code is required");
  }

  return apiRequest(
    `/rooms/${roomCode.toUpperCase()}/join`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =========================================
// ROOM READY / LEAVE
// =========================================

export const setRoomReady = async (
  roomCode,
  isReady,
  token
) => {
  if (!roomCode) {
    throw new Error("Room code is required");
  }

  return apiRequest(
    `/rooms/${roomCode.toUpperCase()}/ready`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isReady: Boolean(isReady),
      }),
    }
  );
};


export const leaveRoom = async (
  roomCode,
  token
) => {
  if (!roomCode) {
    throw new Error("Room code is required");
  }

  return apiRequest(
    `/rooms/${roomCode.toUpperCase()}/leave`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =========================================
// GAME SESSIONS
// =========================================

export const startGameSession = async (roomId, token) => {
  console.log("🔥 START GAME REQUEST:", {
    roomId,
    roomIdType: typeof roomId,
    tokenPresent: Boolean(token),
  });

  if (!roomId) {
    throw new Error("Room ID is missing");
  }

  return apiRequest("/game-sessions/start", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId: roomId,
    }),
  });
};


export const getGameSession = async (
  roomId,
  token
) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  return apiRequest(
    `/game-sessions/${roomId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =========================================
// PUZZLES
// =========================================

export const getPuzzles = async (token) => {
  return apiRequest("/puzzles", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getPuzzle = async (
  puzzleId,
  token
) => {
  if (!puzzleId) {
    throw new Error("Puzzle ID is required");
  }

  return apiRequest(
    `/puzzles/${puzzleId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =========================================
// PUZZLE ATTEMPTS
// =========================================

export const submitPuzzleAnswer = async (
  puzzleId,
  roomId,
  answer,
  token
) => {
  if (!puzzleId) {
    throw new Error("Puzzle ID is required");
  }

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  if (!answer || !answer.trim()) {
    throw new Error("Answer is required");
  }

  return apiRequest(
    `/puzzles/${puzzleId}/attempt`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
        answer: answer.trim(),
      }),
    }
  );
};


// =========================================
// PUZZLE HINTS
// =========================================

export const getPuzzleHints = async (
  puzzleId,
  token
) => {
  if (!puzzleId) {
    throw new Error("Puzzle ID is required");
  }

  return apiRequest(
    `/puzzles/${puzzleId}/hints`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// =========================================
// RESULTS
// =========================================

export const getGameResult = async (
  roomId,
  token
) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  return apiRequest(
    `/results/${roomId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getGameHistory = async (token) => {
  return apiRequest("/results/history", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getPlayerStatistics = async (token) => {
  return apiRequest("/results/statistics", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// =========================================
// SCORES
// =========================================

export const getRoomScore = async (
  roomId,
  token
) => {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  return apiRequest(
    `/scores/room/${roomId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getLeaderboard = async (roomId, token) => {
  return apiRequest(
    `/scores/leaderboard/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getPlayerContributions = async (
  roomId,
  token
) => {
  return apiRequest(
    `/scores/contributions/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const usePuzzleHint = async (
  puzzleId,
  roomId,
  token
) => {
  if (!puzzleId) {
    throw new Error("Puzzle ID is required");
  }

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  return apiRequest(
    `/puzzles/${puzzleId}/hints/use`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
      }),
    }
  );
};