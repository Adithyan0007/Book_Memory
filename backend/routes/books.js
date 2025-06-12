import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../middleware/authenticateToken.js";
const prisma = new PrismaClient();
const router = express.Router();

// Create a new book
router.post("/", async (req, res) => {
  const { title, author, imageUrl, description } = req.body;
  console.log(title);

  try {
    // Create the new book
    await prisma.book.create({
      data: {
        title,
        author,
        imageUrl,
        description,
      },
    });

    // Fetch updated list of books
    const updatedBooks = await prisma.book.findMany();

    // Send updated book list as response
    res.status(201).json(updatedBooks);
  } catch (error) {
    console.error("Book creation failed:", error);
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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, imageUrl, description } = req.body;
  try {
    const updated = await prisma.book.update({
      where: { id: Number(id) },
      data: { title, author, imageUrl, description },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update book" });
  }
});
// DELETE /books/:id
router.delete("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    // Check if the book exists
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the book
    await prisma.book.delete({ where: { id: bookId } });

    // Fetch the updated book list
    const updatedBooks = await prisma.book.findMany();

    // Return updated book list
    res.status(200).json(updatedBooks);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
