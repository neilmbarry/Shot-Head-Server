const app = require("express")();

const server = require("http").createServer(app);

let origin;

if (process.env.NODE_ENV === "development") {
  origin = "http://localhost:3000";
} else {
  origin = "https://shot-head-react.vercel.app";
}
const io = require("socket.io")(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
  },
});

app.get("/", function (req, res) {
  res.send("<h1>Shit Head is Ready!</h1>");
});

io.on("connection", (socket) => {
  console.log("New User connected");
  console.log(socket.rooms);

  // Just to 1 user
  socket.emit("message", `[SERVER] You have connected`);

  socket.emit("message", socket.handshake.query.t);

  socket.emit("userID", [...socket.rooms][0]);

  // To everyone but 1 user

  socket.broadcast.emit(
    "message",
    `[SERVER] A user NEW has joined: ${socket.handshake.query.t}`
  );

  socket.on("disconnect", () => {
    console.log("A User disconnected");
    // To everyone
    io.emit("message", "[SERVER] A user has left the chat");
  });

  // socket.on("message", (message) => {
  //   // when receiving message, emits message to everyone
  //   io.emit("message", message);
  //   console.log(message);
  // });

  socket.on("groupChat", (message) => {
    socket.broadcast.emit("groupChat", message);
  });

  socket.on("joinRoom", (room) => {
    console.log("Someone has joined room: ", room);
    socket.join(room);
  });

  socket.on("leaveRoom", (room) => {
    console.log("Someone has left room: ", room);
    socket.leave(room);
  });

  socket.on("addPlayer", (data) => {
    console.log(`Adding player '${data.name}' to room: '${data.room}'`);
    io.in(data.room).emit("addPlayer", data.name);
  });
  socket.on("getGameState", (data) => {
    console.log(`'${data.newPlayer}' is requesting state data`);
    io.in(data.room).emit("shareGameState", data.newPlayer);
    // socket.to(data.room).emit("shareGameState", data.newPlayer);
  });
  socket.on("setGameState", (data) => {
    console.log(`Sending state to all users`);
    io.in(data.state.room).emit("setGameState", data.state);
    console.log(
      `Adding player $'{data.newPlayer}' to room: '${data.state.room}'`
    );
    io.in(data.state.room).emit("addPlayer", data.newPlayer);

    // io.emit("setGameState", state);
  });

  socket.on("readyPlayer", (player) => {
    io.emit("readyPlayer", player);
  });

  socket.on("title", (message) => {
    // when receiving title, emits title to everyone
    io.emit("title", message);
  });

  socket.on("dealCards", (deck) => {
    io.emit("dealCards", deck);
  });

  socket.on("setFaceUpCards", ({ cards, player }) => {
    io.emit("setFaceUpCards", { cards, player });
  });

  socket.on("pickUpStack", (player) => {
    io.emit("pickUpStack", player);
  });

  socket.on("playCards", (data) => {
    io.emit("playCards", data);
  });
  socket.on("sortCards", (player) => {
    io.emit("sortCards", player);
  });
  socket.on("drawCardsFromDeck", (player) => {
    io.emit("drawCardsFromDeck", player);
  });
  socket.on("reset", () => {
    io.emit("reset");
  });
  socket.on("newGame", () => {
    io.emit("newGame");
  });
});

// io.on("message", (message) => {
//   console.log(message);
// });

server.listen(process.env.PORT || 4000, function () {
  console.log("listening on port 4000");
});
