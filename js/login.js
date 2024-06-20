/**
 * Local Storage key for the logged in user
 */
const userKey = 'user';
/**
 * Local Storage key for all user accounts that have been registerd
 */
const loginsKey = 'logins';

/**
 * Sets the current user to the one provided in the login screen
 * @param {Event} e The event of the button press
 */
function login_login(e) {
    const usr = document.getElementById('username').value;
    const logins = JSON.parse(localStorage.getItem(loginsKey));

    let user = null;
    logins.forEach(login => {
        if(login.name == usr)
            user = login;
    });

    if(user !== null){
        localStorage.setItem(userKey, JSON.stringify(user));
    }
    else {
        e.preventDefault();
        alert('Failed to login, check username');
    }

    login_toggleButton();
}

/**
 * Gets the currently logged in user from local storage
 * @returns The currently logged in user
 */
function login_getUser() {
    return JSON.parse(localStorage.getItem(userKey));
}

/**
 * Clears the currently logged in user and navigates to the root page
 */
function login_logout() {
    localStorage.removeItem(userKey);
    login_toggleButton();
    window.location.href = '/EasyInventory' //Comparability fix for github-pages
}

/**
 * Creates a new user login with the informations on the register screen
 */
function login_register() {
    let logins = JSON.parse(localStorage.getItem(loginsKey));

    if(logins === null)
        logins = [];

    const newLogin = {
        name: document.getElementById('username').value,
        mail: document.getElementById('mail').value,
        phone: document.getElementById('phone').value,
    }
    logins.push(newLogin);
    localStorage.setItem(loginsKey, JSON.stringify(logins));
}

/**
 * Navigates one packe back
 */
function navigation_navback() {
    window.history.back();
}

/**
 * Changes the login button depending on the currently logged in user to the logout button
 */
function login_toggleButton() {
    const user = login_getUser();
    const btnLogin = document.getElementById('login');
    const btnLogout = document.getElementById('logout');

    if(btnLogin === null || btnLogout === null)
        return;

    if(user === null) {
        btnLogin.classList.remove('collapse');
        btnLogout.classList.add('collapse');
    } else {
        btnLogin.classList.add('collapse');
        btnLogout.classList.remove('collapse');
        btnLogout.value = `Logout - ${user.name}`;
    }
}

/**
 * Adds a event listener to the login button on the login screen if present
 */
function login_setButtonAction(){
    const btn = document.getElementById('btnLogin');
    if(btn !== null)
        btn.addEventListener('click', login_login);
}

login_toggleButton();
login_setButtonAction();
