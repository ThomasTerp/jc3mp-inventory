"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inventory_1 = require("./classes/inventories/inventory");
var playerInventory_1 = require("./classes/inventories/playerInventory");
var vector2Grid_1 = require("./classes/vector2Grid");
var items = require("./classes/items");
var inventoryManager = require("./managers/inventoryManager");
var itemManager = require("./managers/itemManager");
var itemFactoryManager = require("./managers/itemFactoryManager");
var network = require("./network");
var database = require("./database");
jcmp.events.Add("jc3mp-inventory/server/getInventoryClasses", function () {
    return {
        Inventory: inventory_1.Inventory,
        PlayerInventory: playerInventory_1.PlayerInventory
    };
});
jcmp.events.Add("jc3mp-inventory/server/getItemClasses", function () {
    return items;
});
jcmp.events.Add("jc3mp-inventory/server/getItemFactoryClass", function () {
    return vector2Grid_1.Vector2Grid;
});
jcmp.events.Add("jc3mp-inventory/server/getVector2GridClass", function () {
    return vector2Grid_1.Vector2Grid;
});
jcmp.events.Add("jc3mp-inventory/server/getInventoryManager", function () {
    return inventoryManager;
});
jcmp.events.Add("jc3mp-inventory/server/getItemManager", function () {
    return itemManager;
});
jcmp.events.Add("jc3mp-inventory/server/getItemFactoryManager", function () {
    return itemFactoryManager;
});
jcmp.events.Add("jc3mp-inventory/server/getNetwork", function () {
    return network;
});
jcmp.events.Add("jc3mp-inventory/server/getDatabase", function () {
    return database;
});
