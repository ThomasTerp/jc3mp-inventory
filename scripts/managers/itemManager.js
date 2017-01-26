"use strict";
var items = [];
var itemsMap = new Map();
function add(item) {
    remove(item);
    if (item.id != undefined) {
        itemsMap.set(item.id, item);
    }
    items.push(item);
    return item;
}
exports.add = add;
function remove(item) {
    if (exists(item)) {
        if (item.id != undefined) {
            itemsMap.delete(item.id);
        }
        delete items[getItemIndex(item)];
    }
}
exports.remove = remove;
function getByID(id) {
    return itemsMap.get(id);
}
exports.getByID = getByID;
function getByItemIndex(itemIndex) {
    return items[itemIndex];
}
exports.getByItemIndex = getByItemIndex;
function getItemIndex(item) {
    return items.indexOf(item);
}
exports.getItemIndex = getItemIndex;
function exists(item) {
    if (getByID(item.id) != undefined) {
        return true;
    }
    if (getItemIndex(item) !== -1) {
        return true;
    }
    return false;
}
exports.exists = exists;
function forEach(callback) {
    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
        var item = items[itemIndex];
        if (item != undefined && callback(itemIndex, item)) {
            break;
        }
    }
    ;
}
exports.forEach = forEach;
