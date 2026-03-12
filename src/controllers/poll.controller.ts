import { Server, Socket } from "socket.io";
import { pollService } from "../services/poll.service.js";

export const registerPollHandlers = (io: Server, socket: Socket) => {
  // 1. Initial State: Send the poll as soon as they connect
  socket.emit("poll-update", pollService.getLatestPoll());

  // 2. Handle Voting
  socket.on("submit-vote", (optionId: string) => {
    try {
      // Call service to update data
      const updatedPoll = pollService.castVote(optionId);

      // BROADCAST: Tell EVERYONE the poll changed
      // Use io.emit so the voter AND all other connected users see the update
      io.emit("poll-update", updatedPoll);

      console.log(`🗳️ Vote cast for ${optionId} by ${socket.id}`);
    } catch (error) {
      // Send private error only to the person who failed
      socket.emit("error", { message: "Failed to cast vote" });
    }
  });

  // 3. Handle Disconnect (Optional cleanup)
  socket.on("disconnect", () => {
    console.log("👋 User left:", socket.id);
  });
};
