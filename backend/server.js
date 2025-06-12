// const express = require("express");
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import Users from "./routes/user.js";
import Books from "./routes/books.js";
import Reviews from "./routes/reviews.js";
const app = express();
const prisma = new PrismaClient();
// Middleware to parse JSON request bodies
app.use(
  cors({
    origin: "https://bookmemory.netlify.app", // allow only Vite frontend
    credentials: true,
  })
);
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Hello, BookBuddy API!");
});
app.use("/users", Users);
app.use("/books", Books);
app.use("/reviews", Reviews);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
