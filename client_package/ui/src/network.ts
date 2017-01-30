"use strict";
import {InventoryWindow} from "./classes/windows/inventoryWindow";
import {Vector2Grid} from "./classes/vector2Grid";
import {Item} from "./classes/items";
import * as itemManager from "./managers/itemManager";
import * as windowManager from "./managers/windowManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as localInventoryWindow from "./localInventoryWindow";


const itemOperationsMap: Map<number, string> = new Map();
const preItemOperationsMap: Map<number, any> = new Map();

export function addItemOperation(itemIndex: number, itemOperation: string): void
{
	itemOperationsMap.set(itemIndex, itemOperation)
}

export function addPreItemOperation(itemIndex: number, preItemOperation: any): void
{
	preItemOperationsMap.set(itemIndex, preItemOperation)
}

export function clearItemOperations(): void
{
	itemOperationsMap.clear();
	preItemOperationsMap.clear();
}

/** Send item operations to server and clear operations here */
export function sendItemOperations()
{
	const itemOperationsData = [];
	
	for(let [itemIndex, itemOperation] of itemOperationsMap.entries())
	{
		const item = itemManager.getByItemIndex(itemIndex);
		
		if(item != undefined && item.id != undefined)
		{
			switch(itemOperation)
			{
				//When an item is moved in any way
				case "move":
					const preItemOperation = preItemOperationsMap.get(itemIndex);
					
					if(preItemOperation != undefined)
					{
						//If the item has actually changed in any way
						if(
							item.rotation !== preItemOperation.rotation ||
							item.isFlipped !== preItemOperation.isFlipped ||
							item.inventoryWindow !== preItemOperation.inventoryWindow ||
							item.inventoryPosition !== preItemOperation.inventoryPosition
						)
						{
							const itemOperationData = {
								itemOperationType: "move",
								id: item.id,
								rotation: item.rotation,
								isFlipped: item.isFlipped
							} as any;
							
							if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
							{
								itemOperationData.inventoryUniqueName = item.inventoryWindow.uniqueName,
								itemOperationData.inventoryPosition = {
									cols: item.inventoryPosition.cols,
									rows: item.inventoryPosition.rows
								}
							}
							
							itemOperationsData.push(itemOperationData);
						}
					}
					
					break;
				
				//When an item is dropped (dragged outside inventories)
				case "drop":
					itemOperationsData.push({
						itemOperationType: "drop",
						id: item.id
					});
					
					break;
			}
		}
	}
	
	if(itemOperationsData.length > 0)
	{
		if(typeof jcmp != "undefined")
		{
			jcmp.CallEvent("jc3mp-inventory/client/sendItemOperations", JSON.stringify(itemOperationsData));
		}
	}
	
	clearItemOperations();
}

export function sendItemCreate(item: Item)
{
	const itemData = {
		type: item.constructor.name,
		rotation: item.rotation,
		isFlipped: item.isFlipped
	} as any;
	
	if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
	{
		itemData.inventoryUniqueName = item.inventoryWindow.uniqueName,
		itemData.inventoryPosition = {
			cols: item.inventoryPosition.cols,
			rows: item.inventoryPosition.rows
		}
		
		if(typeof jcmp != "undefined")
		{
			item.inventoryWindow.removeItem(item);
		}
	}
	
	if(typeof jcmp != "undefined")
	{
		itemManager.remove(item);
		item.destroy();
		jcmp.CallEvent("jc3mp-inventory/client/sendItemCreate", JSON.stringify(itemData));
	}
}

export function sendItemUse(item: Item): void
{
	if(typeof jcmp != "undefined" && item.id != undefined)
	{
		jcmp.CallEvent("jc3mp-inventory/client/sendItemUse", item.id);
	}
}

export function sendItemDestroy(item: Item): void
{
	if(typeof jcmp != "undefined" && item.id != undefined)
	{
		jcmp.CallEvent("jc3mp-inventory/client/sendItemDestroy", item.id);
	}
}


//Events from server (remote calls)

if(typeof jcmp != "undefined")
{
	jcmp.AddEvent("jc3mp-inventory/ui/inventoriesAndItemsData", (data) =>
	{
		data = JSON.parse(data);
		
		//Inventories
		if(data.inventories != undefined)
		{
			data.inventories.forEach((inventoryData, inventoryDataIndex) =>
			{
				let inventoryWindow = windowManager.get(inventoryData.uniqueName) as InventoryWindow;
				
				if(inventoryWindow == undefined)
				{
					inventoryWindow = new InventoryWindow(inventoryData.name, new Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
					
					windowManager.add(inventoryData.uniqueName, inventoryWindow);
				}
				else
				{
					inventoryWindow.titleHTML = inventoryData.name;
				}
				
				if(inventoryData.isLocal)
				{
					localInventoryWindow.set(inventoryWindow);
				}
			});
		}
		
		//Items
		if(data.items != undefined)
		{
			data.items.forEach((itemData, itemDataIndex) =>
			{
				const item = itemManager.getByID(itemData.id);
				
				if(item != undefined && item.inventoryWindow != undefined)
				{
					item.inventoryWindow.removeItem(item);
				}
			});
			
			data.items.forEach((itemData, itemDataIndex) =>
			{
				let item = itemManager.getByID(itemData.id);
				
				if(item == undefined)
				{
					const itemFactory = itemFactoryManager.get(itemData.type, "default");
					
					if(itemFactory == undefined)
					{
						console.log(`[jc3mp-inventory] Error: Item class (${itemData.type}) does not have a default factory in the item factory manager`);
						
						return;
					}
					else
					{
						item = itemFactory.assemble();
						item.id = itemData.id;
						
						itemManager.add(item);
					}
				}
				
				item.rotation = itemData.rotation;
				item.isFlipped = itemData.isFlipped;
				
				item.updateSlots();
				
				if(itemData.inventoryUniqueName != undefined)
				{
					const inventoryWindow = windowManager.get(itemData.inventoryUniqueName) as InventoryWindow;
					
					if(inventoryWindow != undefined)
					{
						inventoryWindow.addItem(item, new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows))
					}
				}
			});
		}
		
		if(data.inventories != undefined)
		{
			data.inventories.forEach((inventoryData, inventoryDataIndex) =>
			{
				const inventoryWindow = windowManager.get(inventoryData.uniqueName) as InventoryWindow;
				
				if(inventoryWindow != undefined)
				{
					inventoryWindow.updateHTML();
				}
			});
		}
	});
}
