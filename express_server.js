const express = require("express");
const app = express();
const PORT = 8080; // defines the default port 8080 the app will listen to

app.set("view engine", "ejs"); //sets up EJS as the templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // shortURL => longURL mapping
  "9sm5xK": "http://www.google.com" // another shortURL => longURL mapping
};
//middleware to parse form data
app.use(express.urlencoded({ extended: true }));
//function to generate 6-character random alphanumeric string
//this will e used as the short URL ID
function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // all the possible character
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));//picks a random character
  }
  return result; //returns the generated random string
}

//POST route to handle form submission
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate the short URL ID
  const longURL = req.body.longURL; // Extract the long URL from the request body
  
  urlDatabase[shortURL] = longURL; //saves long&shortURLs in the database
  
  res.redirect(`/urls/${shortURL}`)//redirects to rrl/i:d and shwos the new url that is being created
});

//route handler for /urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
   
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// GET route to return the URL database as a JSON object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // Return the urlDatabase as JSON
});

//ROUTE TO SHOW THE FORM (GET /URLS/NEW)
app.get("/urls/new", (req, res) => {
  res.render("urls_new"); // Render the form for entering a new URL
});

//Route to show the URL details (GET /urls/:id)
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id; // Get the short URL ID from the URL parameter
  const longURL = urlDatabase[shortURL]; // Look up the long URL from the database

  if (longURL) {
    // If the short URL exists, render the details page with both short and long URLs
    res.render("urls_show", { shortURL, longURL });
  } else {
    // If the short URL doesn't exist, send a 404 error
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

//starts the server
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
}); 

// console.log(`Generated short URL: ${shortURL}, Long URL: ${longURL}`); // Log the POST request body to the console
  // res.send("Short URL generated!"); // placeholder