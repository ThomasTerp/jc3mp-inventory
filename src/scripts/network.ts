"use strict";
import {Item} from "./classes/items";
import {Inventory} from "./classes/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";
import * as database from "./database";


export function sendInventory(player: Player, inventory: Inventory, isLocal: boolean = false): void
{
	if(inventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Network error: Inventory does not have an uniqueName`;
	}
	else
	{
		const inventoryData = {
			uniqueName: inventory.uniqueName,
			name: inventory.name,
			size: {
				cols: inventory.size.cols,
				rows: inventory.size.rows
			}
		} as any;
		
		if(isLocal)
		{
			inventoryData.isLocal = true;
		}
		
		jcmp.events.CallRemote("jc3mp-inventory/network/sendInventory", player, JSON.stringify(inventoryData));
	}
}

export function sendItems(player: Player, items: Item[]): void
{
	const itemsData = [];
	
	items.forEach((item, itemIndex) =>
	{
		if(item.id != undefined)
		{
			const itemData = {
				type: item.constructor.name,
				id: item.id,
				rotation: item.rotation,
				isFlipped: item.isFlipped,
			} as any;
			
			if(item.inventory != undefined)
			{
				itemData.inventoryUniqueName = item.inventory.uniqueName;
				itemData.inventoryPosition = {
					cols: item.inventoryPosition.cols,
					rows: item.inventoryPosition.rows
				};
			}
			
			itemsData.push(itemData);
		}
	});
	
	jcmp.events.CallRemote("jc3mp-inventory/network/sendItems", player, JSON.stringify(itemsData));
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestInventoryItems", (player, inventoryUniqueName) =>
{
	const inventory = inventoryManager.get(inventoryUniqueName);
	
	if(inventory != undefined)
	{
		sendItems(player, inventory.items);
	}
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendChanges", (player, changesData) =>
{
	if(player.inventory == undefined)
	{
		console.log(`[jc3mp-inventory] Warning: Player "${player.client.name}" (${player.client.steamId} tried to make changes to their inventory, but they do not have an inventory`)
	}
	else
	{
		changesData = JSON.parse(changesData);
		let resendInventory = false;
		
		for(let changesDataIndex = 0; changesDataIndex < changesData.length; changesDataIndex++)
		{
			const changeData = changesData[changesDataIndex];
			
			switch(changeData.changeType)
			{
				case "move":
					const item = itemManager.get(changeData.id);
					
					if(item == undefined)
					{
						console.log(`[jc3mp-inventory] Warning: Player "${player.client.name}" (${player.client.steamId} tried to move a non existing item`)
						resendInventory = true;
						
						break;
					}
					
					const newInventory = inventoryManager.get(changeData.inventoryUniqueName);
					
					if(newInventory != undefined)
					{
						if(item.inventory != undefined)
						{
							item.inventory.removeItem(item);
						}
						
						item.rotation = changeData.rotation;
						item.isFlipped = changeData.isFlipped;
						
						item.updateSlots();
						
						newInventory.addItem(item, new Vector2Grid(changeData.inventoryPosition.cols, changeData.inventoryPosition.rows));
					}
					
					break;
			
				case "drop":
					
					break;
				
				case "create":
					
					break;
			
				case "dropCreate":
					
					break;
			}
		}
		
		database.saveInventory(player.inventory, true);
	}
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/requestLocalInventory", (player) =>
{
	if(player["inventory"] != undefined)
	{
		sendInventory(player, player["inventory"], true);
	}
});
