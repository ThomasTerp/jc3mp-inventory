"use strict";
import redis = require("redis");
import {Inventory} from "./scripts/classes/inventory";
import "./scripts/classes/items";
import * as items from "./scripts/classes/items";
import * as database from "./scripts/database";
import * as network from "./scripts/network";
import * as inventoryManager from "./scripts/managers/inventoryManager";
import * as itemManager from "./scripts/managers/itemManager";


jcmp.events.Add("PlayerReady", (player) => {
	const inventoryUniqueName = `player${player.client.steamId}`;
	
	database.loadInventory(inventoryUniqueName, true, (inventory) =>
	{
		new Promise((resolve, reject) =>
		{
			if(inventory === undefined)
			{
				player.inventory = new Inventory(new Vector2(10, 20));
				player.inventory.uniqueName = inventoryUniqueName;
				
				player.inventory.addItem(new items.AppleItem(), new Vector2(0, 0));
				player.inventory.addItem(new items.GasCanItem(), new Vector2(1, 0));
				player.inventory.addItem(new items.GasCanItem(), new Vector2(4, 0));
				
				database.saveInventory(player.inventory, true, () =>
				{
					resolve();
				});
			}
			else
			{
				player.inventory = inventory;
				
				resolve();
			}
		}).then(() =>
		{
			setTimeout(() =>
			{
				network.sendInventory(player, player.inventory, true);
			}, 5000);
		}).catch((err) =>
		{
			console.log(err);
		});
	});
});
