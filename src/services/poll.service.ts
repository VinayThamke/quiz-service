import { Poll } from "../types.js";

// Mock Database
let currentPoll: Poll = {
  id: "poll-123",
  question: "Which SQL database is your favorite?",
  options: [
    { id: "1", text: "PostgreSQL", votes: 0 },
    { id: "2", text: "MySQL", votes: 0 },
    { id: "3", text: "SQLite", votes: 0 },
  ],
};

export const pollService = {
  // Returns current state
  getLatestPoll: () => currentPoll,

  // Business logic for voting
  castVote: (optionId: string) => {
    const option = currentPoll.options.find((o) => o.id === optionId);
    if (!option) throw new Error("Option not found");

    option.votes += 1;
    return currentPoll;
  },

  // Logic to reset (if needed)
  resetPoll: () => {
    currentPoll.options.forEach((o) => (o.votes = 0));
    return currentPoll;
  },
};
