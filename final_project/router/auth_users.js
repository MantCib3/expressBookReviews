const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
username.some(user => user.username === username);
};
const authenticatedUser = (username,password)=>{
const user = users.find(user => user.username === username)
return user && user.password === password; 
};
//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!username || !password ) {
  return res.status(400).json({message:"Username and Password are required."})
  }
  if (!isValid(username)) {
    return res.status(401).json({message:"Invalid Username."})
  }
  if (!authenticatedUser(username,password)){
    return res.status(401).json({message:"Invalid Password."})
  }
  const token= jwt.sign({ username }, 'your-secret-key', {expiresIn: '1h' })
  return res.status(200).json({message: "Success.", token});
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.ibsn === ibsn);
   if (!book){
    return res.status(404).json({message:"Book not found."})
   }
   const { reviewer, comment } = req.body
    if (!reviewer||!comment){
        return res.status(400).json({message:"User and comment required"})
    }
    if (!book.reviews) {
        book.reviews = {};
    }
    book.reviews[reviewer] = comment;
    return res.status(200).json({message:"Review added successfully", review:book.reviews});
});
                                                                            
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
