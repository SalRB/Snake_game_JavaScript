function formLogin() {
    document.getElementById('button_login').classList.add('active');
    document.getElementById('button_register').classList.remove('active');
    document.getElementById('form_register').setAttribute('hidden', 'true');
    document.getElementById('form_login').removeAttribute('hidden');
}

function formRegister() {
    document.getElementById('button_login').classList.remove('active');
    document.getElementById('button_register').classList.add('active');
    document.getElementById('form_login').setAttribute('hidden', 'true');
    document.getElementById('form_register').removeAttribute('hidden');
}

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

            const users = JSON.parse(await getUser('http://localhost:3000/"paco"', { email: email, password: password }))
            console.log(users);
        } else {
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
        const user = document.getElementById('userRegister').value;

        if (passwdRegex.test(password) && emailRegex.test(email) && passwdRegex.test(rpassword) && userRegex.test(user) && (password === rpassword)) {
            removeError('userRegister');
            removeError('emailRegister');
            removeError('passwordRegister');
            removeError('rpasswordRegister');
        } else {
            if (!userRegex.test(user)) {
                addError('userRegister', 'Password required (8-16)');
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

function addError(location, message) {
    location = location += 'Error';
    document.getElementById(location).classList.add('error-active');
    document.getElementById(location).innerHTML = message;
}

function removeError(location) {
    location = location += 'Error';
    document.getElementById(location).classList.remove('error-active');
    document.getElementById(location).innerHTML = '';
}