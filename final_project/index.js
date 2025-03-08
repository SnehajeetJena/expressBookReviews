const express = require("express");
const { regd_users } = require("./auth_users");
const { getAllBooks, getBookByISBN, getBookByAuthor, getBookByTitle } = require("./general");

const app = express();
const PORT = 5000;

app.use(express.json());

const books = {
    1: { title: "Book One", author: "Author One", reviews: [] },
    2: { title: "Book Two", author: "Author Two", reviews: [] },
};

// ✅ Route to get all books
app.get("/books", (req, res) => {
    res.json(books);
});

// ✅ Route to get book by ISBN
app.get("/books/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// ✅ Route to get book by Author
app.get("/books/author/:author", (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// ✅ Route to get book by Title (Task 13)
app.get("/books/title/:title", (req, res) => {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

app.use("/customer", regd_users);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
