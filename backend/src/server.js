// const express = require("express"); // type = commonjs
import express from "express" // type = module
import cors from "cors";
import dotent from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import path from "path";

dotent.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()

// middleware
if (process.env.NODE_ENV !== "production") {
    
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

app.use(express.json()); // parse json
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("SERVER STARTED ON PORT", PORT);
    });
});
