//helper function to check if the email already exists in the users object
const getUserByEmail = function(email, database) {
    for (const userId in database) {
      const user = database[userId];
      if (user.email === email) {
        return user;
      }
    }
    return undefined; // Ensure undefined is returned explicitly
  };
  
  module.exports = { getUserByEmail };