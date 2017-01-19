"use strict";
var inventoriesMap = new Map();
function add(uniqueName, inventory) {
    remove(uniqueName);
    inventory.uniqueName = uniqueName;
    inventoriesMap.set(uniqueName, inventory);
    return inventory;
}
exports.add = add;
function remove(uniqueName) {
    var inventory = get(uniqueName);
    if (inventory) {
        inventory.uniqueName = undefined;
        inventoriesMap.delete(uniqueName);
    }
}
exports.remove = remove;
function get(uniqueName) {
    return inventoriesMap.get(uniqueName);
}
exports.get = get;
function forEach(callback) {
    for (var _i = 0, _a = inventoriesMap.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], uniqueName = _b[0], inventory = _b[1];
        if (callback(uniqueName, inventory)) {
            break;
        }
    }
}
exports.forEach = forEach;
