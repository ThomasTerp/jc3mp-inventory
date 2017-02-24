"use strict";
import {PlayerInventory} from "./classes/inventories/playerInventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as items from "./classes/items";
import * as database from "./database";
import * as network from "./network";


if(typeof jcmp != "undefined")
{
	jcmp.events.Add("PlayerReady", (player) => {
		const inventoryUniqueName = `player${player.client.steamId}`;
		
		database.loadInventory(inventoryUniqueName, true,
			(type, name, size) =>
			{
				return new PlayerInventory(name, size, player);
			},
			(inventory) =>
			{
				if(inventory == undefined)
				{
					//Create new inventory for player and give starting items
					
					const playerInventory = player["inventory"] = new PlayerInventory("Inventory", new Vector2Grid(20, 14), player);
					playerInventory.uniqueName = inventoryUniqueName;
					
					playerInventory.addItem(new items.AppleItem(), new Vector2Grid(0, 0));
					playerInventory.addItem(new items.GasCanItem(), new Vector2Grid(1, 0));
					playerInventory.addItem(new items.GasCanItem(), new Vector2Grid(4, 0));
					
					database.saveInventory(playerInventory, true);
				}
				else
				{
					player["inventory"] = inventory;
				}
			}
		);
	});
}
