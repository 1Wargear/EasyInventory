/**
 * Local Storage key for the selected theme
 */
const themeCookie = "theme";
/**
 * Constan to identify the dark theme
 */
const themeDark = "darkT";
/**
 * Constan to identify the light theme
 */
const themeLight = "lightT";

/**
 * Toggles between light and dark theme and saves the result to local storage
 */
function theme_toggle() {
    if(theme_getCurrent() == themeDark) {
        localStorage.setItem(themeCookie, themeLight);
    }
    else {
        localStorage.setItem(themeCookie, themeDark);
    }
    theme_apply();
}

/**
 * Retrives the current theme from local storage
 * @returns The currently selected theme
 */
function theme_getCurrent() {
    return localStorage.getItem(themeCookie);
}

/**
 * Wrapper to apply the theme to all components
 */
function theme_apply() {
    if(document.getElementsByTagName("header").length > 0) {
        theme_applyHeader();
    }

    if(document.getElementsByTagName("form").length > 0) {
        theme_applyForm();
    }

    theme_applyCards();
    theme_applyImage();
    theme_applyTable();
    theme_applyDialog();
}

/**
 * Applies the theme to all cards on screen
 */
function theme_applyCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((element) => {
        if(theme_getCurrent() == themeDark) {
            element.classList.remove('bg-light');
            element.classList.add('bg-dark');
            element.classList.add('text-white');
        }
        else {
            element.classList.remove('bg-dark');
            element.classList.remove('text-white');
            element.classList.add('bg-light');
        }
    });
}

/**
 * Applies the theme to header footer and body elements if present
 */
function theme_applyHeader() {
    const header = document.getElementsByTagName("HEADER")[0];
    const footer = document.getElementsByTagName("FOOTER")[0];
    const body = document.getElementsByTagName("BODY")[0];
    const btnTheme = document.getElementById("btnTheme");
    if(theme_getCurrent() == themeDark) {
        header.classList.remove("bg-grad-light");
        header.classList.add("bg-grad-dark");

        footer.classList.remove("bg-grad-light");
        footer.classList.add("bg-grad-dark");

        body.classList.add("bg-darkpage");
        body.classList.add("text-white");

        btnTheme.classList.remove("btn-dark");
        btnTheme.classList.add("btn-light");
        btnTheme.value = "Light";
    }
    else {
        header.classList.remove("bg-grad-dark");
        header.classList.add("bg-grad-light");

        footer.classList.remove("bg-grad-dark");
        footer.classList.add("bg-grad-light");

        body.classList.remove("bg-darkpage");
        body.classList.remove("text-white");

        btnTheme.classList.remove("btn-light");
        btnTheme.classList.add("btn-dark");
        btnTheme.value = "Dark";
    }
}

/**
 * Applies the theme to a form 
 */
function theme_applyForm() {
    const formThemeMaster = document.getElementById("formThemeMaster");

    if(formThemeMaster === null)
        return;

    const body = document.getElementsByTagName("BODY")[0];
    if(theme_getCurrent() == themeDark) {
        formThemeMaster.classList.remove("bg-light");
        formThemeMaster.classList.add("bg-dark");
        formThemeMaster.classList.add("text-white");

        body.classList.remove("bg-grad-light");
        body.classList.add("bg-grad-dark");
    }
    else {
        formThemeMaster.classList.remove("bg-dark");
        formThemeMaster.classList.remove("text-white");
        formThemeMaster.classList.add("bg-light");

        body.classList.remove("bg-grad-dark");
        body.classList.add("bg-grad-light");
    }
    console.log(body.classList);
}

/**
 * Inverts all image colors depending on the current theme (exception for appicon)
 */
function theme_applyImage() {
    const appicon = document.getElementById('appicon'); 

    if(theme_getCurrent() == themeDark) {
        document.querySelectorAll('.invertable').forEach((element) => {
            element.classList.remove('invertable');
            element.classList.add('invert');
        });

        if(appicon !== null)
            appicon.classList.remove('invert');
    }
    else{
        document.querySelectorAll('.invert').forEach((element) => {
            element.classList.remove('invert');
            element.classList.add('invertable');
        });
        
        if(appicon !== null)
            appicon.classList.add('invert');
    }
}

/**
 * Ensures the table text is visible on the current theme
 */
function theme_applyTable() {
    const tables = document.querySelectorAll('TABLE');

    tables.forEach((element) => {
        if(theme_getCurrent() == themeDark) {
            element.classList.add('text-white');
        }
        else {
            element.classList.remove('text-white');
        }
    });
}

/**
 * Applies the theme to the modal dialog
 */
function theme_applyDialog() {
    const dialog = document.querySelector('.modal-content');
    if(dialog !== null && dialog !== undefined) {
        if(theme_getCurrent() == themeDark) {
            dialog.classList.add('bg-dark');
        }
        else {
            dialog.classList.remove('bg-dark');
        }
    }
}

theme_apply();