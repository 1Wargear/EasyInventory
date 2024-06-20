/**
 * Local Storage key for groups
 */
const groupKey = 'Groups';
/**
 * Session Storage key for the current group
 */
const currentGroupKey = 'CurrentGroup';
/**
 * Session Storage key for the current inventory
 */
const currentInvKey = 'CurrentInv';

/**
 * Retrives all groups from local storage
 * @returns all stored groups
 */
function api_getGroups(){
    let groups = JSON.parse(localStorage.getItem(groupKey));
    if(groups === null) {
        groups = [];
    }
    return groups;
}

/**
 * Creates and initializes a group and stores it in local storage
 * @param {string} groupName The name of the group
 * @param {Object} user The user who creates the group
 * @returns The new group
 */
function api_createGroup(groupName, user) {
    const groups = api_getGroups();
    const newGroup = {
        name: groupName, 
        inventories: [], 
        users: [
            {
                name: user.name, 
                role: 'Admin', 
                mail: user.mail,
                phone: user.phone
            }],
        roles: [
            {
                name: 'User', 
                parent: null, 
                active: true
            },
            {
                name: 'Admin', 
                parent: 'User', 
                active: true
            }
        ]
    }
    groups.push(newGroup);
    localStorage.setItem(groupKey, JSON.stringify(groups));
    return newGroup;
}

/**
 * Creates and initializes a new inventory and stores it in local storage
 * @param {string} groupName The group the inventory belongs to
 * @param {string} name The name of the inventory
 * @returns The new invnetory
 */
function api_createInventory(groupName, name) {
    const groups = api_getGroups();
    let group = null;
    groups.forEach(g => {
        if(g.name === groupName)
            group = g;
    });

    const newInventory = {name: name, items: [], notifications: []};
    if(group !== null) {
        group.inventories.push(newInventory);
    }

    localStorage.setItem(groupKey, JSON.stringify(groups));
    api_setCurrentGroup(group);
    return newInventory;
}

/**
 * Creates and initializes a new item and stores it in local storage
 * @param {string} groupName The name of the group the inventory belongs to
 * @param {string} inventoryName The name of the inventory to create the item in
 * @param {string} itemName The name of the item
 * @param {string} itemType The type of the item
 * @param {string} place The place the item is located in
 * @param {string} notifyDate The date the notification is to trigger
 * @param {string} notifyMessage The notification message to display
 * @returns The new item
 */
function api_addItem(groupName, inventoryName, itemName, itemType, place, notifyDate, notifyMessage){
    const groups = api_getGroups();
    let inventory = null;
    groups.forEach(g => {
        if(g.name === groupName)
        {
            g.inventories.forEach(inv => {
                if(inv.name === inventoryName){
                    inventory = inv;
                }
            });
        }
    });

    const newItem = {name: itemName, type: itemType, place: place, notifyDate: notifyDate, notifyMessage: notifyMessage};
    if(inventory !== null) {
        inventory.items.push(newItem);
    }

    localStorage.setItem(groupKey, JSON.stringify(groups));
    api_setCurrentInv(inventory);
    return newItem;
}

/**
 * Deltes a item from the current inventory and group
 * @param {Object} item The item to delete
 */
function api_deleteItem(item) {
    const groupName = api_getCurrentGroup().name;
    const inventoryName = api_getCurrentInv().name;
    const groups = api_getGroups();
    groups.forEach(g => {
        if(g.name === groupName)
        {
            g.inventories.forEach(inv => {
                if(inv.name === inventoryName){
                    api_inventoryDeleteItem(inv, item);
                }
            });
        }
    });

    const currentInv = api_getCurrentInv();
    api_inventoryDeleteItem(currentInv, item);
    api_setCurrentInv(currentInv);

    localStorage.setItem(groupKey, JSON.stringify(groups));
    uiaction_onLoadInventoryItems();
}

/**
 * Deletes item from the specified inventory
 * @param {Object} inv The target inventory to delete the item from
 * @param {Object} item The item to delte
 */
function api_inventoryDeleteItem(inv, item) {
    const newItems = []
    inv.items.forEach(i => {
        if(i.name !== item.name){
            newItems.push(i);
        }
    });
    inv.items = newItems;
}

/**
 * Sets the session storage current group value for easy access
 * @param {Object} group The new current group
 */
function api_setCurrentGroup(group) {
    sessionStorage.setItem(currentGroupKey, JSON.stringify(group));
}

/**
 * Retrives the current group from Session Storage
 * @returns The current group
 */
function api_getCurrentGroup() {
    return JSON.parse(sessionStorage.getItem(currentGroupKey));
}

/**
 * Sets the session storage current inventory value for easy access
 * @param {Object} inventory The new current inventory
 */
function api_setCurrentInv(inventory) {
    sessionStorage.setItem(currentInvKey, JSON.stringify(inventory));
}

/**
 * Retrives the current inventory from Session Storage
 * @returns The current inventory
 */
function api_getCurrentInv() {
    return JSON.parse(sessionStorage.getItem(currentInvKey));
}

/**
 * Creates and initializes a new role and stores it in local storage
 * @param {string} groupName The name of the Group
 * @param {string} roleName The name of the new role
 * @param {string} memberOf The name of the role the new one is a member of
 * @returns The new role
 */
function api_addRole(groupName, roleName, memberOf) {
    const newRole =             
    {
        name: roleName, 
        parent: memberOf, 
        active: true
    };

    const groups = api_getGroups();
    groups.forEach(g => {
        if(g.name === groupName)
        {
            g.roles.push(newRole);
        }
    });

    api_getCurrentGroup().roles.push(newRole);

    localStorage.setItem(groupKey, JSON.stringify(groups));
    return newRole;
}
