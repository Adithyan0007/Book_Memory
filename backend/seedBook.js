import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

async function fetchBooks(query) {
  const res = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
  return res.data.docs.slice(20, 40); // Limit books per topic
}

async function seedBooks() {
  const topics = [
    "harry potter",
    "romance",
    "science fiction",
    "fantasy",
    "history",
  ];

  for (const topic of topics) {
    const books = await fetchBooks(topic);

    for (const book of books) {
      const title = book.title || "Unknown Title";
      const author = book.author_name?.[0] || "Unknown Author";
      const imageUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null;
      const description = `First published in ${
        book.first_publish_year || "N/A"
      }`;
      console.log(book);

      try {
        await prisma.book.create({
          data: {
            title,
            author,
            imageUrl,
            description,
          },
        });

        console.log(`✅ Inserted: ${title}`);
      } catch (error) {
        console.log(`⚠️ Skipped: ${title}`);
      }
    }
  }

  await prisma.$disconnect();
}

seedBooks();
