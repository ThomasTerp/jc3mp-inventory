"use strict";
import {InventoryWindow} from "./classes/windows/inventoryWindow";
import {Vector2Grid} from "./classes/vector2Grid";
import * as itemManager from "./managers/itemManager";
import * as windowManager from "./managers/windowManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as localInventoryWindow from "./localInventoryWindow";


const changesMap: Map<number, string> = new Map();
const preChangesMap: Map<number, any> = new Map();

export function addChange(itemIndex: number, change: string): void
{
	changesMap.set(itemIndex, change)
}

export function addPreChange(itemIndex: number, preChange: any): void
{
	preChangesMap.set(itemIndex, preChange)
}

export function clearChanges(): void
{
	changesMap.clear();
	preChangesMap.clear();
}

/** Send changes to server and clear changesMap */
export function sendChanges()
{
	const changesData = [];
	
	for(let [itemIndex, change] of changesMap.entries())
	{
		const item = itemManager.getByItemIndex(itemIndex);
		
		if(item != undefined)
		{
			const preChange = preChangesMap.get(itemIndex);
			
			if(preChange != undefined)
			{
				switch(change)
				{
					//When an item is moved in any way
					case "move":
						if(change === "move")
						{
							//If a item does not have an ID, and if the player is an admin (server sided check), a new item will be created
							if(item.id == undefined)
							{
								const finalNetworkChange = {
									changeType: "create",
									type: item.constructor.name,
									rotation: item.rotation,
									isFlipped: item.isFlipped
								} as any;
								
								if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
								{
									finalNetworkChange.inventoryUniqueName = item.inventoryWindow.uniqueName,
									finalNetworkChange.inventoryPosition = {
										cols: item.inventoryPosition.cols,
										rows: item.inventoryPosition.rows
									}
								}
								
								changesData.push(finalNetworkChange);
							}
							else
							{
								//If the item has actually changed in any way
								if(
									item.rotation !== preChange.rotation ||
									item.isFlipped !== preChange.isFlipped ||
									item.inventoryWindow !== preChange.inventoryWindow ||
									item.inventoryPosition !== preChange.inventoryPosition
								)
								{
									const finalNetworkChange = {
										changeType: "move",
										id: item.id,
										rotation: item.rotation,
										isFlipped: item.isFlipped
									} as any;
									
									if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
									{
										finalNetworkChange.inventoryUniqueName = item.inventoryWindow.uniqueName,
										finalNetworkChange.inventoryPosition = {
											cols: item.inventoryPosition.cols,
											rows: item.inventoryPosition.rows
										}
									}
									
									changesData.push(finalNetworkChange);
								}
							}
						}
						
						break;
					
					//When an item is dropped (dragged outside inventories)
					case "drop":
						//If a item does not have an ID, and if the player is an admin (server sided check), an new item will be created and dropped
						if(item.id == undefined)
						{
							changesData.push({
								changeType: "dropCreate",
								type: item.constructor.name,
							});
						}
						else
						{
							changesData.push({
								changeType: "drop",
								id: item.id
							});
						}
						
						break;
				}
			}
		}
	}
	
	if(changesData.length > 0)
	{
		if(typeof jcmp != "undefined")
		{
			jcmp.CallEvent("jc3mp-inventory/client/sendChanges", JSON.stringify(changesData));
		}
	}
	
	clearChanges();
}

export function requestLocalInventory()
{
	jcmp.CallEvent("jc3mp-inventory/client/requestLocalInventory");
}


//Events from server

if(typeof jcmp != "undefined")
{
	jcmp.AddEvent("jc3mp-inventory/ui/sendInventory", (inventoryData) =>
	{
		inventoryData = JSON.parse(inventoryData);
		let inventoryWindow = windowManager.get(inventoryData.uniqueName) as InventoryWindow;
		
		if(inventoryWindow == undefined)
		{
			inventoryWindow = new InventoryWindow(inventoryData.name, new Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
			windowManager.add(inventoryData.uniqueName, inventoryWindow);
		}
		
		if(inventoryData.isLocal)
		{
			//Open local inventory, if it is the first time it was sent
			if(!localInventoryWindow.exists())
			{
				inventoryWindow.show();
			}
			
			localInventoryWindow.set(inventoryWindow);
		}
	});

	jcmp.AddEvent("jc3mp-inventory/ui/sendItems", (itemsData) =>
	{
		itemsData = JSON.parse(itemsData);
		
		itemsData.forEach((itemData, itemDataIndex) =>
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
					item.rotation = itemData.rotation;
					item.isFlipped = itemData.isFlipped;
					
					item.updateSlots();
					
					itemManager.add(item);
				}
			}
			
			if(itemData.inventoryUniqueName != undefined)
			{
				const inventoryWindow = windowManager.get(itemData.inventoryUniqueName) as InventoryWindow;
				
				if(inventoryWindow != undefined)
				{
					if(item.inventoryWindow != undefined)
					{
						item.inventoryWindow.removeItem(item);
					}
					
					item.rotation = itemData.rotation;
					item.isFlipped = itemData.isFlipped;
					
					item.updateSlots();
					
					inventoryWindow.addItem(item, new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows))
				}
			}
		});
	});
}
