"use strict";
import {Inventory} from "./classes/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as items from "./classes/items";
import * as database from "./database";
import * as network from "./network";


if(typeof jcmp != "undefined")
{
	jcmp.events.Add("PlayerReady", (player) => {
		const inventoryUniqueName = `player${player.client.steamId}`;
		
		database.loadInventory(inventoryUniqueName, true, (inventory) =>
		{
			if(inventory == undefined)
			{
				const playerInventory = player["inventory"] = new Inventory("Inventory", new Vector2Grid(20, 14));
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
		});
	});
}
