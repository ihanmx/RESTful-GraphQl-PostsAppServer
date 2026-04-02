import "dotenv/config";
import express from "express";
import auth from "./middleware/auth.js";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; //to get __dirname in ES modules
import { init as initSocket } from "./config/socket.js";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import graphqlSchema from "./graphql/schema.js";
import graphqlResolver from "./graphql/resolvers.js";
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5000;

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err)); //delete the file
};

app.use(cors(corsOptions));

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];
  cb(null, allowed.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter });

//static files
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(auth);

app.use("/post-image", upload.single("image"), (req, res, next) => {
  if (!req.isAuth) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  const imageUrl = req.file.path.replace(/\\/g, "/");
  res.status(201).json({ message: "File stored", imageUrl: imageUrl });
});

app.use((req, res, next) => {
  if (req.path === "/graphql" && req.method === "POST") {
    console.log("GraphQL body:", JSON.stringify(req.body));
  }
  if (req.method === "OPTIONS") {
    //handles option req from browser to avoid graphQl err and must be before graph middleware
    return res.sendStatus(200);
  }
  next();
});

//http://localhost:5000/graphql
// GraphiQL UI
app.get("/graphql", (req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// GraphQL endpoint
app.use(
  "/graphql",
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    context: (req) => ({ req: req.raw }), //the way we use req in graphql-http
    formatError(err) {
      console.log("GraphQL Error:", err.message, err.originalError);
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
