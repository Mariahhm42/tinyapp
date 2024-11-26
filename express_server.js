const express = require("express");
const app = express();
const PORT = 8080; // defines the default port 8080 the app will listen to

app.set("view engine", "ejs"); // sets up EJS as the templating engine
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // shortURL => longURL mapping
  "9sm5xK": "http://www.google.com" // another shortURL => longURL mapping
};

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Function to generate 6-character random alphanumeric string
// This will be used as the short URL ID
function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // all the possible characters
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length)); // picks a random character
  }
  return result; // returns the generated random string
}

// POST route to handle form submission for creating new short URLs
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate the short URL ID
  const longURL = req.body.longURL; // Extract the long URL from the request body
  
  urlDatabase[shortURL] = longURL; // saves long & short URLs in the database
  
  res.redirect(`/urls/${shortURL}`); // redirects to /urls/:id and shows the new URL that is being created
});

// GET route handler for /urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET route to return the URL database as a JSON object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // Return the urlDatabase as JSON
});

// ROUTE TO SHOW THE FORM (GET /urls/new)
app.get("/urls/new", (req, res) => {
  res.render("urls_new"); // Render the form for entering a new URL
});

// GET route to show the URL details (GET /urls/:id)
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // Get the short URL ID from the URL parameter
  const longURL = urlDatabase[shortURL]; // Look up the long URL from the database

  if (longURL) {
    // Pass shortURL and longURL to the template
    res.render("urls_show", { shortURL, longURL });
  } else {
    res.status(404).send("URL not found.");
  }
});

// New GET route to handle short URL requests and redirect to the long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id; // Get the short URL ID from the URL parameter
  const longURL = urlDatabase[shortURL]; // Look up the long URL in the database

  if (longURL) {
    // If the long URL exists, redirect to the long URL
    res.redirect(longURL);
  } else {
    // If the short URL doesn't exist, send a 404 error
    res.status(404).send("Short URL not found.");
  }
});

// POST Route that removes a URL resource: (POST /urls/:id/delete)
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id; // Extract the short URL ID from the route parameter
  delete urlDatabase[shortURL]; // Delete the short URL from the urlDatabase
  res.redirect("/urls"); // Redirect the client back to the URLs index page
});

// POST route that handles editing (POST /urls/:id)
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;

  urlDatabase[shortURL] = newLongURL; // Updates the long URL in the database
  res.redirect("/urls"); // Redirects to the URLs index after update
});

// Start the server
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
