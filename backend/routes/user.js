import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/authenticateToken.js";

const SECRET_KEY = "Adithyan";
const prisma = new PrismaClient();
const router = express.Router();
router.get("/", (req, res) => {
  res.status(201).json({ message: "all user list" });
});
//add user
router.post("/add", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    res.status(401).json({ error: "Email already exists" });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "User creation failed" });
  }
});

// Get user Profile
router.get("/profile", verifyToken, async (req, res) => {
  console.log("hiiiii");

  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          include: {
            book: true, // includes book details in each review
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compute optional stats
    const totalReviews = user.reviews.length;
    const avgRating =
      totalReviews > 0
        ? (
            user.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
            totalReviews
          ).toFixed(2)
        : null;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      reviews: user.reviews,
      stats: {
        totalReviews,
        avgRating,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Unable to fetch user profile" });
  }
});

//user authentication
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({ message: "Login successful", token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});
export default router;
