const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // defines the default port 8080 the app will listen to

//Middleware
app.set("view engine", "ejs"); // sets up EJS as the templating engine
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

//Databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Global user object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
};

///Helpers
// Function to generate 6-character random alphanumeric string
const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const findUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

//------>  Routes  <-------//

// Homepage redirect
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// GET /urls: Display all URLs
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const templateVars = { user, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET /urls/new: Show form to create a new URL
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) return res.redirect("/login");

  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});

// GET /urls/:id: Show details for a specific URL
app.get("/urls/:id", (req, res) => {
  const { id } = req.params;
  const longURL = urlDatabase[id];
  if (!longURL) return res.status(404).send("Short URL not found.");

  const userId = req.cookies.user_id;
  const templateVars = { user: users[userId], shortURL: id, longURL };
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
  const userId = req.cookies.user_id;
  if (!userId) return res.status(401).send("Please log in to create URLs.");

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// POST /urls/:id/delete: Delete a URL
app.post("/urls/:id/delete", (req, res) => {
  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// POST /urls/:id: Update a URL
app.post("/urls/:id", (req, res) => {
  const { id } = req.params;
  const { longURL } = req.body;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
});

// GET route to serve the registration page
app.get("/register", (req, res) => {
  const userId = req.cookies.user_id;
  const templateVars = { user: users[userId] };
  res.render("register", templateVars);
});

// POST route to handle user registration
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and Password cannot be empty!");
  }

  if (findUserByEmail(email, users)) {
    return res.status(400).send("Email is already registered!");
  }

  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[userId] = { id: userId, email, password: hashedPassword };
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

//GET route to handle login
app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  const templateVars = { user: users[userId] };
  res.render("login", templateVars);
});

// POST /login: Handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email, users);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid email or password.");
  }

  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// POST /logout: Handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Start the server
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`); // Corrected syntax
});


