"use strict";
var inventoryManager = require("./managers/inventoryManager");
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
        console.log("SENDING INVENTORY");
        console.log(inventoryData);
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
    console.log("SENDING ITEMS");
    console.log(itemsData);
    jcmp.events.CallRemote("jc3mp-inventory/network/sendItems", player, JSON.stringify(itemsData));
}
exports.sendItems = sendItems;
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestInventoryItems", function (player, inventoryUniqueName) {
    var inventory = inventoryManager.get(inventoryUniqueName);
    if (inventory !== undefined) {
        sendItems(player, inventory.items);
    }
});
