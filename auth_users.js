const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = "your_secret_key";  // Replace with a strong secret key

// 🔹 Predefined users for testing
let users = { "testuser": "password123" };  
let books = require("./booksdb"); // Ensure this file exists and exports books data

// 🔐 Middleware: Authenticate Token
function authenticateToken(req, res, next) {
    console.log("Headers Received:", req.headers); // Debugging

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No authorization header provided" });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token found" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        req.user = user; // Attach user data to request
        next();
    });
}

// 📌 **User Login Route**
router.post('/customer/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username] || users[username] !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
});

// 📌 **Add or Modify a Review (Authenticated)**
router.put('/auth/review/:isbn', authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;  // 🔹 Use req.body instead of query

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const username = req.user.username; // Extract username from token

    // Ensure reviews exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = [];
    }

    let bookReviews = books[isbn].reviews;
    const existingReviewIndex = bookReviews.findIndex(r => r.username === username);

    if (existingReviewIndex !== -1) {
        bookReviews[existingReviewIndex].review = review;
    } else {
        bookReviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added/updated successfully", reviews: bookReviews });
});

// 📌 **Delete a Review (Authenticated)**
router.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username; // Extract username from token

    console.log(`📌 DELETE request received for ISBN: ${isbn} by user: ${username}`);

    // Check if the book exists
    if (!books[isbn]) {
        console.log("❌ Book not found");
        return res.status(404).json({ message: "Book not found" });
    }

    let bookReviews = books[isbn].reviews || [];

    console.log("📖 Existing Reviews:", bookReviews);

    // Filter out only the user's review
    const filteredReviews = bookReviews.filter(r => r.username !== username);

    // If no review was deleted, return an error
    if (filteredReviews.length === bookReviews.length) {
        console.log("⛔ User review not found");
        return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    // Update the book's reviews
    books[isbn].reviews = filteredReviews;
    console.log("✅ Review deleted:", filteredReviews);

    return res.status(200).json({ message: "Review deleted successfully", reviews: filteredReviews });
});


module.exports = { router, authenticateToken };
