"use strict";
import {Inventory} from "./classes/inventories/inventory";
import {PlayerInventory} from "./classes/inventories/playerInventory";
import {Vector2Grid} from "./classes/vector2Grid";
import {ItemFactory} from "./classes/itemFactory";
import * as items from "./classes/items";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as network from "./network";
import * as database from "./database";


jcmp.events.Add("jc3mp-inventory/server/getInventoryClasses", () =>
{
	return {
		Inventory: Inventory,
		PlayerInventory: PlayerInventory
	};
});

jcmp.events.Add("jc3mp-inventory/server/getItemClasses", () =>
{
	return items;
});

jcmp.events.Add("jc3mp-inventory/server/getItemFactoryClass", () =>
{
	return Vector2Grid;
});

jcmp.events.Add("jc3mp-inventory/server/getVector2GridClass", () =>
{
	return Vector2Grid;
});

jcmp.events.Add("jc3mp-inventory/server/getInventoryManager", () =>
{
	return inventoryManager;
});

jcmp.events.Add("jc3mp-inventory/server/getItemManager", () =>
{
	return itemManager;
});

jcmp.events.Add("jc3mp-inventory/server/getItemFactoryManager", () =>
{
	return itemFactoryManager;
});

jcmp.events.Add("jc3mp-inventory/server/getNetwork", () =>
{
	return network;
});

jcmp.events.Add("jc3mp-inventory/server/getDatabase", () =>
{
	return database;
});
