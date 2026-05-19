import express from "express";
import { getLogs, createLog, updateLog, deleteLog } from "../controllers/logs.controller.js";

const router = express.Router();

router.get("/", getLogs);
router.post("/", createLog);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;
