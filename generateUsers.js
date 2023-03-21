const axios = require("axios");
const rand = require("randomstring");

const url = "http://localhost:3000/user/register";

for (let i = 0; i < 50; i++) {
  var r = rand.generate(7);
  axios.post(url, { username: r, email: r + "@mail.com", password: r });
  console.log(`User ${r} created`);
}
