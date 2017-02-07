"use strict";
var itemManager = require("./managers/itemManager");
var database = require("./database");
var network = require("./network");
function moveItem(item, toInventory, position, callback) {
    if (toInventory.isItemWithinInventory(item, position) && toInventory.canItemBePlaced(item, position)) {
        if (item.inventory != undefined) {
            item.inventory.removeItem(item);
        }
        toInventory.addItem(item, position);
        if (callback != undefined) {
            callback(true);
        }
    }
    else {
        if (callback != undefined) {
            callback(false);
        }
    }
}
exports.moveItem = moveItem;
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
function playerMoveItem(item, toInventory, player, callback) {
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
