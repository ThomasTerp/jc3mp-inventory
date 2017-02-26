"use strict";
import {InventoryWindow} from "./classes/windows/inventoryWindow";
import {Vector2Grid} from "./classes/vector2Grid";
import {Item} from "./classes/item";
import * as itemManager from "./managers/itemManager";
import * as windowManager from "./managers/windowManager";
import * as localInventoryWindow from "./localInventoryWindow";


const itemOperationsMap: Map<number, string> = new Map();
const preItemOperationsMap: Map<number, any> = new Map();

export function convertItemToOperation(item: Item, itemOperationType: string): any
{
	let itemOperation = {} as any;
	
	switch(itemOperationType)
	{
		//When an item is moved in any way
		case "move":
			itemOperation = {
				itemOperationType: "move",
				id: item.id,
				rotation: item.rotation,
				isFlipped: item.isFlipped
			};
			
			if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
			{
				itemOperation.inventoryUniqueName = item.inventoryWindow.uniqueName,
				itemOperation.inventoryPosition = {
					cols: item.inventoryPosition.cols,
					rows: item.inventoryPosition.rows
				}
			}
			
			break;
			
		//When an item is dropped (dragged outside inventories)
		case "drop":
			itemOperation = {
				itemOperationType: "drop",
				id: item.id
			};
			
			break;
	}
	
	return itemOperation;
}

export function addItemOperation(itemIndex: number, itemOperationType: string): void
{
	itemOperationsMap.set(itemIndex, itemOperationType)
	
	const item = itemManager.getByItemIndex(itemIndex);
	
	if(item != undefined && item.id != undefined)
	{
		if(typeof jcmp != "undefined")
		{
			jcmp.CallEvent("jc3mp-inventory/client/itemOperation", JSON.stringify(convertItemToOperation(item, itemOperationType)));
		}
	}
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
export function itemOperations()
{
	const itemOperationsData = [];
	
	for(let [itemIndex, itemOperationType] of itemOperationsMap.entries())
	{
		const item = itemManager.getByItemIndex(itemIndex);
		
		if(item != undefined && item.id != undefined)
		{
			itemOperationsData.push(convertItemToOperation(item, itemOperationType));
		}
	}
	
	if(itemOperationsData.length > 0)
	{
		if(typeof jcmp != "undefined")
		{
			jcmp.CallEvent("jc3mp-inventory/client/itemOperations", JSON.stringify(itemOperationsData));
		}
	}
	
	clearItemOperations();
}

export function itemCreate(item: Item)
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
	}
	
	if(typeof jcmp != "undefined")
	{
		jcmp.CallEvent("jc3mp-inventory/client/itemCreate", JSON.stringify(itemData));
	}
}

export function itemUse(item: Item): void
{
	if(typeof jcmp != "undefined" && item.id != undefined)
	{
		jcmp.CallEvent("jc3mp-inventory/client/itemUse", item.id);
	}
}

export function itemDestroy(item: Item): void
{
	if(typeof jcmp != "undefined" && item.id != undefined)
	{
		jcmp.CallEvent("jc3mp-inventory/client/itemDestroy", item.id);
	}
}

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
					item = new Item();
					item.type = itemData.type;
					item.id = itemData.id;
					item.padding = itemData.padding;
					item.canUse = itemData.canUse;
					item.canDestroy = itemData.canDestroy;
					item.category = itemData.category;
					item.useText = itemData.useText;
					item.destroyOnUse = itemData.destroyOnUse;
					item.name = itemData.name;
					item.description = itemData.description;
					item.src = itemData.src;
					item.tooltip = itemData.tooltip;
					item.defaultSlots = itemData.defaultSlots;
					
					itemManager.add(item);
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
