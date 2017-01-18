"use strict";
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
var database = require("./database");
function sendInventory(player, inventory, isLocal) {
    if (isLocal === void 0) { isLocal = false; }
    if (inventory.uniqueName === null) {
        throw "[jc3mp-inventory] Network error: Inventory does not have an uniqueName";
    }
    else {
        var inventoryData = {
            uniqueName: inventory.uniqueName,
            size: {
                x: inventory.size.x,
                y: inventory.size.y
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
        if (item.id !== null) {
            var itemData = {
                type: item.constructor.name,
                id: item.id,
                rotation: item.rotation,
                isFlipped: item.isFlipped,
            };
            if (item.inventory !== null) {
                itemData.inventoryUniqueName = item.inventory.uniqueName;
                itemData.inventoryPosition = {
                    x: item.inventoryPosition.x,
                    y: item.inventoryPosition.y
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
    if (inventory !== undefined) {
        sendItems(player, inventory.items);
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendChanges", function (player, changesData) {
    if (player.inventory === undefined) {
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
                    if (item === undefined) {
                        console.log("[jc3mp-inventory] Warning: Player \"" + player.client.name + "\" (" + player.client.steamId + " tried to move a non existing item");
                        resendInventory = true;
                        break;
                    }
                    var newInventory = inventoryManager.get(changeData.inventoryUniqueName);
                    if (newInventory !== undefined) {
                        if (item.inventory !== null) {
                            item.inventory.removeItem(item);
                        }
                        item.rotation = changeData.rotation;
                        item.isFlipped = changeData.isFlipped;
                        item.updateSlots();
                        newInventory.addItem(item, new Vector2(changeData.inventoryPosition.x, changeData.inventoryPosition.y));
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
