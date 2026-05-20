import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middleware/error.middleware.js";

import habitsRoutes from "./src/routes/habits.routes.js";
import logsRoutes from "./src/routes/logs.routes.js";

const app = express();

app.use(cors());
// app.use(cors({
//   origin: 'https://fake-domain123.com'  // domain giả, không phải localhost
// }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/habits", habitsRoutes);
app.use("/api/logs", logsRoutes);

app.use(errorHandler);

export default app;
