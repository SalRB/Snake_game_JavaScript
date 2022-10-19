const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
// const fs = require('fs');

// let data;
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());
// fs.readFile("./json/users.json", "utf8", (err, jsonString) => {
//   if (err) {
//     console.log("File read failed:", err);
//     return;
//   }
//   data = jsonString;
//   console.log("File data:", jsonString);
// });

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end(data);
// });

app.use(require('./router'));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods', 'Content-Type', 'Authorization');
  next();
})