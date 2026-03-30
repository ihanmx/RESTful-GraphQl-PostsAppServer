import express from "express";
import { getStatus, updateStatus } from "../controllers/status.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", isAuth, getStatus);

router.put("/", isAuth, updateStatus);
export default router;
