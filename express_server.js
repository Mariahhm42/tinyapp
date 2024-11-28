const express = require("express");
const app = express();
const PORT = 8080; // defines the default port 8080 the app will listen to

app.set("view engine", "ejs"); // sets up EJS as the templating engine
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Routes

// GET /urls: Display all URLs
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], // username from cookies
    urls: urlDatabase, // URL data
  };
  res.render("urls_index", templateVars);
});

// GET /urls/new: Show form to create a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

// GET /urls/:id: Show details for a specific URL
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    username: req.cookies["username"],
    shortURL,
    longURL,
  };

  if (!longURL) {
    return res.status(404).send("URL not found.");
  }

  res.render("urls_show", templateVars);
});

// GET /u/:id: Redirect to the long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (!longURL) {
    return res.status(404).send("Short URL not found.");
  }

  res.redirect(longURL);
});

// POST /urls: Create a new short URL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// POST /urls/:id/delete: Delete a URL
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// POST /urls/:id: Update a URL
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect("/urls");
});

// POST /login: Handle login
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

// POST /logout: Handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// GET route to serve the registration page
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], // Add username if logged in
  };
  res.render("register", templateVars);
});

// Start the server
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
