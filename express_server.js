const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //sets up EJS as the templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//middleware
app.use(express.urlencoded({ extended: true }));

//generate 6-character random alphanumeric string
function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

//route handler for /urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
   
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id] // Retrieves the long URL using the id
  };
  res.render("urls_show", templateVars);
});
//POST route to handle form submission
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate the short URL ID
  const longURL = req.body.longURL; // Extract the long URL from the request body
  console.log(`Generated short URL: ${shortURL}, Long URL: ${longURL}`); // Log the POST request body to the console
  res.send("Short URL generated!"); // placeholder
});

//starts the server
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
}); 