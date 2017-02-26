"use strict";
import {Inventory} from "./classes/inventories/inventory";
import {Vector2Grid} from "./classes/vector2Grid";
import {Item} from "./classes/items";
import * as inventoryManager from "./managers/inventoryManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";
import * as localInventoryWindow from "./localInventoryWindow";
import * as itemManager from "./managers/itemManager";
import * as ui from "./ui";


export function itemOperations(itemOperationsData: any): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
}

export function itemCreate(itemData: any): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemCreate", JSON.stringify(itemData));
}

export function itemUse(item: Item): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemUse", item.id);
}

export function itemDestroy(item: Item): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemDestroy", item.id);
}

export function sendUIReady()
{
	jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryAndItemsData: any) =>
{
	jcmp.print(inventoryAndItemsData)
	inventoryAndItemsData = JSON.parse(inventoryAndItemsData);
	
	
	//Inventories
	if(inventoryAndItemsData.inventories != undefined)
	{
		inventoryAndItemsData.inventories.forEach((inventoryData, inventoryDataIndex) =>
		{
			let inventory = inventoryManager.get(inventoryData.uniqueName) as Inventory;
			
			if(inventory == undefined)
			{
				inventory = new Inventory(inventoryData.name, new Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
				
				inventoryManager.add(inventoryData.uniqueName, inventory);
			}
			else
			{
				inventory.name = inventoryData.name;
			}
			
			if(inventoryData.isLocal)
			{
				localInventoryWindow.set(inventory);
			}
		});
	}
	
	//Items
	if(inventoryAndItemsData.items != undefined)
	{
		inventoryAndItemsData.items.forEach((itemData, itemDataIndex) =>
		{
			const item = itemManager.getByID(itemData.id);
			
			if(item != undefined && item.inventory != undefined)
			{
				item.inventory.removeItem(item);
			}
		});
		
		inventoryAndItemsData.items.forEach((itemData, itemDataIndex) =>
		{
			let item = itemManager.getByID(itemData.id);
			
			if(item == undefined)
			{
				const itemFactory = itemFactoryManager.get(itemData.type, "default");
				
				if(itemFactory == undefined)
				{
					jcmp.print(`[jc3mp-inventory] Error: Item class (${itemData.type}) does not have a default factory in the item factory manager`);
					
					return;
				}
				else
				{
					item = itemFactory.assemble();
					item.id = itemData.id;
					
					itemData.padding = item.padding;
					itemData.canUse = item.canUse();
					itemData.canDestroy = item.canDestroy();
					itemData.category = item.category;
					itemData.useText = item.useText;
					itemData.destroyOnUse = item.destroyOnUse;
					itemData.name = item.name;
					itemData.description = item.description;
					itemData.src = item.src;
					itemData.tooltip = item.tooltip;
					itemData.defaultSlots = item.defaultSlots;
					
					itemManager.add(item);
				}
			}
			
			item.rotation = itemData.rotation;
			item.isFlipped = itemData.isFlipped;
			
			item.updateSlots();
			
			if(itemData.inventoryUniqueName != undefined)
			{
				const inventory = inventoryManager.get(itemData.inventoryUniqueName) as Inventory;
				
				if(inventory != undefined)
				{
					inventory.addItem(item, new Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows))
				}
			}
		});
	}
	
	ui.inventoriesAndItemsData(inventoryAndItemsData);
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemUse", (itemID) =>
{
	const item = itemManager.getByID(itemID);
	
	if(item != undefined)
	{
		item.use();
		
		if(item.destroyOnUse)
		{
			if(item.inventory != undefined)
			{
				item.inventory.removeItem(item);
			}
			
			itemManager.remove(item);
			item.destroy();
		}
	}
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemDestroy", (itemID) =>
{
	const item = itemManager.getByID(itemID);
	
	if(item != undefined)
	{
		if(item.inventory != undefined)
		{
			item.inventory.removeItem(item);
		}
		
		itemManager.remove(item);
		item.destroy();
	}
});
