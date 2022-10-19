
// await fetch('http://localhost:3000/' + 'roberto');
// await fetch('http://localhost:3000/' + JSON.stringify(value.username).substring(1, value.username.length + 1) + "/" + JSON.stringify(value.password).substring(1, value.password.length + 1));

// function paco() {
//     return 'paco';
// }
// console.log(postData());

async function paco(url = 'http://localhost:3000/', data = {}) {
    // await fetch('http://localhost:3000/' + 'roberto');

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        // body: JSON.stringify(data), // body data type must match "Content-Type" header,
        mode: 'cors' // no-cors, *cors, same-origin
    });
    let res = await response.json(); // parses JSON response into native JavaScript objects
    return res;

}

paco('http://localhost:3000/', { answer: 42 })
    .then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
    });