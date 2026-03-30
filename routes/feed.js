import express from "express";
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/feed.js";
import { body } from "express-validator";
import multer from "multer";
import isAuth from "../middleware/isAuth.js";
import { init as initSocket } from "../config/socket.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];
  cb(null, allowed.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter });

const router = express.Router();

//Get /feed/posts

router.get("/posts", isAuth, getPosts);

router.post(
  "/post",
  isAuth,
  upload.single("image"),
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost,
);

router.get("/post/:postId", isAuth, getPost);

router.put(
  "/post/:postId",
  isAuth,
  upload.single("image"),
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost,
);

router.delete(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  deletePost,
);

export default router;
