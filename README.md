# TinyApp Project

TinyApp is a full-stack web application built with Node.js and Express that allows users to shorten long URLs (similar to bit.ly). Users can create, manage, and delete their own collection of shortened URLs once they register and log in.

### ACKNOWLEDGEMENT 
**_ This project was created and published as part of my learnings at Lighthouse Labs.**

**_BEWARE:_ This library was published for learning purposes. It is _not_ intended for use in production-grade software.**

## Purpose 
TinyApp is a simple multipage app:

- with authentication protection

- that reacts appropriately to the user's logged-in state,

- and permits the user to create, read, update, and delete (CRUD) a simple entity (e.g. blog posts, URL shortener).

## Features

- **User Registration & Login**: 
  - Users can register with an email and password.
  - Passwords are encrypted using bcrypt.
  - Sessions are managed using cookies.

- **URL Shortening**:
  - Authenticated users can create new short URLs for any long URL.
  - Short URLs redirect users to their corresponding long URLs.

- **URL Management**:
  - View all URLs created by the logged-in user.
  - Edit or delete existing URLs.

- **Permissions**:
- Users can only view, edit, or delete URLs they created.
- Non-logged-in users are redirected to the login page.

### Dependencies
- Node.js
- npm
- Express
- EJS
- bcrypt
- cookie-parser
- cookie-session

### Installation & Setup

1. Clone the repository:
   `git clone https://github.com/Mariahhm42/tinyapp.git`

2. Install dependencies:
  `npm install`

3. Start the server:
  `npm start`

4. Open your browser and navugate to:
`http://localhost:8080`

### Homepage
http://localhost:8080

### URL List
http://localhost:8080/urls

### Create a New URL
http://localhost:8080/urls/new


