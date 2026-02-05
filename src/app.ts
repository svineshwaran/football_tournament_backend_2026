import "reflect-metadata";
import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

export default app;
