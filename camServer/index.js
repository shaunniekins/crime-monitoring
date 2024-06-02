require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { clientUrl, serverUrl } = require("./urlConfig");
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    method: ["GET", "POST"],
    credentials: true
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", require("./routes/client"));
app.use("/", require("./routes/admin"));

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("send_report", (data) => {
    socket.broadcast.emit("receive_report", data);
  });
  socket.on("send_update", (data) => {
    socket.broadcast.emit("receive_update", data);
  });
});

const port = serverUrl.split(":").pop();

server.listen(port, () => {
  console.log(`Server is running at ${serverUrl}`);
});

// Catch-all route
app.get("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = { app, server };