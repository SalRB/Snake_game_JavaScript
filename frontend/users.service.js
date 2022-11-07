// Server request for the login
async function getUser(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Body data type must match "Content-Type" header,
        mode: 'cors'
    });
    let res = await response.json(); // Parses JSON response into native JavaScript objects
    return res;
}

// Server request to get all the scores
async function getUsers(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    });
    let res = await response.json();
    return res;
}

// Server request for the register
async function addUser(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });
    let res = await response.json();
    return res;
}

// Server request to update one user's score 
async function updateScore(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
    });
    let res = await response.json();
    return res;
}