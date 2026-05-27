import express from "express";
import { getAllLogs, createLog, deleteLog } from "../controllers/logs.controller.js";

const router = express.Router();

router.get("/", getAllLogs);
router.post("/", createLog);
router.delete("/", deleteLog);

export default router;
