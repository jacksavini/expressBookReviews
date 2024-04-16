const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

function findBook(prop, val) {
  if(prop == "isbn"){
    return [books[val]]
  }

  let retBooks = []
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book[prop] == val ) {
        retBooks.push(book)
      }
    }
  }
  return retBooks; // Book not found
}

public_users.post("/register", (req,res) => {
  const { username, password} = req.body

  if(!username || !password){
    return res.status(400).json({ message: "Username and password are required" });
  }

  if(username.hasOwnProperty(username)){
    return res.status(400).json({ message: "Username already exists"})
  }

  users[username] = password

  res.status(201).json({ message: "User Registered successfully!"})

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const fetchedBooks = await fetchBooks();
    return res.status(200).json({ books: fetchedBooks });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await findBookAsync("isbn", isbn);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch book details" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const books = await findBookAsync("author", author);
    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "Books not found for the author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const books = await findBookAsync("title", title);
    if (books.length > 0) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "Books not found with the title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Define the asynchronous version of findBook function
function findBookAsync(prop, val) {
  return new Promise((resolve, reject) => {
    if(prop == "isbn"){
      resolve([books[val]])
    }
    let retBooks = [];
    for (const key in books) {
      if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book[prop] == val) {
          retBooks.push(book);
        }
      }
    }
    resolve(retBooks);
  });
}

// Define the asynchronous version of fetchBooks function
async function fetchBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = findBook(prop="isbn", val=isbn)

  if (book.length > 0) {
    return res.status(200).json(book[0].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
