"use strict";
import * as network from "./network";
import * as itemManager from "./managers/itemManager";


export const ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;


export function inventoriesAndItemsData(data: any)
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", JSON.stringify(data));
}


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
