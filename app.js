import "dotenv/config";
import express from "express";
import feedRoutes from "./routes/feed.js";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url"; //to get __dirname in ES modules
import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5000;

app.use(cors(corsOptions));

app.use(express.json());
//static files
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/feed", feedRoutes);

//general error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
