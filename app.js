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
import { graphqlHTTP } from "express-graphql";
import graphqlSchema from "./graphql/schema.js";
import graphqlResolver from "./graphql/resolvers.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5000;

app.use(cors(corsOptions));

app.use(express.json());
//static files
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/feed", feedRoutes);
// app.use("/auth", authRoutes);
// app.use("/status", statusRoutes);
//http://localhost:5000/graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true, //special tool to test API
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.originalError.message || "An error occurred";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  }),
);

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
