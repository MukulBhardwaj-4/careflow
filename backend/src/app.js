import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import nurseRoutes from "./routes/nurseRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { initializeSocket } from "./services/socketService.js";
import { inngestHandler } from "../inngest.server.js";

export const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Inngest handler (for background jobs)
app.use("/api/inngest", inngestHandler);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/nurse", nurseRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "CareFlow AI Backend" });
});

// Error handler (must be last)
app.use(errorHandler);

export { initializeSocket };