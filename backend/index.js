const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const fs = require('fs');

let data;

fs.readFile("./json/users.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  data = jsonString;
  console.log("File data:", jsonString);
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(data);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



// console.log(user);