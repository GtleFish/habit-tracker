import express from "express";
import { getHabits, createHabit, deleteHabit } from "../controllers/habits.controller.js";

const router = express.Router();

router.get("/", getHabits);
router.post("/", createHabit);
router.delete("/:id", deleteHabit);

export default router;
