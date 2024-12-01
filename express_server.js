const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // defines the default port 8080 the app will listen to

//Middleware
app.set("view engine", "ejs"); // sets up EJS as the templating engine
app.use(cookieSession);
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

//Databases
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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

///Helpers function
// Function to generate 6-character random alphanumeric string
const generateRandomString = () => {
  const chars = 
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]).join("");
};
//helper function to check if the email already exists in the users object
const findUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};
// helper function that Filters the URL database to return only the URLs that belong to the logged-in user.
const urlsForUser = (id) => {
  const filteredURLs = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      filteredURLs[urlId] = urlDatabase[urlId];
    }
  }
  return filteredURLs;
};

//------>  Routes  <-------//

// Homepage redirect
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// GET /urls: Display all URLs for the logged-in user
app.get("/urls", (req, res) => {
  const userId = req.session.user_id; // Retrieves the user ID from the cookies
  if (!userId) {
    return res.status(401).send("Please log in to view your URLs.");
  }
  // Retrieves the URLs specific to the logged-in user
  const userURLs = urlsForUser(userId);
  const templateVars = { user: users[userId], urls: userURLs };
  res.render("urls_index", templateVars);
});

// GET /urls/new: Show form to create a new URL (restricted to users that are logged in)
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect("/login"); //Redirects to login if not logged in
  }
  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});

// GET /urls/:id: Show details for a specific URL
app.get("/urls/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.session.user_id;
  const url = urlDatabase[id];
  if (!url) {
    return res.status(404).send("Short URL not found.");
  }
  if (!userId) {
    return res.status(401).send("Please log in to view this URL.");
  }
  // Check if the logged-in user is the owner of the URL
  if (url.userID !== userId) {
    return res.status(403).send("You do not have permission to access this URL.");
  }
  const templateVars = { 
    user: users[userId], 
    shortURL: 
    id, longURL: 
    url.longURL };
  res.render("urls_show", templateVars);
});

// /u/:id: Redirect to the long URL corresponding to the short URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
    return res.status(404).send("Short URL not found.");  // Handle missing URL
  }
  res.redirect(longURL.longURL);  // Redirects to the original long URL
});

// POST /urls: Creates a new short URL
app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(401).send("Please log in to create URLs.");
  }

  const shortURL = generateRandomString(); // Generate a new random short URL
  urlDatabase[shortURL] = { // Store the URL with the userID
    longURL: req.body.longURL, 
    userID: userId };
  res.redirect(`/urls/${shortURL}`);
});

// POST /urls/:id/delete: Delete a URL (restricted to creator of the URLs)
app.post("/urls/:id/delete", (req, res) => {
  const { id } = req.params;
  const userId = req.session.user_id;
  const url = urlDatabase[id];
  if (!url) {
    return res.status(404).send("Short URL not found.");
  }
  // Ensure the logged-in user is the owner
  if (url.userID !== userId) {
    return res.status(403).send("You do not have permission to delete this URL.");
  }
  delete urlDatabase[id]; //deletes the URL from database
  res.redirect("/urls");
});

// POST /urls/:id: Update a URL
app.post("/urls/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.session.user_id;
  const url = urlDatabase[id];

  if (!url) {
    return res.status(404).send("Short URL not found.");
  }
  // Ensure the logged-in user is the owner
  if (url.userID !== userId) {
    return res.status(403).send("You do not have permission to edit this URL.");
  }
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect("/urls");
});

// GET route to serve the registration page
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const templateVars = { user: users[userId] };
  res.render("register", templateVars);
});

// POST route to handle user registration
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty!");
  }
  if (findUserByEmail(email, users)) {
    return res.status(400).send("Email is already registered.");
  }
  const userId = generateRandomString(); // Generate a unique user ID
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password for security
  users[userId] = { // Add new user to the database
    id: userId, 
    email, 
    password: hashedPassword 
  }; 
  res.cookie("user_id", userId); // Set the user's ID in the cookie
  res.redirect("/urls");
});

//GET route to handle login (Show login page)
app.get("/login", (req, res) => {
  const userId = req.session.user_id;
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
  res.cookie("user_id", user.id); // Set the user's ID in the cookie
  res.redirect("/urls");
});

// Updated POST /logout: Handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id"); // Clear the user_id cookie
  res.redirect("/login"); // Redirect the user to the login page after logout
});

// Start the server
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`); 
});