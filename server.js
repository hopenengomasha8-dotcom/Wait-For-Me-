const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Wait For Me", version: "2.0.0" });
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ room, name }) => {
    const cleanRoom = String(room || "").trim().toUpperCase().slice(0, 8);
    const cleanName = String(name || "Your partner").trim().slice(0, 40);
    if (!cleanRoom) return;

    socket.join(cleanRoom);
    socket.data.room = cleanRoom;
    socket.data.name = cleanName;

    const members = io.sockets.adapter.rooms.get(cleanRoom);
    const count = members ? members.size : 0;

    socket.emit("room-joined", { room: cleanRoom, count });
    socket.to(cleanRoom).emit("partner-online", { name: cleanName, count });
  });

  socket.on("watch-request", (payload = {}) => {
    const room = socket.data.room;
    if (!room) return;
    socket.to(room).emit("watch-request", {
      from: socket.data.name || "Your partner",
      show: String(payload.show || "Our show").slice(0, 80),
      episode: String(payload.episode || "").slice(0, 80)
    });
  });

  socket.on("watch-response", (payload = {}) => {
    const room = socket.data.room;
    if (!room) return;
    socket.to(room).emit("watch-response", {
      from: socket.data.name || "Your partner",
      message: String(payload.message || "I'm joining!").slice(0, 120)
    });
  });

  socket.on("disconnect", () => {
    const room = socket.data.room;
    if (room) socket.to(room).emit("partner-offline", {
      name: socket.data.name || "Your partner"
    });
  });
});

server.listen(PORT, () => console.log(`Wait For Me running on port ${PORT}`));
