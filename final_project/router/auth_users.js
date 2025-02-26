const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userwithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userwithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
const authenticatedUser = (username,password)=>{
const user = users.find(user => user.username === username)
return user && user.password === password; 
};
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 20 });
        req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).send("Incorrect Login. Check credentials");
    }
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
   if (!book){
    return res.status(404).json({message:"Book not found."})
   }
   const { reviewer, comment } = req.body
    if (!reviewer||!comment){
        return res.status(400).json({message:"User and comment required"})
    }
    
    book.reviews[reviewer] = comment;
    return res.status(200).json({message:"Review added successfully", review:book.reviews});
});
                                                                            
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
