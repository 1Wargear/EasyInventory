/**
 * Gathers UI-Data and calls the API to create a Grouop
 * @param {Event} e the event of the button press
 */
function uiaction_onCreateGroup(e) {
    e.preventDefault();

    const user = login_getUser();
    const groupName = document.getElementById('name').value;
    const group = api_createGroup(groupName, user);

    api_setCurrentGroup(group);
    ui_closeDialog();
    ui_showGroupProfile();
}

/**
 * Gathers UI-Data and calls the API to create a Inventory
 * @param {Event} e the event of the button press
 */
function uiaction_onCreateInventory(e) {
    e.preventDefault();

    const inventoryName = document.getElementById('inventoryName').value;
    const groupName = document.getElementById('inventoryGroup').value;
    const inventory = api_createInventory(groupName, inventoryName);

    const newInventory = api_setCurrentInv(inventory);
    uiaction_addInventory(newInventory);
    ui_closeDialog();
}

/**
 * Gathers UI-Data and calls the API to add a Item
 * @param {Event} e the event of the button press
 */
function uiaction_onAddItem(e) {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const itemType = document.getElementById('itemType').value;
    const itemLocation = document.getElementById('itemLocation').value;
    const notifyDate = document.getElementById('notifyDate').value;
    const notifyMessage = document.getElementById('notifyMessage').value;

    const newItem = api_addItem(api_getCurrentGroup().name, api_getCurrentInv().name, itemName, itemType, itemLocation, notifyDate, notifyMessage);
    ui_addItem(newItem);
    ui_closeDialog();
}

/**
 * Gathers UI-Data and calls the API to add a Role
 * @param {Event} e the event of the button press
 */
function uiaction_onAddRole(e) {
    e.preventDefault();

    const roleName = document.getElementById('roleName').value;
    const memberOf = document.getElementById('memberof').value;

    const newRole = api_addRole(api_getCurrentGroup().name, roleName, memberOf);
    ui_addRole(newRole);
    ui_closeDialog();
}

/**
 * Populates the group selection page with data
 */
function uiaction_onLoadGroups() {
    const groups = api_getGroups();
    const table = document.getElementById('groupTable');
    groups.forEach(group => {
        const row = table.insertRow();
        const cellName = row.insertCell();
        const nameText = document.createTextNode(group.name);
        cellName.appendChild(nameText);
        const cellUsers = row.insertCell();
        const usersText = document.createTextNode(group.users.length);
        cellUsers.appendChild(usersText);
        const cellAction = row.insertCell();
        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-secondary w-100';
        openBtn.innerText = 'Open';
        openBtn.setAttribute("data-bs-dismiss", "modal");
        openBtn.addEventListener('click', () => uiaction_navigateToGroup(group));
        cellAction.appendChild(openBtn);
    });
}

/**
 * Populates the inventory selection page with data
 */
function uiaction_onLoadInventories(){
    const groups = api_getGroups();
    const table = document.getElementById('inventoryTable');
    groups.forEach(group => {
        group.inventories.forEach(inventory => {
            const row = table.insertRow();
            const cellName = row.insertCell();
            const nameText = document.createTextNode(inventory.name);
            cellName.appendChild(nameText);
            const cellGroup = row.insertCell();
            const groupText = document.createTextNode(group.name);
            cellGroup.appendChild(groupText);
            const cellAction = row.insertCell();
            const openBtn = document.createElement('button');
            openBtn.className = 'btn btn-secondary w-100';
            openBtn.innerText = 'Open';
            openBtn.setAttribute("data-bs-dismiss", "modal");
            openBtn.addEventListener('click', () => uiaction_navigateToInventory(inventory));
            cellAction.appendChild(openBtn);
        });
    });
}

/**
 * Populates the item table with data
 */
function uiaction_onLoadInventoryItems() {
    const inventory = api_getCurrentInv();
    const itemsTable = document.getElementById('itemTable');
    itemsTable.innerHTML = '<tr><th>Item</th><th>Notification</th><th>Action</th></tr>';

    inventory.items.forEach(item => {
        ui_addItem(item);
    });
}

/**
 * Populates the group profile page with data
 */
function uiaction_onLoadGroupProfile() {
    const group = api_getCurrentGroup();

    const groupNameText = document.getElementById('groupname');
    groupNameText.value = group.name;
    
    if(group.users !== null && group.users.length > 0) {
        group.users.forEach(member => {
            if(member === null)
                return;

            ui_addMember(member);
        });
    }

    if (group.inventories !== null && group.inventories.length > 0) {
        group.inventories.forEach(inventory => {
            uiaction_addInventory(inventory);
        });
    }

    group.roles.forEach(role => {
        ui_addRole(role);
    });
}

/**
 * Adds a item to the item table with all required ui elements
 * @param {Object} item the item data to add to the ui
 */
function ui_addItem(item) {
    const itemsTable = document.getElementById('itemTable');
    const place = document.getElementById('place').value;

    if(!(item.place === place || place === 'All'))
        return;

    const row = itemsTable.insertRow();
    const cellName = row.insertCell();
    const nameText = document.createTextNode(item.name);
    cellName.appendChild(nameText);
    const cellNotify = row.insertCell();

    if(item.notifyDate !== null && new Date(item.notifyDate) < Date.now()) {
        const notifyText = document.createTextNode(item.notifyMessage);
        cellNotify.appendChild(notifyText);

        row.className = 'bg-info';
    }

    const cellDel= row.insertCell();
    const openDel = document.createElement('button');
    openDel.className = 'btn btn-danger w-100';
    openDel.innerText = 'Delete';
    openDel.addEventListener('click', () => {api_deleteItem(item); uiaction_onLoadInventoryItems();});
    cellDel.appendChild(openDel);
}

