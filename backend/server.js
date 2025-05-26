// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const authRoute = require("./routes/authRoutes");
// const userRoute = require("./routes/userRoutes");
// const postRoute = require("./routes/postRoutes");



// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.log(err));

// // Basic route
// app.get("/", (req, res) => {
//   res.send("API is running");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const Chat = require("./models/Chat"); // 👈 Import Chat model


const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Create HTTP Server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // updated to match your Vite frontend
    methods: ["GET", "POST"]
  }
});


// io.on("connection", (socket) => {
//   console.log("A user connected: ", socket.id);

//   socket.on("join_room", (room) => {
//     socket.join(room);
//     console.log(`User ${socket.id} joined room: ${room}`);
//   });

//   socket.on("send_message", (data) => {
//     console.log("Message received:", data);
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });
io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    // ✅ Send chat history from MongoDB
    const history = await Chat.find({ room }).sort({ createdAt: 1 });
    socket.emit("room_history", history);
  });

  socket.on("send_message", async (data) => {
    console.log("Message received:", data);

    // ✅ Save message to DB
    const newMsg = new Chat({
      username: data.username,
      room: data.room,
      message: data.message,
      time: data.time,
    });

    await newMsg.save();

    // ✅ Send message to others in the room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
