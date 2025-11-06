import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import doctorRoutes from "./routes/doctorRoutes.js";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/doctorsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

app.use("/api/doctors", doctorRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
