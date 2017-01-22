"use strict";
var inventory_1 = require("./classes/inventory");
var vector2Grid_1 = require("./classes/vector2Grid");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
var itemFactoryManager = require("./managers/itemFactoryManager");
var database = require("./database");
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
                var itemData = convertItemToData(item);
                if (itemData != undefined) {
                    data_1.items.push(itemData);
                }
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
        var itemData = convertItemToData(item);
        if (itemData != undefined) {
            data.items.push(itemData);
        }
    });
    jcmp.events.CallRemote("jc3mp-inventory/network/inventoriesAndItemsData", player, JSON.stringify(data));
}
exports.sendItems = sendItems;
function convertItemToData(item) {
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
        return itemData;
    }
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
            var item = itemManager.get(itemData.id);
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
                    var item = itemManager.get(itemData.id);
                    if (item != undefined) {
                        var testInventory_1 = testInventoriesMap.get(itemData.inventoryUniqueName);
                        var itemFactory_1 = itemFactoryManager.get(item.constructor.name, "default");
                        if (itemFactory_1 != undefined) {
                            var inventoryPosition = new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
                            var testItem = itemFactory_1.assemble();
                            testItem.rotation = itemData.rotation;
                            testItem.isFlipped = itemData.isFlipped;
                            testItem.updateSlots();
                            if (testInventory_1.isItemWithinInventory(testItem, inventoryPosition) && testInventory_1.canItemBePlaced(testItem, inventoryPosition)) {
                                testInventory_1.addItem(testItem, inventoryPosition);
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
                case "create":
                    var testInventory = testInventoriesMap.get(itemData.inventoryUniqueName);
                    var itemFactory = itemFactoryManager.get(itemData.type, "default");
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
                    break;
                case "dropCreate":
                    break;
            }
        }
    }
    if (success) {
        var _loop_1 = function (itemOperationsDataIndex) {
            var itemData = itemOperationsData[itemOperationsDataIndex];
            switch (itemData.itemOperationType) {
                case "move":
                    (function () {
                        var destinationInventory = inventoryManager.get(itemData.inventoryUniqueName);
                        var destinationInventoryPosition = new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
                        var item = itemManager.get(itemData.id);
                        if (item.inventory != undefined) {
                            item.inventory.removeItem(item);
                        }
                        item.rotation = itemData.rotation;
                        item.isFlipped = itemData.isFlipped;
                        item.updateSlots();
                        destinationInventory.addItem(item, destinationInventoryPosition);
                    })();
                    break;
                case "drop":
                    break;
                case "create":
                    (function () {
                        var inventory = inventoryManager.get(itemData.inventoryUniqueName);
                        var inventoryPosition = new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
                        var itemFactory = itemFactoryManager.get(itemData.type, "default");
                        if (itemFactory != undefined) {
                            var item = itemFactory.assemble();
                            item.rotation = itemData.rotation;
                            item.isFlipped = itemData.isFlipped;
                            item.updateSlots();
                            inventory.addItem(item, inventoryPosition);
                            if (item.inventory === player["inventory"]) {
                                itemsToSendBack.push(item);
                            }
                        }
                    })();
                    break;
                case "dropCreate":
                    break;
            }
        };
        for (var itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++) {
            _loop_1(itemOperationsDataIndex);
        }
        testInventoriesMap.forEach(function (testInventory, uniqueName) {
            var inventory = inventoryManager.get(uniqueName);
            database.saveInventory(inventory, true, function () {
                sendItems(player, itemsToSendBack);
            });
        });
    }
    else {
        console.log("[jc3mp-inventory] Network error: Failed to validate item operations from player " + player.client.name + " (" + player.client.steamId + ")");
    }
});
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/uiReady", function (player) {
    if (player["inventory"] != undefined) {
        sendInventory(player, player["inventory"], true, true);
    }
});
