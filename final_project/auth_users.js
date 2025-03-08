const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const regd_users = express.Router();
regd_users.use(bodyParser.json());

const secretKey = "your_secret_key";
const users = {};

const books = {
    1: { title: "Book One", author: "Author One", reviews: [] },
    2: { title: "Book Two", author: "Author Two", reviews: [] },
};

// ✅ Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users[username] = { password };
    res.status(201).json({ message: "User registered successfully" });
});

// ✅ Login and get JWT token
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
});

// ✅ Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// ✅ Add/Modify a Review
regd_users.post("/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const { review } = req.body;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
    if (existingReviewIndex !== -1) {
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        books[isbn].reviews.push({ username, review });
        return res.status(201).json({ message: "Review added successfully" });
    }
});

// ✅ Delete Review (Only user's own review)
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

    const updatedReviews = books[isbn].reviews.filter(r => r.username !== username);
    if (books[isbn].reviews.length === updatedReviews.length) {
        return res.status(404).json({ message: "No review found to delete" });
    }

    books[isbn].reviews = updatedReviews;
    res.status(200).json({ message: "Review deleted successfully" });
});

module.exports = { regd_users };
