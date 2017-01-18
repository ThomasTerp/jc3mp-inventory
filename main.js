"use strict";
var inventory_1 = require("./scripts/classes/inventory");
require("./scripts/classes/items");
var items = require("./scripts/classes/items");
var database = require("./scripts/database");
var network = require("./scripts/network");
jcmp.events.Add("PlayerReady", function (player) {
    var inventoryUniqueName = "player" + player.client.steamId;
    database.loadInventory(inventoryUniqueName, true, function (inventory) {
        new Promise(function (resolve, reject) {
            if (inventory === undefined) {
                player.inventory = new inventory_1.Inventory(new Vector2(10, 20));
                player.inventory.uniqueName = inventoryUniqueName;
                player.inventory.addItem(new items.AppleItem(), new Vector2(0, 0));
                player.inventory.addItem(new items.GasCanItem(), new Vector2(1, 0));
                player.inventory.addItem(new items.GasCanItem(), new Vector2(4, 0));
                database.saveInventory(player.inventory, true, function () {
                    resolve();
                });
            }
            else {
                player.inventory = inventory;
                resolve();
            }
        }).then(function () {
            setTimeout(function () {
                network.sendInventory(player, player.inventory, true);
            }, 5000);
        }).catch(function (err) {
            console.log(err);
        });
    });
});
