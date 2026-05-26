import express from "express";
import cors from "cors";

import habitsRoutes from "./routes/habits.routes.js";
import logsRoutes from "./routes/logs.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/habits", habitsRoutes);
app.use("/api/logs", logsRoutes);

export default app;