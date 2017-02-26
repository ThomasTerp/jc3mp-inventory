"use strict";
import {Vector2Grid} from "./classes/vector2Grid";
import * as network from "./network";
import * as itemManager from "./managers/itemManager";
import * as inventoryManager from "./managers/inventoryManager";


export const ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;


export function inventoriesAndItemsData(data: any)
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", JSON.stringify(data));
}

//Called when the a item operation was performed
jcmp.ui.AddEvent("jc3mp-inventory/client/itemOperation", (itemOperationData: any) =>
{
	itemOperationData = JSON.parse(itemOperationData);
	
	switch(itemOperationData.itemOperationType)
	{
		case "move":
			(() =>
			{
				const item = itemManager.getByID(itemOperationData.id);
				
				if(item != undefined)
				{
					const oldInventory = item.inventory;
					const newInventory = inventoryManager.get(itemOperationData.inventoryUniqueName);
					
					if(oldInventory != undefined)
					{
						oldInventory.removeItem(item);
					}
					
					item.rotation = itemOperationData.rotation;
					item.isFlipped = itemOperationData.isFlipped;
					
					item.updateSlots();
					
					newInventory.addItem(item, new Vector2Grid(itemOperationData.inventoryPosition.cols, itemOperationData.inventoryPosition.rows));
				}
			})();
			
			break;
		
		case "drop":
			(() =>
			{
				const item = itemManager.getByID(itemOperationData.id);
				
				if(item != undefined)
				{
					const oldInventory = item.inventory;
					
					if(oldInventory != undefined)
					{
						oldInventory.removeItem(item);
					}
				}
			})();
			
			break;
	}
});

//Called when the client wants to create an item
jcmp.ui.AddEvent("jc3mp-inventory/client/itemCreate", (itemData: string) =>
{
	network.itemCreate(JSON.parse(itemData));
});

//Called when the client wants to use an item
jcmp.ui.AddEvent("jc3mp-inventory/client/itemUse", (itemID: number) =>
{
	const item = itemManager.getByID(itemID);
	
	if(item.canUse())
	{
		item.callRemoteUse();
	}
});

//Called when the client wants to destroy an item
jcmp.ui.AddEvent("jc3mp-inventory/client/itemDestroy", (itemID: number) =>
{
	const item = itemManager.getByID(itemID);
	
	if(item.canDestroy())
	{
		item.callRemoteUse();
	}
});

jcmp.ui.AddEvent("jc3mp-inventory/client/itemOperations", (itemOperationsData: string) =>
{
	network.itemOperations(JSON.parse(itemOperationsData));
});

jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () =>
{
	network.sendUIReady();
});
