const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password are required." });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists." });
  }

  const newUser = { username, password };
  users.push(newUser);
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop (using async/await, existing)
public_users.get('/', async (req, res) => {
  try {
    const getBooksPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books && books.length > 0) {
          resolve(books);
        } else {
          reject(new Error('No books available'));
        }
      }, 100); // Simulate async delay
    });

    const booksList = await getBooksPromise;
    const booksString = JSON.stringify(booksList, null, 2);
    return res.status(200).send(booksString);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on ISBN (using async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const getBookPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const isbn = req.params.isbn;
        const book = books.find(b => b.isbn === isbn);
        if (book) {
          resolve(book);
        } else {
          reject(new Error('No such book exists'));
        }
      }, 100); // Simulate async delay
    });

    const book = await getBookPromise;
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    if (error.message === 'No such book exists') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error retrieving book", error: error.message });
  }
});

// Get book details based on author (using async/await)
public_users.get('/author/:author', async (req, res) => {
  try {
    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const author = req.params.author;
        const matchingAuthor = books.filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (matchingAuthor.length > 0) {
          resolve(matchingAuthor);
        } else {
          reject(new Error('No such author exists'));
        }
      }, 100); // Simulate async delay
    });

    const matchingAuthor = await getBooksByAuthorPromise;
    return res.status(200).json(matchingAuthor);
  } catch (error) {
    console.error('Error fetching books by author:', error);
    if (error.message === 'No such author exists') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error retrieving books by author", error: error.message });
  }
});

// Get all books based on title (using async/await)
public_users.get('/title/:title', async (req, res) => {
  try {
    const getBooksByTitlePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const title = req.params.title;
        const matchingTitle = books.filter(book => book.title.toLowerCase() === title.toLowerCase());
        if (!title) {
          reject(new Error('No search query'));
        } else if (matchingTitle.length > 0) {
          resolve(matchingTitle);
        } else {
          reject(new Error('There is no such title'));
        }
      }, 100); // Simulate async delay
    });

    const matchingTitle = await getBooksByTitlePromise;
    return res.status(200).json(matchingTitle);
  } catch (error) {
    console.error('Error fetching books by title:', error);
    if (error.message === 'No search query' || error.message === 'There is no such title') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error retrieving books by title", error: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(400).json({ message: "No such book." });
  }
  if (book.reviews && Object.keys(book.reviews).length > 0) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews for this book." });
  }});

module.exports = public_users;
