"use strict";
import {Item} from "./classes/items"
import {Inventory} from "./classes/inventory"
import * as inventoryManager from "./managers/inventoryManager";
import * as database from "./database";


export function sendInventory(player: Player, inventory: Inventory, isLocal: boolean = false): void
{
	if(inventory.uniqueName === null)
	{
		throw `[jc3mp-inventory] Network error: Inventory does not have an uniqueName`;
	}
	else
	{
		const inventoryData = {
			uniqueName: inventory.uniqueName,
			size: {
				x: inventory.size.x,
				y: inventory.size.y
			}
		}
		
		if(isLocal)
		{
			inventoryData.isLocal = true;
		}
		console.log("SENDING INVENTORY")
		console.log(inventoryData)
		jcmp.events.CallRemote("jc3mp-inventory/network/sendInventory", player, JSON.stringify(inventoryData));
	}
}

export function sendItems(player: Player, items: Item[]): void
{
	const itemsData = [];
	
	items.forEach((item, itemIndex) =>
	{
		if(item.id !== null)
		{
			const itemData = {
				type: item.constructor.name,
				id: item.id,
				rotation: item.rotation,
				isFlipped: item.isFlipped,
			};
			
			if(item.inventory !== null)
			{
				itemData.inventoryUniqueName = item.inventory.uniqueName;
				itemData.inventoryPosition = {
					x: item.inventoryPosition.x,
					y: item.inventoryPosition.y
				};
			}
			
			itemsData.push(itemData);
		}
	});
	console.log("SENDING ITEMS")
	console.log(itemsData)
	jcmp.events.CallRemote("jc3mp-inventory/network/sendItems", player, JSON.stringify(itemsData));
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestInventoryItems", (player, inventoryUniqueName) =>
{
	const inventory = inventoryManager.get(inventoryUniqueName);
	
	if(inventory !== undefined)
	{
		sendItems(player, inventory.items);
	}
});
