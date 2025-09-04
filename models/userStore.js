// models/userStore.js
const users = [];

module.exports = {
  addUser: (user) => users.push(user),
  findUser: (email) => users.find((u) => u.email === email),
};
