const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //sets up EJS as the templating engine

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
//routes for urls
app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });
   
app.get("/", function(req, res) { // a callback function that takes in two parameters: a request (req), and a response (res).
  res.send("Hello!");
});

app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, 
        longURL: urlDatabase[req.params.id] }; //Retrieve the long URL for the given short URL ID
    res.render("urls_show", templateVars);
  });
  

  
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    const templateVars = { greeting: "Hello World!" };
    res.render("hello_world", templateVars);
  });

//starts the server
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
}); 