import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../middleware/authenticateToken.js";
const prisma = new PrismaClient();
const router = express.Router();

// Create a new book
router.post("/books", async (req, res) => {
  const { title, author } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Book creation failed" });
  }
});

// Get all books
router.get("/", verifyToken, async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch books" });
  }
});

export default router;
