import pkg from "pg";
const { Pool, Client } = pkg;

const dbConfig = {
  user: "postgres", // Your pgAdmin username
  host: "localhost",
  database: "poll_db", // Your database name
  password: "your_password", // Your password
  port: 5432,
};

// 1. The Pool for regular queries
export const pool = new Pool(dbConfig);

// 2. The Dedicated Client for Real-Time Listening
export const initDbListener = async (io: any) => {
  const listenerClient = new Client(dbConfig);

  try {
    await listenerClient.connect();
    console.log("✅ DB Listener connected");

    // Tell Postgres we want to hear 'poll_updates'
    await listenerClient.query("LISTEN poll_updates");

    // This fires whenever the DB Trigger runs pg_notify
    listenerClient.on("notification", (msg: any) => {
      if (msg.payload) {
        const data = JSON.parse(msg.payload);
        console.log("📢 Real-time DB notification:", data);

        // BROADCAST to Socket.io: Update everyone in the poll room
        io.to(data.poll_id).emit("poll-updated", data);
      }
    });

    listenerClient.on("error", (err: any) => {
      console.error("❌ DB Listener Error", err);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB Listener", error);
  }
};
