import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyToken from "../middleware/authenticateToken.js";
const router = express.Router();
const prisma = new PrismaClient();

// Create a review for a book by a user
router.post("/", verifyToken, async (req, res) => {
  const { rating, comment, bookId } = req.body;
  const userId = req.user.userId;

  try {
    const review = await prisma.review.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        rating,
        comment,
        createdAt: new Date(), // optional: to update timestamp on edit
      },
      create: {
        rating,
        comment,
        userId,
        bookId,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Review upsert failed:", error);
    res.status(500).json({ error: "Failed to submit review." });
  }
});

// Get all reviews for a book
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.userId; // comes from token

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        book: true, // this includes book details with each review
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(reviews);

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch your reviews." });
  }
});
// Delete a review
router.delete("/:id", verifyToken, async (req, res) => {
  const reviewId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    // Check if the review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    console.log(userId);

    if (!review || review.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized or review not found." });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Fetch updated list of reviews
    const updatedReviews = await prisma.review.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Review deleted successfully.",
      reviews: updatedReviews,
    });
  } catch (error) {
    console.error("Failed to delete review:", error);
    res.status(500).json({ error: "Failed to delete review." });
  }
});

export default router;
