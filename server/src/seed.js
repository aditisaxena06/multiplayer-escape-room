require("dotenv").config();

const connectDB = require("./config/db");
const Puzzle = require("./models/Puzzle");
const Hint = require("./models/Hint");
const PuzzleAttempt = require("./models/PuzzleAttempt");

const puzzles = [
  {
    title: "The Silent Follower",
    description:
      "I follow you everywhere but disappear in darkness. What am I?",
    type: "text",
    order: 1,
    points: 100,
    answer: "shadow",
  },

  {
    title: "The Sequence",
    description:
      "Find the next number in the sequence: 2, 4, 8, 16, ?",
    type: "number",
    order: 2,
    points: 100,
    answer: "32",
  },

  {
    title: "The Three Doors",
    description:
      "Three doors stand before you. Door A has a moon symbol. Door B has a golden key symbol. Door C has a skull symbol. An inscription reads: 'The key to freedom lies behind the symbol that represents escape.' Which door should you choose? Enter A, B, or C.",
    type: "choice",
    order: 3,
    points: 100,
    answer: "B",
  },

  {
    title: "The Forgotten Instrument",
    description:
      "I have many keys but cannot open a door. I have strings but cannot tie a knot. What am I?",
    type: "text",
    order: 4,
    points: 100,
    answer: "piano",
  },

  {
    title: "The Last Riddle",
    description:
      "I have hands but cannot clap. I have a face but cannot smile. I have numbers but cannot count. What am I?",
    type: "text",
    order: 5,
    points: 100,
    answer: "clock",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Remove old game data
    await PuzzleAttempt.deleteMany({});
    await Hint.deleteMany({});
    await Puzzle.deleteMany({});

    // Insert puzzles
    const createdPuzzles = await Puzzle.insertMany(puzzles);

    // Create hints for each puzzle
    const hints = [
      {
        puzzle: createdPuzzles[0]._id,
        text: "It copies your movements when there is light.",
        cost: 10,
        order: 1,
      },
      {
        puzzle: createdPuzzles[1]._id,
        text: "Look carefully at the numbers and identify the pattern.",
        cost: 10,
        order: 1,
      },
      {
        puzzle: createdPuzzles[2]._id,
        text: "Look for the door mentioned by the clues.",
        cost: 10,
        order: 1,
      },
      {
        puzzle: createdPuzzles[3]._id,
        text: "Think of something with black and white keys.",
        cost: 10,
        order: 1,
      },
      {
        puzzle: createdPuzzles[4]._id,
        text: "It has two hands and tells you the time.",
        cost: 10,
        order: 1,
      },
    ];

    await Hint.insertMany(hints);

    console.log("✅ Puzzles seeded successfully");
    console.log(`✅ Created ${createdPuzzles.length} puzzles`);
    console.log(`✅ Created ${hints.length} hints`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();