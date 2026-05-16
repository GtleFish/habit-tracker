import express from "express";
import { getAllLogs, createLog } from "../controllers/logs.controller.js";

const router = express.Router();

router.get("/", getAllLogs);
router.post("/", createLog);

export default router;