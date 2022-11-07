// Replaces the form with the login one 
function formLogin() {
    document.getElementById('button_login').classList.add('active');
    document.getElementById('button_register').classList.remove('active');
    document.getElementById('form_register').setAttribute('hidden', 'true');
    document.getElementById('form_login').removeAttribute('hidden');
}

// Replaces the form with the register one
function formRegister() {
    document.getElementById('button_login').classList.remove('active');
    document.getElementById('button_register').classList.add('active');
    document.getElementById('form_login').setAttribute('hidden', 'true');
    document.getElementById('form_register').removeAttribute('hidden');
}

// Removes the form when a users logs in and prints their name and image
function removeForm(user) {
    document.getElementById('form').innerHTML = `<h2 class="username">` + user['username'] + `</h2>
    <img class="pfp" src="`+ user['pfp'] + `"><br>
    <button class="logOutButton" onclick="logout()">LOG OUT</button>`;
}

// Checks if the data introduced on the form is valid and logs in or registers the user, if the information is invalid, prints errors
async function onSubmit(type) {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    const passwdRegex = /^[0-9a-zA-Z]{8,16}$/;
    const userRegex = /^[0-9a-zA-Z]{2,16}$/;
    // const passwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if (type == 'login') {
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;
        if (passwdRegex.test(password) && emailRegex.test(email)) {
            removeError('emailLogin');
            removeError('passwordLogin');

            const user = await getUser('http://localhost:3000/', { email: email, password: password });
            if (typeof user == 'string') {
                addError('passwordLogin', user);
            } else {
                printPersonalBest(user['score']);
                saveLocalStorage(user['email'], user['password']);
                removeForm(user);
            }

        } else {
            removeError('emailLogin');
            removeError('passwordLogin');

            if (!emailRegex.test(email)) {
                addError('emailLogin', 'Email required');
            } else {
                removeError('emailLogin');
            }
            if (!passwdRegex.test(password)) {
                addError('passwordLogin', 'Password required (8-16)');
            } else {
                removeError('passwordLogin');
            }
        }
    } else {
        const email = document.getElementById('emailRegister').value;
        const password = document.getElementById('passwordRegister').value;
        const rpassword = document.getElementById('rpasswordRegister').value;
        const username = document.getElementById('userRegister').value;

        if (passwdRegex.test(password) && emailRegex.test(email) && passwdRegex.test(rpassword) && userRegex.test(username) && (password === rpassword)) {
            removeError('userRegister');
            removeError('emailRegister');
            removeError('passwordRegister');
            removeError('rpasswordRegister');

            // Uses a pokémon api to use a random pokémon sprite as pfp for the user
            const poke = await fetch("https://pokeapi.co/api/v2/pokemon/" + Math.floor(Math.random() * 905));
            pfp = await poke.json(); // parses JSON response into native JavaScript objects
            pfp = pfp['sprites']['other']['official-artwork']['front_default'];

            await addUser('http://localhost:3000/register', { username: username, password: password, email: email, pfp: pfp, score: { easy: 0, medium: 0, hard: 0 } });
            const user = await getUser('http://localhost:3000/', { email: email, password: password });
            if (typeof user == 'string') {
                addError('passwordLogin', user);
            } else {
                printPersonalBest(user['score']);
                saveLocalStorage(user['email'], user['password']);
                removeForm(user);
            }

        } else {
            if (!userRegex.test(username)) {
                addError('userRegister', 'Username required (4-16)');
            } else {
                removeError('userRegister');
            }
            if (!emailRegex.test(email)) {
                addError('emailRegister', 'Email required');
            } else {
                removeError('emailRegister');
            }
            if (!passwdRegex.test(password)) {
                addError('passwordRegister', 'Password required (8-16)');
            } else {
                removeError('passwordRegister');
            }
            if (!(password === rpassword)) {
                addError('rpasswordRegister', 'Passwords must match');
            } else {
                removeError('rpasswordRegister');
            }
        }
    }
}

// Prints an error under the form inputs
function addError(location, message) {
    location = location += 'Error';
    document.getElementById(location).classList.add('error-active');
    document.getElementById(location).innerHTML = message;
}

// Removes the error messages
function removeError(location) {
    location = location += 'Error';
    document.getElementById(location).classList.remove('error-active');
    document.getElementById(location).innerHTML = '';
}

// Saves the user data on localstorage 
function saveLocalStorage(user, password) {
    localStorage.setItem('usr', window.btoa(user));
    localStorage.setItem('pwd', window.btoa(password));
}

// Check if there is a logged user
async function checkLocalStorage() {
    if (localStorage.getItem('usr') && localStorage.getItem('pwd')) {
        const user = await getUser('http://localhost:3000/', { email: window.atob(localStorage.getItem('usr')), password: window.atob(localStorage.getItem('pwd')) });
        printPersonalBest(user['score']);
        removeForm(user);
    } else {
        localStorage.removeItem('usr');
        localStorage.removeItem('pwd');
    }
    document.getElementById('personalScores').removeAttribute('hidden');
    document.getElementById('form').removeAttribute('hidden');
}

// Removes the data from localstorage
function logout() {
    localStorage.removeItem('usr');
    localStorage.removeItem('pwd');
}