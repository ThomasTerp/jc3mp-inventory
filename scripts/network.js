"use strict";
var inventory_1 = require("./classes/inventory");
var vector2Grid_1 = require("./classes/vector2Grid");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
var itemFactoryManager = require("./managers/itemFactoryManager");
var database = require("./database");
var itemOperations = require("./itemOperations");
function sendInventory(player, inventory, includeItems, isLocal) {
    if (includeItems === void 0) { includeItems = true; }
    if (isLocal === void 0) { isLocal = false; }
    if (inventory.uniqueName == undefined) {
        throw "[jc3mp-inventory] Network error: Inventory does not have an uniqueName";
    }
    else {
        var data_1 = {
            inventories: [],
        };
        var inventoryData = convertInventoryToData(inventory);
        if (isLocal) {
            inventoryData.isLocal = true;
        }
        data_1.inventories.push(inventoryData);
        if (includeItems) {
            data_1.items = [];
            inventory.items.forEach(function (item, itemIndex) {
                data_1.items.push(convertItemToData(item));
            });
        }
        jcmp.events.CallRemote("jc3mp-inventory/network/inventoriesAndItemsData", player, JSON.stringify(data_1));
    }
}
exports.sendInventory = sendInventory;
function sendItems(player, items) {
    var data = {
        items: []
    };
    items.forEach(function (item, itemIndex) {
        data.items.push(convertItemToData(item));
    });
    jcmp.events.CallRemote("jc3mp-inventory/network/inventoriesAndItemsData", player, JSON.stringify(data));
}
exports.sendItems = sendItems;
function sendItemUse(player, item) {
    if (item.id == undefined) {
        throw "[jc3mp-inventory] Network error: Item does not have an id";
    }
    else {
        jcmp.events.CallRemote("jc3mp-inventory/network/itemUse", player, item.id);
    }
}
exports.sendItemUse = sendItemUse;
function sendItemDestroy(player, item) {
    if (item.id == undefined) {
        throw "[jc3mp-inventory] Network error: Item does not have an id";
    }
    else {
        jcmp.events.CallRemote("jc3mp-inventory/network/itemDestroy", player, item.id);
    }
}
exports.sendItemDestroy = sendItemDestroy;
function convertItemToData(item) {
    var itemData = {
        type: item.constructor.name,
        rotation: item.rotation,
        isFlipped: item.isFlipped,
    };
    if (item.id != undefined) {
        itemData.id = item.id;
    }
    if (item.inventory != undefined && item.inventory.uniqueName != undefined) {
        itemData.inventoryUniqueName = item.inventory.uniqueName;
        itemData.inventoryPosition = {
            cols: item.inventoryPosition.cols,
            rows: item.inventoryPosition.rows
        };
    }
    return itemData;
}
exports.convertItemToData = convertItemToData;
function convertInventoryToData(inventory) {
    if (inventory.uniqueName != undefined) {
        return {
            uniqueName: inventory.uniqueName,
            name: inventory.name,
            size: {
                cols: inventory.size.cols,
                rows: inventory.size.rows
            }
        };
    }
}
exports.convertInventoryToData = convertInventoryToData;
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemOperations", function (player, itemOperationsData) {
    itemOperationsData = JSON.parse(itemOperationsData);
    var itemsToSendBack = [];
    var moveItemsMap = new Map();
    for (var itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++) {
        var itemData = itemOperationsData[itemOperationsDataIndex];
        if (itemData.itemOperationType === "move" && itemData.id != undefined) {
            var item = itemManager.getByID(itemData.id);
            if (item != undefined) {
                moveItemsMap.set(item, true);
            }
        }
    }
    var testInventoriesMap = new Map();
    for (var itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++) {
        var itemData = itemOperationsData[itemOperationsDataIndex];
        if (itemData.inventoryUniqueName != undefined && itemData.inventoryPosition != undefined && testInventoriesMap.get(itemData.inventoryUniqueName) == undefined) {
            var inventory = inventoryManager.get(itemData.inventoryUniqueName);
            if (inventory != undefined) {
                var testInventory = new inventory_1.Inventory(inventory.name, inventory.size);
                var itemDummy = {};
                for (var rows = 0; rows < testInventory.size.rows; rows++) {
                    var log = "";
                    for (var cols = 0; cols < testInventory.size.cols; cols++) {
                        var inventoryItem = inventory.slots[rows][cols].item;
                        if (inventoryItem != undefined && moveItemsMap.get(inventoryItem) == undefined) {
                            testInventory.slots[rows][cols].item = itemDummy;
                        }
                        log += testInventory.slots[rows][cols].item == undefined ? "0" : "1";
                    }
                }
                testInventoriesMap.set(itemData.inventoryUniqueName, testInventory);
            }
        }
    }
    var success = true;
    for (var itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++) {
        if (success) {
            var itemData = itemOperationsData[itemOperationsDataIndex];
            switch (itemData.itemOperationType) {
                case "move":
                    var item = itemManager.getByID(itemData.id);
                    if (item != undefined) {
                        var testInventory = testInventoriesMap.get(itemData.inventoryUniqueName);
                        var itemFactory = itemFactoryManager.get(item.constructor.name, "default");
                        if (itemFactory != undefined) {
                            var inventoryPosition = new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
                            var testItem = itemFactory.assemble();
                            testItem.rotation = itemData.rotation;
                            testItem.isFlipped = itemData.isFlipped;
                            testItem.updateSlots();
                            if (testInventory.isItemWithinInventory(testItem, inventoryPosition) && testInventory.canItemBePlaced(testItem, inventoryPosition)) {
                                testInventory.addItem(testItem, inventoryPosition);
                            }
                            else {
                                success = false;
                            }
                        }
                        else {
                            success = false;
                        }
                    }
                    break;
                case "drop":
                    break;
            }
        }
    }
    if (success) {
        var promises = [];
        var _loop_1 = function (itemOperationsDataIndex) {
            var itemData = itemOperationsData[itemOperationsDataIndex];
            switch (itemData.itemOperationType) {
                case "move":
                    promises.push(new Promise(function (resolve, reject) {
                        var item = itemManager.getByID(itemData.id);
                        if (item != undefined) {
                            itemOperations.moveItemNoInventoryValidation(item, inventoryManager.get(itemData.inventoryUniqueName), new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows), itemData.rotation, itemData.isFlipped, function (success) {
                                resolve();
                            });
                        }
                    }));
                    break;
                case "drop":
                    break;
            }
        };
        for (var itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++) {
            _loop_1(itemOperationsDataIndex);
        }
        Promise.all(promises).then(function () {
        });
    }
    else {
        console.log("[jc3mp-inventory] Network error: Failed to validate item operations from player " + player.client.name + " (" + player.client.steamId + ")");
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemCreate", function (player, itemData) {
    itemData = JSON.parse(itemData);
    var inventory = inventoryManager.get(itemData.inventoryUniqueName);
    var inventoryPosition = new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
    var itemFactory = itemFactoryManager.get(itemData.type, "default");
    if (itemFactory != undefined) {
        var item_1 = itemFactory.assemble();
        item_1.rotation = itemData.rotation;
        item_1.isFlipped = itemData.isFlipped;
        item_1.updateSlots();
        if (inventory.isItemWithinInventory(item_1, inventoryPosition) && inventory.canItemBePlaced(item_1, inventoryPosition)) {
            itemManager.add(item_1);
            inventory.addItem(item_1, inventoryPosition);
        }
        else {
            item_1.destroy();
            console.log("[jc3mp-inventory] Network error: Inventory position data is invalid for creating item from player " + player.client.name + " (" + player.client.steamId + ")");
        }
        database.saveInventory(inventory, true, function () {
            if (inventory === player["inventory"]) {
                sendItems(player, [item_1]);
            }
        });
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemUse", function (player, itemID) {
    var item = itemManager.getByID(itemID);
    if (item != undefined) {
        itemOperations.playerUseItem(item, player);
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemDestroy", function (player, itemID) {
    var item = itemManager.getByID(itemID);
    if (item != undefined) {
        itemOperations.playerDestroyItem(item, player);
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/uiReady", function (player) {
    if (player["inventory"] != undefined) {
        sendInventory(player, player["inventory"], true, true);
    }
});
