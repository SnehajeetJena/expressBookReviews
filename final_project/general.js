const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// ✅ Get all books (Task 10)
const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/books`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
};

// ✅ Get book by ISBN (Task 11)
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`${BASE_URL}/books/${isbn}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by ISBN:", error.message);
    }
};

// ✅ Get book by Author (Task 12)
const getBookByAuthor = async (author) => {
    try {
        const response = await axios.get(`${BASE_URL}/books/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by Author:", error.message);
    }
};

// ✅ Get book by Title (Task 13)
const getBookByTitle = async (title) => {
    try {
        const response = await axios.get(`${BASE_URL}/books/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by Title:", error.message);
    }
};

// Example usage for testing
getAllBooks();
getBookByISBN(1);
getBookByAuthor("Author One");
getBookByTitle("Book One"); // Replace with the desired title for testing

module.exports = { getAllBooks, getBookByISBN, getBookByAuthor, getBookByTitle };
