"use strict";
import {Vector2Grid} from "./classes/vector2Grid";
import {InventoryWindow, setLocalInventoryWindow, sendNetworkChanges} from "./classes/windows/inventoryWindow"
import * as windowManager from "./managers/windowManager";
import * as itemManager from "./managers/itemManager";
import * as itemFactoryManager from "./managers/itemFactoryManager";


if(typeof jcmp !== "undefined")
{
	jcmp.AddEvent("jc3mp-inventory/ui/sendInventory", (inventoryData) =>
	{
		inventoryData = JSON.parse(inventoryData);
		let inventoryWindow = windowManager.get(inventoryData.uniqueName) as InventoryWindow;
		
		if(inventoryWindow === undefined)
		{
			inventoryWindow = new InventoryWindow(inventoryData.uniqueName, new Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
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
			let item = itemManager.getByID(itemData.id);
			
			if(item === undefined)
			{
				const constructors = itemFactoryManager.get(itemData.type, "default");
				const constructor = constructors !== undefined ? constructors[0] : undefined;
				
				if(constructor === undefined)
				{
					console.log(`[jc3mp-inventory] Error: Item type (${itemData.type}) does not have a default factory in the item factory manager`);
				}
				else
				{
					item = constructor();
					item.id = itemData.id;
					item.rotation = itemData.rotation;
					item.isFlipped = itemData.isFlipped;
					
					item.updateSlots();
					
					itemManager.add(item);
				}
			}
			
			if(itemData.inventoryUniqueName !== undefined)
			{
				const inventoryWindow = windowManager.get(itemData.inventoryUniqueName) as InventoryWindow;
				
				if(inventoryWindow !== undefined)
				{
					if(item.inventoryWindow !== undefined)
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

	jcmp.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
		if(isVisible)
		{
			jcmp.ShowCursor();
		}
		else
		{
			jcmp.HideCursor();
		}
		
		//Send inventory and item changes to server when all windows are closed
		if(!windowManager.isAnyWindowVisible())
		{
			sendNetworkChanges();
		}
	});
}
