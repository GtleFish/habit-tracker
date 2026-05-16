import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json([]);
});

router.post("/", (req, res) => {
  res.json({ message: "habit created" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "habit deleted" });
});

export default router;