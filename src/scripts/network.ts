"use strict";
import {Item} from "./classes/items";
import {Inventory} from "./classes/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemManager from "./managers/itemManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as database from "./database";


export function sendInventory(player: Player, inventory: Inventory, includeItems = true, isLocal = false): void
{
	if(inventory.uniqueName == undefined)
	{
		throw `[jc3mp-inventory] Network error: Inventory does not have an uniqueName`;
	}
	else
	{
		const data = {
			inventories: [],
		} as any;
		
		const inventoryData = convertInventoryToData(inventory);
		
		if(isLocal)
		{
			inventoryData.isLocal = true;
		}
		
		data.inventories.push(inventoryData);
		
		if(includeItems)
		{
			data.items = [];
			
			inventory.items.forEach((item, itemIndex) =>
			{
				data.items.push(convertItemToData(item));
			});
		}
		
		jcmp.events.CallRemote("jc3mp-inventory/network/inventoriesAndItemsData", player, JSON.stringify(data));
	}
}

export function sendItems(player: Player, items: Item[]): void
{
	const data = {
		items: []
	};
	
	items.forEach((item, itemIndex) =>
	{
		data.items.push(convertItemToData(item));
	});
	
	jcmp.events.CallRemote("jc3mp-inventory/network/inventoriesAndItemsData", player, JSON.stringify(data));
}

/**
 * Convert an item into data that can be used for sending to client.
 * Returns undefined if item does not have an ID
 */
export function convertItemToData(item: Item): any
{
	const itemData = {
		type: item.constructor.name,
		rotation: item.rotation,
		isFlipped: item.isFlipped,
	} as any;
	
	if(item.id != undefined)
	{
		itemData.id = item.id
	}
	
	if(item.inventory != undefined && item.inventory.uniqueName != undefined)
	{
		itemData.inventoryUniqueName = item.inventory.uniqueName;
		itemData.inventoryPosition = {
			cols: item.inventoryPosition.cols,
			rows: item.inventoryPosition.rows
		};
	}
	
	return itemData;
}

export function convertInventoryToData(inventory: Inventory)
{
	if(inventory.uniqueName != undefined)
	{
		return {
			uniqueName: inventory.uniqueName,
			name: inventory.name,
			size: {
				cols: inventory.size.cols,
				rows: inventory.size.rows
			}
		} as any;
	}
}

