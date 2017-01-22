"use strict";
import {InventoryWindow} from "./classes/windows/inventoryWindow";
import {Vector2Grid} from "./classes/vector2Grid";
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
		console.log(itemIndex)
		if(item != undefined)
		{
			switch(itemOperation)
			{
				//When an item is moved in any way
				case "move":
					//If a item does not have an ID, and if the player is an admin (server sided check), a new item will be created
					if(item.id == undefined)
					{
						const itemOperationData = {
							itemOperationType: "create",
							type: item.constructor.name,
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
							
							item.inventoryWindow.removeItem(item);
						}
						
						itemManager.remove(item);
						item.destroy();
						
						itemOperationsData.push(itemOperationData);
					}
					else
					{
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
					}
					
					break;
				
				//When an item is dropped (dragged outside inventories)
				case "drop":
					//If a item does not have an ID, and if the player is an admin (server sided check), an new item will be created and dropped
					if(item.id == undefined)
					{
						itemOperationsData.push({
							itemOperationType: "dropCreate",
							type: item.constructor.name,
						});
					}
					else
					{
						itemOperationsData.push({
							itemOperationType: "drop",
							id: item.id
						});
					}
					
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
