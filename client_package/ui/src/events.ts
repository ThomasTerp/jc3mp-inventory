"use strict";
import * as windowManager from "./windowManager";
import * as itemManager from "./itemManager";
import * as itemTypeManager from "./itemTypeManager";
import {InventoryWindow, setLocalInventoryWindow} from "./inventoryWindow"
import {Vector2} from "./vector2";


jcmp.AddEvent("jc3mp-inventory/ui/sendInventory", (inventoryData) =>
{
	inventoryData = JSON.parse(inventoryData);
	let inventoryWindow = windowManager.get(inventoryData.uniqueName) as InventoryWindow;
	
	if(inventoryWindow === undefined)
	{
		inventoryWindow = new InventoryWindow(inventoryData.uniqueName, new Vector2(inventoryData.size.x, inventoryData.size.y));
		windowManager.add(inventoryData.uniqueName, inventoryWindow);
	}
	
	if(inventoryData.isLocal)
	{
		setLocalInventoryWindow(inventoryWindow);
	}
});

jcmp.AddEvent("jc3mp-inventory/ui/sendItems", (itemsData) =>
{
	itemsData = JSON.parse(itemsData);
	
	itemsData.forEach((itemData, itemDataIndex) =>
	{
		let item = itemManager.get(itemData.id);
		
		if(item === undefined)
		{
			const constructors = itemTypeManager.get(itemData.type);
			const constructor = constructors !== undefined ? constructors[0] : undefined;
			
			if(constructor === undefined)
			{
				console.log(`[jc3mp-inventory] Error: Item type (${itemData.type}) does not have a constructor in the item type manager`);
			}
			else
			{
				item = constructor();
				item.rotation = itemData.rotation;
				item.isFlipped = itemData.isFlipped;
				
				itemManager.add(item.id, item);
				
				if(itemData.inventoryUniqueName !== undefined)
				{
					const inventoryWindow = windowManager.get(itemData.inventoryUniqueName) as InventoryWindow;
					
					if(inventoryWindow !== undefined)
					{
						console.log(inventoryWindow)
						
						inventoryWindow.removeItem(item);
						inventoryWindow.addItem(item, new Vector2(itemData.inventoryPosition.x, itemData.inventoryPosition.y))
					}
				}
			}
		}
	});
});