//Handle items being moved, dropped, used, etc
jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemOperations", (player: Player, itemOperationsData: any) =>
{
	itemOperationsData = JSON.parse(itemOperationsData);
	const itemsToSendBack = [];
	
	
	/** Step 1: Put all items that will be moved into a map, these will be needed when setting slot states in the test inventories **/
	
	const moveItemsMap: Map<Item, boolean> = new Map();
	
	for(let itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++)
	{
		const itemData = itemOperationsData[itemOperationsDataIndex];
		
		if(itemData.itemOperationType === "move" && itemData.id != undefined)
		{
			const item = itemManager.getByID(itemData.id);
			
			if(item != undefined)
			{
				moveItemsMap.set(item, true);
			}
		}
	}
	
	/** Step 2: Create a test inventory for each inventory that is being used, the test inventory is only for testing if the item is placed in a valid position **/
	
	const testInventoriesMap: Map<string, Inventory> = new Map();
	
	for(let itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++)
	{
		const itemData = itemOperationsData[itemOperationsDataIndex];
		
		if(itemData.inventoryUniqueName != undefined && itemData.inventoryPosition != undefined && testInventoriesMap.get(itemData.inventoryUniqueName) == undefined)
		{
			const inventory = inventoryManager.get(itemData.inventoryUniqueName);
			
			if(inventory != undefined)
			{
				const testInventory = new Inventory(inventory.name, inventory.size);
				const itemDummy = {} as Item;
				
				//Put an item dummy on filled slots
				for(let rows = 0; rows < testInventory.size.rows; rows++)
				{
					let log = "";
					
					for(let cols = 0; cols < testInventory.size.cols; cols++)
					{
						const inventoryItem = inventory.slots[rows][cols].item;
						
						if(inventoryItem != undefined && moveItemsMap.get(inventoryItem) == undefined)
						{
							testInventory.slots[rows][cols].item = itemDummy;
						}
						
						log += testInventory.slots[rows][cols].item == undefined ? "0" : "1";
					}
				}
				
				testInventoriesMap.set(itemData.inventoryUniqueName, testInventory);
			}
		}
	}
	
	/** Step 3: Put the test items inside test the inventories, which is going to test if all the item operations are valid */
	
	let success = true;
	
	for(let itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++)
	{
		if(success)
		{
			const itemData = itemOperationsData[itemOperationsDataIndex];
			
			switch(itemData.itemOperationType)
			{
				case "move":
					const item = itemManager.getByID(itemData.id);
					
					if(item != undefined)
					{
						const testInventory = testInventoriesMap.get(itemData.inventoryUniqueName);
						const itemFactory = itemFactoryManager.get(item.constructor.name, "default");
						
						if(itemFactory != undefined)
						{
							const inventoryPosition = new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
							
							const testItem = itemFactory.assemble();
							testItem.rotation = itemData.rotation;
							testItem.isFlipped = itemData.isFlipped;
							
							testItem.updateSlots();
							
							if(testInventory.isItemWithinInventory(testItem, inventoryPosition) && testInventory.canItemBePlaced(testItem, inventoryPosition))
							{
								testInventory.addItem(testItem, inventoryPosition);
							}
							else
							{
								success = false;
							}
						}
						else
						{
							success = false;
						}
					}
					
					break;
			
				case "drop":
					
					break;
				
				case "create":
					const testInventory = testInventoriesMap.get(itemData.inventoryUniqueName);
					const itemFactory = itemFactoryManager.get(itemData.type, "default");
					
					if(itemFactory != undefined)
					{
						const inventoryPosition = new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
						
						const testItem = itemFactory.assemble();
						testItem.rotation = itemData.rotation;
						testItem.isFlipped = itemData.isFlipped;
						
						testItem.updateSlots();
						
						if(testInventory.isItemWithinInventory(testItem, inventoryPosition) && testInventory.canItemBePlaced(testItem, inventoryPosition))
						{
							testInventory.addItem(testItem, inventoryPosition);
						}
						else
						{
							success = false;
						}
					}
					else
					{
						success = false;
					}
					
					break;
			
				case "dropCreate":
					
					break;
			}
		}
	}
	
	if(success)
	{
		for(let itemOperationsDataIndex = 0; itemOperationsDataIndex < itemOperationsData.length; itemOperationsDataIndex++)
		{
			const itemData = itemOperationsData[itemOperationsDataIndex];
			
			switch(itemData.itemOperationType)
			{
				case "move":
					(() =>
					{
						const destinationInventory = inventoryManager.get(itemData.inventoryUniqueName);
						const destinationInventoryPosition = new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
						
						const item = itemManager.getByID(itemData.id);
						
						if(item.inventory != undefined)
						{
							item.inventory.removeItem(item);
						}
						
						item.rotation = itemData.rotation;
						item.isFlipped = itemData.isFlipped;
						
						item.updateSlots();
						
						destinationInventory.addItem(item, destinationInventoryPosition);
					})();
					
					break;
				
				case "drop":
					
					break;
			}
		}
		
		testInventoriesMap.forEach((testInventory, uniqueName) =>
		{
			const inventory = inventoryManager.get(uniqueName);
			database.saveInventory(inventory, true, () =>
			{
				sendItems(player, itemsToSendBack);
			});
		});
	}
	else
	{
		console.log(`[jc3mp-inventory] Network error: Failed to validate item operations from player ${player.client.name} (${player.client.steamId})`)
	}
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemCreate", (player: Player, itemData: any) =>
{
	itemData = JSON.parse(itemData);
	
	const inventory = inventoryManager.get(itemData.inventoryUniqueName);
	const inventoryPosition = new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows);
	const itemFactory = itemFactoryManager.get(itemData.type, "default");
	
	if(itemFactory != undefined)
	{
		const item = itemFactory.assemble();
		item.rotation = itemData.rotation;
		item.isFlipped = itemData.isFlipped;
		item.updateSlots();
		
		if(inventory.isItemWithinInventory(item, inventoryPosition) && inventory.canItemBePlaced(item, inventoryPosition))
		{
			itemManager.add(item);
			inventory.addItem(item, inventoryPosition);
		}
		else
		{
			item.destroy();
			
			console.log(`[jc3mp-inventory] Network error: Inventory position data is invalid for creating item from player ${player.client.name} (${player.client.steamId})`)
		}
		
		database.saveInventory(inventory, true, () =>
		{
			if(inventory === player["inventory"])
			{
				sendItems(player, [item]);
			}
		});
	}
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/uiReady", (player: Player) =>
{
	if(player["inventory"] != undefined)
	{
		sendInventory(player, player["inventory"], true, true);
	}
})
