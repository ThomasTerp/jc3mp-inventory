"use strict";
var inventory_1 = require("./classes/inventory");
var vector2Grid_1 = require("./classes/vector2Grid");
var items = require("./classes/items");
var database = require("./database");
if (typeof jcmp != "undefined") {
    jcmp.events.Add("PlayerReady", function (player) {
        var inventoryUniqueName = "player" + player.client.steamId;
        database.loadInventory(inventoryUniqueName, true, function (inventory) {
            if (inventory == undefined) {
                var playerInventory = player["inventory"] = new inventory_1.Inventory("Inventory", new vector2Grid_1.Vector2Grid(10, 20));
                playerInventory.uniqueName = inventoryUniqueName;
                playerInventory.addItem(new items.AppleItem(), new vector2Grid_1.Vector2Grid(0, 0));
                playerInventory.addItem(new items.GasCanItem(), new vector2Grid_1.Vector2Grid(1, 0));
                playerInventory.addItem(new items.GasCanItem(), new vector2Grid_1.Vector2Grid(4, 0));
                database.saveInventory(playerInventory, true);
            }
            else {
                player["inventory"] = inventory;
            }
        });
    });
}
