import express from "express";
import { connectDB } from "./database/mongoConnection.js";
import dotenv from "dotenv"
dotenv.config()
const app = express()


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
    connectDB();
});