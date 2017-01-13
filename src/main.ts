"use strict";
import redis = require("redis");
import {Inventory} from "./scripts/classes/inventory";
import * as items from "./scripts/classes/items";
import * as database from "./scripts/database";
import * as inventoryManager from "./scripts/managers/inventoryManager";
import * as itemManager from "./scripts/managers/itemManager";

/*const testInventory = new Inventory(new Vector2(20, 10));
inventoryManager.add("testInventory", testInventory);

const item1 = new items.GasCanItem();
testInventory.addItem(item1, new Vector2(0, 0));

database.saveItem(item1, () =>
{
	console.log(`Saved item${item1.id}`);
});*/

/*const testInventory = new Inventory(new Vector2(20, 10));
inventoryManager.add("testInventory", testInventory)
database.saveInventory(testInventory, () =>
{
	console.log("SAVED")
});

database.loadInventory("testInventory", true, (inventory) =>
{
	const item1 = new items.GasCanItem();
	inventory.addItem(item1, new Vector2(0, 0));
	
	database.saveInventory(inventory, () =>
	{
		database.loadInventory("testInventory", true, (inventory) =>
		{
			console.log(inventory)
		});
	});
});*/

/*database.loadInventory("testInventory", false, (inventory) =>
{
	console.log(inventory);
})*/
