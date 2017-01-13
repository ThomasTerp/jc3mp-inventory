"use strict";
var itemsMap = new Map();
function add(id, item) {
    item.id = id;
    remove(id);
    itemsMap.set(id, item);
    return item;
}
exports.add = add;
function remove(id) {
    var item = get(id);
    if (item) {
        itemsMap.delete(id);
    }
}
exports.remove = remove;
function get(id) {
    return itemsMap.get(id);
}
exports.get = get;
function forEach(callback) {
    for (var _i = 0, _a = itemsMap.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], item = _b[1];
        if (callback(id, item)) {
            break;
        }
    }
}
exports.forEach = forEach;
