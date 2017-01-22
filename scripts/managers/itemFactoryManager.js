"use strict";
var itemFactoriesMap = new Map();
function add(itemName, factoryName, itemFactory) {
    remove(itemName, factoryName);
    if (itemFactoriesMap.get(itemName) == undefined) {
        itemFactoriesMap.set(itemName, new Map());
    }
    itemFactoriesMap.get(itemName).set(factoryName, itemFactory);
    return itemFactory;
}
exports.add = add;
function remove(itemName, factoryName) {
    if (itemFactoriesMap.get(itemName) != undefined) {
        itemFactoriesMap.get(itemName).delete(factoryName);
        if (itemFactoriesMap.get(itemName).size === 0) {
            itemFactoriesMap.delete(itemName);
        }
    }
}
exports.remove = remove;
function get(itemName, factoryName) {
    if (itemFactoriesMap.get(itemName) != undefined) {
        return itemFactoriesMap.get(itemName).get(factoryName);
    }
}
exports.get = get;
function forEach(callback) {
    for (var _i = 0, _a = itemFactoriesMap.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], itemName = _b[0], itemFactories = _b[1];
        if (callback(itemName, itemFactories)) {
            break;
        }
    }
}
exports.forEach = forEach;
