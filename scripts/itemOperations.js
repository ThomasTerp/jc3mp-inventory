"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var itemManager = require("./managers/itemManager");
var database = require("./database");
var network = require("./network");
function moveItem(item, newInventory, position, rotation, isFlipped, callback) {
    if (newInventory.isItemWithinInventory(item, position) && newInventory.canItemBePlaced(item, position)) {
        moveItemNoInventoryValidation(item, newInventory, position, rotation, isFlipped, callback);
    }
    else {
        if (callback != undefined) {
            callback(false);
        }
    }
}
exports.moveItem = moveItem;
function moveItemNoInventoryValidation(item, newInventory, position, rotation, isFlipped, callback) {
    var oldInventory = item.inventory;
    if (oldInventory != undefined) {
        oldInventory.removeItem(item);
    }
    item.rotation = rotation;
    item.isFlipped = isFlipped;
    item.updateSlots();
    newInventory.addItem(item, position);
    if (oldInventory == undefined) {
        database.saveItem(item, function () {
            if (callback != undefined) {
                callback(true);
            }
        });
    }
    else {
        database.moveItem(item, oldInventory, function () {
            if (callback != undefined) {
                callback(true);
            }
        });
    }
}
exports.moveItemNoInventoryValidation = moveItemNoInventoryValidation;
function destroyItem(item, callback) {
    new Promise(function (resolve, reject) {
        if (item.id == undefined) {
            resolve();
        }
        else {
            database.deleteItem(item, function () {
                resolve();
            });
        }
    }).then(function () {
        if (item.inventory != undefined) {
            item.inventory.removeItem(item);
        }
        itemManager.remove(item);
        item.destroy();
        if (callback != undefined) {
            callback(true);
        }
    }).catch(function (err) {
        if (callback != undefined) {
            callback(false);
        }
        if (err != undefined) {
            console.log(err);
        }
    });
}
exports.destroyItem = destroyItem;
function playerMoveItem(item, newInventory, player, position, rotation, isFlipped, callback) {
    return moveItem(item, newInventory, position, rotation, isFlipped, callback);
}
exports.playerMoveItem = playerMoveItem;
function playerUseItem(item, player, callback) {
    if (item.canUse(player)) {
        item.use(player);
        new Promise(function (resolve, reject) {
            if (item.destroyOnUse) {
                destroyItem(item, function (success) {
                    if (success) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
            else {
                resolve();
            }
        }).then(function () {
            network.sendItemUse(player, item);
            if (callback != undefined) {
                callback(true);
            }
        }).catch(function (err) {
            if (callback != undefined) {
                callback(false);
            }
            if (err != undefined) {
                console.log(err);
            }
        });
    }
    else {
        if (callback != undefined) {
            callback(false);
        }
    }
}
exports.playerUseItem = playerUseItem;
function playerDestroyItem(item, player, callback) {
    if (item.canDestroy(player)) {
        destroyItem(item, function () {
            network.sendItemDestroy(player, item);
            if (callback != undefined) {
                callback(true);
            }
        });
    }
    else {
        if (callback != undefined) {
            callback(false);
        }
    }
}
exports.playerDestroyItem = playerDestroyItem;
