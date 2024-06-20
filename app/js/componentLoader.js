/**
 * The global Variable keeps track of last window width for calculating responsive layouts
 */
let ui_lastWidth = 0;

/**
 * Fetches and places a modal dialog from the components directory
 * @param {string} component The name of the Component to load in the modal dialog
 */
async function ui_loadDialog(component) {
    const main = document.getElementsByClassName(`modal-content`)[0];
    let myObject = await fetch(`components/${component}.html`);
    let html = await myObject.text();
    main.innerHTML = html;
    
    theme_apply();
}

/**
 * Sets the onclick event of the submit button in a dialog
 * @param {function} action the event-listenter to call
 */
function ui_setDialogSubmitAction(action) {
    const btnSubmit = document.getElementById('btnSubmit');
    btnSubmit.addEventListener('click', action);
}

/**
 * Fetches and places a component from the components directory into the specified target
 * @param {string} component The component to load
 * @param {string} target The target area to load the component into
 */
async function loadComponent(component, target) {
    const main = document.getElementsByClassName(`app-grid-${target}`)[0];
    let myObject = await fetch(`components/${component}.html`);
    let html = await myObject.text();
    main.innerHTML = html;

    theme_apply();
}

/**
 * Unloads all components on the grid
 */
async function ui_unloadComponents() {
    await loadComponent('loader', 'left');
    await loadComponent('loader', 'main');
    await loadComponent('loader', 'right');
    ui_setAppGridLayout(3);

    window.removeEventListener('resize', ui_copyToMain);
}

/**
 * Shows the start page and populates it with data
 */
async function ui_showStartPage() {
    await ui_unloadComponents();

    await loadComponent('notifications', "main");
    ui_setAppGridLayout(1);

    if(!uiaction_checkUserLogin())
        return;

    api_getGroups().forEach(group => {
        uiaction_onLoadNotifications(group);
    });
}

/**
 * Shows the inventory page and populates it with data
 */
async function ui_showInventory(){
    await ui_unloadComponents();

    await loadComponent('itemFilter', 'left');
    await loadComponent('floorplan', 'main');
    await loadComponent('itemTable', "right");
    ui_setAppGridLayout(3);

    uiaction_onLoadInventoryItems();
    response_initMap();
    response_resizeMap();
    uiaction_onLoadItemMap();

    if(window.innerWidth <= 800)
        ui_copyToMain(true);

    ui_lastWidth = window.innerWidth;
    window.addEventListener('resize', ui_copyToMain);
}

/**
 * Shows the group profile page and populates it with data
 */
async function ui_showGroupProfile() {
    await ui_unloadComponents();

    await loadComponent('groupprofile', 'main');
    await loadComponent('notifications', 'right');

    ui_setAppGridLayout(2);

    uiaction_onLoadGroupProfile();
    uiaction_onLoadNotifications(api_getCurrentGroup());
}

/**
 * Shows the select inventory dialog and populates it with data
 */
async function ui_showInventoryDialog(){
    await ui_loadDialog('inventories');
    uiaction_onLoadInventories();
}

/**
 * Shows the select group dialog and populates it with data
 */
async function ui_showGroupsDialog(){
    await ui_loadDialog('groups');
    uiaction_onLoadGroups();
}

/**
 * Shows the create group dialog and populates it with data
 */
async function ui_showCreateGroup() {
    await ui_loadDialog('createGroup');
    ui_setDialogSubmitAction(uiaction_onCreateGroup);
}

/**
 * Shows the invite user dialog and populates it with data
 */
function ui_showInviteUser() {
    ui_loadDialog('inviteUser');
}

/**
 * Shows the create inventory dialog and populates it with data
 */
async function ui_showCreateInventory() {
    await ui_loadDialog('createInventory');
    ui_setDialogSubmitAction(uiaction_onCreateInventory);

    const group = api_getCurrentGroup();
    document.getElementById('inventoryGroup').value = group.name;
}

/**
 * Shows the add role dialog and populates it with data
 */
async function ui_showAddRole() {
    await ui_loadDialog('addRole');
    ui_setDialogSubmitAction(uiaction_onAddRole);
}

/**
 * Shows the add item dialog and populates it with data
 */
async function ui_showAddItem() {
    await ui_loadDialog('addItem');
    ui_setDialogSubmitAction(uiaction_onAddItem);
}

/**
 * Unloads the current dialog
 */
function ui_closeDialog() {
    ui_loadDialog('loader');
}

/**
 * Sets the App Grids Layout to the specified amount of columns
 * * columns=1 main
 * * columns=2 main + right
 * * columns=3 left + main + right
 * @param {int} columns amount of columns to display (Range between 1 and 3)
 */
function ui_setAppGridLayout(columns) {
    const toggleColumn = (target, enabled) => {
        const column = document.getElementsByClassName(`app-grid-${target}`)[0];
        if(enabled) {
            column.classList.remove('collapse');
        } else {
            column.classList.add('collapse');
        }
    }

    toggleColumn('left', false);
    toggleColumn('main', false);
    toggleColumn('right', false);

    switch(columns) {
        case 1:
            toggleColumn('main', true);
            break;
        case 2:
            toggleColumn('main', true);
            toggleColumn('right', true);
            break;
        case 3:
            toggleColumn('left', true);
            toggleColumn('main', true);
            toggleColumn('right', true);
            break;
    }
}

/**
 * Updates the Layout to copy the content of the right aside to the main column if not enouth space is available and copies it back if the space is available again
 * @param {boolean} force Forces a copy regardless of last size
 */
function ui_copyToMain(force = false) {
    console.log(force);
    const main = document.getElementsByClassName('app-grid-main')[0];
    const left = document.getElementsByClassName('app-grid-right')[0];

    console.log(ui_lastWidth);
    if(window.innerWidth > 800 && (ui_lastWidth <= 800 || force === true)) {
        left.innerHTML = main.innerHTML;

        loadComponent('floorplan', 'main');
        response_initMap();
        response_resizeMap();
        uiaction_onLoadItemMap();
    }
    if(window.innerWidth <= 800 && (ui_lastWidth > 800 || force === true)) { 
        main.innerHTML = left.innerHTML;
        left.innerHTML = '';
    }

    ui_lastWidth = window.innerWidth;
}

ui_showStartPage();