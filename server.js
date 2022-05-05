const app = require("express")();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New User connected");

  // Just to 1 user
  socket.emit("message", `[SERVER] You have connected`);

  socket.emit("message", socket.handshake.query.t);

  // To everyone but 1 user
  console.log("[SERVER] A user has joined");
  socket.broadcast.emit(
    "message",
    `[SERVER] A user NEW has joined: ${socket.handshake.query.t}`
  );

  socket.on("disconnect", () => {
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

  socket.on("addPlayer", (player) => {
    console.log("adding player");
    io.emit("addPlayer", player);
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
  socket.on("getGameState", () => {
    socket.broadcast.emit("shareGameState");
  });
  socket.on("setGameState", (state) => {
    socket.broadcast.emit("setGameState", state);
    // io.emit("setGameState", state);
  });
});

// io.on("message", (message) => {
//   console.log(message);
// });

server.listen(4000, function () {
  console.log("listening on port 4000");
});
