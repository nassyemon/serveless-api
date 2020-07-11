const axios = require('axios');

module.exports = (token) => axios.create({
  baseURL: "https://api.github.com",
  timeout: 30*1000,
  headers: {
    Authorization: `token ${token}`,
    'user-agent': 'node.js'
  },
});