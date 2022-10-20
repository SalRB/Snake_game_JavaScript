const fs = require('fs');

exports.getUsers = async (req, res) => {

    fs.readFile("./json/users.json", "utf8", (err, jsonString) => {
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

// exports.getCategory = async (req, res) => {
//     try {
//         const category = await Category.findOne({ "slug": req.params.slug });
//         res.json(FormatObject(category));
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(FormatError("Error occurred", res.statusCode));
//     }
// }