/**
 * Adds a member to the members table with all required ui elements
 * @param {Object} member the member data to add to the ui
 */
function ui_addMember(member) {
    const memberTable = document.getElementById('members');
    const row = memberTable.insertRow();
    const cellName = row.insertCell();
    const nameText = document.createTextNode(member.name);
    cellName.appendChild(nameText);
    const cellRole = row.insertCell();
    const roleText = document.createTextNode(member.role);
    cellRole.appendChild(roleText);
    const cellMail = row.insertCell();
    const mailText = document.createTextNode(member.mail);
    cellMail.appendChild(mailText);
    const cellTel = row.insertCell();
    const telText = document.createTextNode(member.phone);
    cellTel.appendChild(telText);
}

/**
 * Adds a inventory to the inventories table with all required ui elements
 * @param {Object} inventory the inventory data to add to the ui
 */
function uiaction_addInventory(inventory){
    const inventoryTable = document.getElementById('inventories');
    const row = inventoryTable.insertRow();
    const cellName = row.insertCell();
    const nameText = document.createTextNode(inventory.name);
    cellName.appendChild(nameText);
    const cellItems = row.insertCell();
    const itemsText = document.createTextNode(inventory.items.length);
    cellItems.appendChild(itemsText);
    const cellNotify = row.insertCell();
    const notifyText = document.createTextNode(inventory.notifications.length);
    cellNotify.appendChild(notifyText);
    const cellStatus = row.insertCell();
    const statusText = document.createTextNode('Acrive');
    cellStatus.appendChild(statusText);
}

/**
 * Adds a role to the roles table with all required ui elements
 * @param {Object} role the role data to add to the ui
 */
function ui_addRole(role){
    const rolesTable = document.getElementById('roles');
    const row = rolesTable.insertRow();
    const cellName = row.insertCell();
    const nameText = document.createTextNode(role.name);
    cellName.appendChild(nameText);
    const cellParent = row.insertCell();
    const parentText = document.createTextNode(role.parent === null ? '-' : role.parent);
    cellParent.appendChild(parentText);
    const cellActive = row.insertCell();
    const activeText = document.createTextNode(role.active ? 'Yes' : 'No');
    cellActive.appendChild(activeText);
}

/**
 * Sets the probvided group as the current and loads the group profile
 * @param {Object} group The group to navigate to
 */
function uiaction_navigateToGroup(group) {
    api_setCurrentGroup(group);
    ui_showGroupProfile();
}

/**
 * Sets the probvided inventory as the current and loads the inventory
 * @param {Object} inventory The inventory to navigate to
 */
function uiaction_navigateToInventory(inventory) {
    api_setCurrentInv(inventory);
    ui_showInventory();
}

/**
 * Checks if a user is logged in and shows a error message if not
 * @returns true if a user is logged in
 */
function uiaction_checkUserLogin() {
    const notificationContainer = document.getElementById('notificationContainer');
    const navButtons = document.querySelectorAll('nav input[type=button]');

    if(login_getUser() !== null)
        return true;

    notificationContainer.innerHTML = `<div id="notificationContainer">
                <div class="alert alert-danger" role="alert">
                    <h2 class="alert-heading">You are not logged in</h4>
                    <hr>
                    <p>Live-Inventory is only available if you are logged in please <a href="../login.html">Login</a></p>
                </div>
            </div>`;

    navButtons.forEach(e => {
        e.disabled = true;
    });

    return false;
}

/**
 * Loads the notifications in a group and shows them in the notification container
 * @param {Object} group the group to load the notifications from
 */
function uiaction_onLoadNotifications(group) {
    const notificationContainer = document.getElementById('notificationContainer');

    group.inventories.forEach(inv => {
        inv.items.forEach(item => {
            if(item.notifyDate !== null && new Date(item.notifyDate) < Date.now()){
                notificationContainer.innerHTML += `<div id="notificationContainer">
                <div class="alert alert-info" role="alert">
                    <h2 class="alert-heading">${group.name}/${inv.name}/${item.name}</h4>
                    <hr>
                    <p>${item.notifyMessage}</p>
                </div>
            </div>`;
            }
        });
    });
}

/**
 * Adds a event listener to all areas of a map to select the rooms
 */
function uiaction_onLoadItemMap() {
    const areas = document.querySelectorAll('area');
    areas.forEach(element => {
        element.addEventListener('click', e => uiaction_updatePlace(e));
    });
}

/**
 * Updates the current place the user has clicked on if none is defined fallback to all
 * @param {Event} e The event of the button press
 */
function uiaction_updatePlace(e) {
    let newPlace = 'All';
    if(e !== undefined) {
        e.preventDefault();
        newPlace = e.srcElement.alt;
    }
    document.getElementById('place').value = newPlace;
    uiaction_onLoadInventoryItems();
}

/**
 * Copies the invite link to the clipboard
 */
function uiaction_onCopyLink() {
    var copyText = document.getElementById("inviteLink");
  
    copyText.focus();
    navigator.clipboard.writeText(copyText.href);

    alert("Invite link is now in the Clipboard");
}