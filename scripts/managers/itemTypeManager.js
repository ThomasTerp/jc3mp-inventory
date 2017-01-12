"use strict";
var itemTypeConstructorsMap = new Map();
function add(itemType, constructors) {
    remove(itemType);
    itemTypeConstructorsMap.set(itemType, constructors);
    return constructors;
}
exports.add = add;
function remove(itemType) {
    var constructors = get(itemType);
    if (constructors) {
        itemTypeConstructorsMap.delete(itemType);
    }
}
exports.remove = remove;
function get(itemType) {
    return itemTypeConstructorsMap.get(itemType);
}
exports.get = get;
function forEach(callback) {
    for (var _i = 0, _a = itemTypeConstructorsMap.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], itemType = _b[0], constructors = _b[1];
        if (callback(itemType, constructors)) {
            break;
        }
    }
}
exports.forEach = forEach;
