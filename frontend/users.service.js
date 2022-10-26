
// await fetch('http://localhost:3000/' + 'roberto');
// await fetch('http://localhost:3000/' + JSON.stringify(value.username).substring(1, value.username.length + 1) + "/" + JSON.stringify(value.password).substring(1, value.password.length + 1));

// function paco() {
//     return 'paco';
// }
// console.log(postData());

async function getUser(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header,
        mode: 'cors' // no-cors, *cors, same-origin
    });
    let res = await response.json(); // parses JSON response into native JavaScript objects
    // console.log(res);
    return res;
}

async function getUsers(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        // body: JSON.stringify(data), // body data type must match "Content-Type" header,
        mode: 'cors' // no-cors, *cors, same-origin
    });
    let res = await response.json(); // parses JSON response into native JavaScript objects
    // console.log(res);
    return res;
}


// headers: {
//     'Content-Type': 'text/plain',
// },

// paco('http://localhost:3000/', { answer: 42 })
//     .then((data) => {
//         // console.log(data); // JSON data parsed by `data.json()` call
//     });