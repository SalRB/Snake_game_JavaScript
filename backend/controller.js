// Uses node fs to read and write a json file
const fs = require('fs');

// Reads all the users
exports.getUsers = async (req, res) => {

    fs.readFile("./db/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
        }
        res.json(jsonString);
    });
}

// Returns a user data if the login data is correct
exports.getUser = async (req, res) => {
    fs.readFile("./db/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
        }
        let result = JSON.parse(jsonString);
        let results;

        for (var i = 0; i < result.length; i++) {
            if ((result[i]['email'].indexOf(req.body.email) != -1) && (result[i]['password'].indexOf(req.body.password) != -1)) {
                results = result[i];
                i = result.length;
            }
        }
        if (results) {
            res.json(results);
        } else {
            res.json('Wrong password');
        }
    });
}

// Adds a user 
exports.addUser = async (req, res) => {
    fs.readFile("./db/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
        }
        jsonString = JSON.parse(jsonString);
        jsonString.push(req.body);
        jsonString = JSON.stringify(jsonString);

        fs.writeFile("./db/users.json", jsonString, "utf8", (err) => {
            if (err) throw err;
            res.json('User created successfully');
        });

    });
}

// Updates a user's score if is higher than the previous one
exports.updateScore = async (req, res) => {

    fs.readFile("./db/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
        }
        jsonString = JSON.parse(jsonString);

        for (var i = 0; i < jsonString.length; i++) {
            if ((jsonString[i]['email'].indexOf(req.body.email) != -1) && (jsonString[i]['score'][req.body.difficulty] < req.body.score)) {
                jsonString[i]['score'][req.body.difficulty] = req.body.score;

                jsonString = JSON.stringify(jsonString);
                fs.writeFile("./db/users.json", jsonString, "utf8", (err) => {
                    if (err) throw err;
                    res.json('Score updated');
                });
                i = jsonString.length;

            }
        }
    });
}