const express = require('express');
const axios = require('axios');
const router = express.Router();

const booksDB = require("./booksdb"); // Import local books data

// 📌 **Task 13: Get book details by Title using Async-Await**
router.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;

    try {
        console.log(`📢 Fetching books by title: ${title}`);

        // Simulate an external API call (replace with real API if needed)
        const response = await axios.get(`https://example.com/api/books?title=${title}`);
        const externalBooks = response.data || [];

        // Filter books from local database
        const localBooks = Object.values(booksDB).filter(book => book.title === title);

        // Merge both sources if needed
        const allBooks = [...localBooks, ...externalBooks];

        if (allBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }

        console.log("✅ Books fetched successfully!");
        res.status(200).json(allBooks);
    } catch (error) {
        console.error("❌ Error fetching books:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
