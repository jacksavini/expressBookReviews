const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(users[username] == password) return true;
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and credentials are valid
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    req.session.accessToken = token;
    req.session.username = username;

    // Return the token
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;
  console.log(username)

  // Check if review and username are provided
  if (!review || !username) {
    return res.status(400).json({ message: "Review and username are required" });
  }

  // Check if the book exists in the database
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the current user has already reviewed the book
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review for the book
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  // Check if review and username are provided
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Check if the book exists in the database
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the current user has already reviewed the book
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // Modify the existing review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted" });
  } else {
    return res.status(201).json({ message: "There is no review to delete" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
