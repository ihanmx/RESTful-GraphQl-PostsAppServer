import "dotenv/config";
import express from "express";
import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";
import statusRoutes from "./routes/status.js";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; //to get __dirname in ES modules
import { init as initSocket } from "./config/socket.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5000;

app.use(cors(corsOptions));

app.use(express.json());
//static files
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/status", statusRoutes);

//general error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = app.listen(port);

    const io = initSocket(server);
    io.on("connection", (socket) => {
      console.log("client connected");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
