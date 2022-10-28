const fs = require('fs');

exports.getUsers = async (req, res) => {

    fs.readFile("./db/users.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
        }
        res.json(jsonString);
    });

    // try {
    //     const categories = await Category.find();
    //     res.json(FormatObject(categories));
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send(FormatError("Error occurred", res.statusCode));
    // }
}

exports.getUser = async (req, res) => {
    // console.log(req.body);

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

// exports.getCategory = async (req, res) => {
//     try {
//         const category = await Category.findOne({ "slug": req.params.slug });
//         res.json(FormatObject(category));
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(FormatError("Error occurred", res.statusCode));
//     }
// }

// for (var i = 0; i < result.length; i++) {
//     for (key in result[i]) {

//         if (key !== "score") {
//             if (result[i][key].indexOf(req.body.email) != -1) {
//                 results.push(result[i]);
//             }
//         }
//     }
// }
