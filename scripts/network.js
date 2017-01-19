"use strict";
var vector2Grid_1 = require("./classes/vector2Grid");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
var database = require("./database");
function sendInventory(player, inventory, isLocal) {
    if (isLocal === void 0) { isLocal = false; }
    if (inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Network error: Inventory does not have an uniqueName";
    }
    else {
        var inventoryData = {
            uniqueName: inventory.uniqueName,
            name: inventory.name,
            size: {
                cols: inventory.size.cols,
                rows: inventory.size.rows
            }
        };
        if (isLocal) {
            inventoryData.isLocal = true;
        }
        jcmp.events.CallRemote("jc3mp-inventory/network/sendInventory", player, JSON.stringify(inventoryData));
    }
}
exports.sendInventory = sendInventory;
function sendItems(player, items) {
    var itemsData = [];
    items.forEach(function (item, itemIndex) {
        if (item.id != undefined) {
            var itemData = {
                type: item.constructor.name,
                id: item.id,
                rotation: item.rotation,
                isFlipped: item.isFlipped,
            };
            if (item.inventory != undefined) {
                itemData.inventoryUniqueName = item.inventory.uniqueName;
                itemData.inventoryPosition = {
                    cols: item.inventoryPosition.cols,
                    rows: item.inventoryPosition.rows
                };
            }
            itemsData.push(itemData);
        }
    });
    jcmp.events.CallRemote("jc3mp-inventory/network/sendItems", player, JSON.stringify(itemsData));
}
exports.sendItems = sendItems;
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestInventoryItems", function (player, inventoryUniqueName) {
    var inventory = inventoryManager.get(inventoryUniqueName);
    if (inventory != undefined) {
        sendItems(player, inventory.items);
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendChanges", function (player, changesData) {
    if (player.inventory == undefined) {
        console.log("[jc3mp-inventory] Warning: Player \"" + player.client.name + "\" (" + player.client.steamId + " tried to make changes to their inventory, but they do not have an inventory");
    }
    else {
        changesData = JSON.parse(changesData);
        var resendInventory = false;
        for (var changesDataIndex = 0; changesDataIndex < changesData.length; changesDataIndex++) {
            var changeData = changesData[changesDataIndex];
            switch (changeData.changeType) {
                case "move":
                    var item = itemManager.get(changeData.id);
                    if (item == undefined) {
                        console.log("[jc3mp-inventory] Warning: Player \"" + player.client.name + "\" (" + player.client.steamId + " tried to move a non existing item");
                        resendInventory = true;
                        break;
                    }
                    var newInventory = inventoryManager.get(changeData.inventoryUniqueName);
                    if (newInventory != undefined) {
                        if (item.inventory != undefined) {
                            item.inventory.removeItem(item);
                        }
                        item.rotation = changeData.rotation;
                        item.isFlipped = changeData.isFlipped;
                        item.updateSlots();
                        newInventory.addItem(item, new vector2Grid_1.Vector2Grid(changeData.inventoryPosition.cols, changeData.inventoryPosition.rows));
                    }
                    break;
                case "drop":
                    break;
                case "create":
                    break;
                case "dropCreate":
                    break;
            }
        }
        database.saveInventory(player.inventory, true);
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestLocalInventory", function (player) {
    if (player["inventory"] != undefined) {
        sendInventory(player, player["inventory"], true);
    }
});
