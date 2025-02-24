const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const { username, password } = req.body;
   if (!username || !password){
    return res.status(400).json({message:"Username and Password are required."})
   }
   
const userExists = user.find (user => user.username === username)
    if (userExists)() => {
        return res.status(409).json({message:"User already exists."})
}
const newUser = { username, password }; {
   users.push(newUser);
   return res.status(200).json({message:"Successfully registered"})
}
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const booksString = JSON.stringify(books, null, 2);
  return res.status(200).send(booksString);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
 if (book) {
  return res.status(200).json(book);
 } else {
    return res.status(404).json ({message:"No such book exists."})
 }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingAuthor = books.filter(book => book.author.toLowerCase()===author.toLowerCase())
 if (mathchingAuthor.length > 0) {
    return res.status(200).json(matchingAuthor);
 }
 else {
    return res.status(404).json ({message: "No such author exists."})
 }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const matchingTitle = books.filter(book => book.title.toLowerCase()===title.toLowerCase())
   if (!title) { return res.status(400).json({message:"no search query"})}
  if (matchingTitle.length > 0) {
      return res.status(200).json(matchingTitle);
   }
   else 
    return res.status(404).json({message: "there is no such title"})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
   if(!book) {
    return res.status(400).json({message:"No such book."})
  }
  if (book.review && Object.keys(book.reviews).length > 0) {
    return res.status(200).json(book.reviews)
  }
  else {
  return res.status(404).json({message: "No reviews for this book."});
  }
});

module.exports.general = public_users;
