require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const { clientUrl, serverUrl } = require("./urlConfig");

const io = new Server({
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
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

// Catch-all route
app.get("*", (req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;