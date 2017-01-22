"use strict";
var syncMap = new Map();
function add(player, inventory, item) {
    var playerSyncMap = syncMap.get(player);
    if (playerSyncMap == undefined) {
        playerSyncMap = new Map();
        syncMap.set(player, playerSyncMap);
    }
    var inventorySyncMap = playerSyncMap.get(inventory);
    if (inventorySyncMap == undefined) {
        inventorySyncMap = new Map();
        playerSyncMap.set(inventory, inventorySyncMap);
    }
    inventorySyncMap.set(item, true);
}
exports.add = add;
function remove(player, inventory, item) {
    var playerSyncMap = syncMap.get(player);
    if (playerSyncMap != undefined) {
        var inventorySyncMap = playerSyncMap.get(inventory);
        if (inventorySyncMap.get(item) != undefined) {
            inventorySyncMap.delete(item);
            if (inventorySyncMap.size === 0) {
                playerSyncMap.delete(inventory);
            }
        }
        if (playerSyncMap.size === 0) {
            syncMap.delete(player);
        }
    }
}
exports.remove = remove;
function isSynced(player, inventory, item) {
    var playerSyncMap = syncMap.get(player);
    if (playerSyncMap != undefined) {
        var inventorySyncMap = playerSyncMap.get(inventory);
        if (inventorySyncMap.get(item) != undefined) {
            return true;
        }
    }
    return false;
}
