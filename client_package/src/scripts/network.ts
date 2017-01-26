"use strict";


export function sendItemOperations(itemOperationsData: any)
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
}

export function sendItemCreate(itemData: any)
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemCreate", JSON.stringify(itemData));
}

export function sendUIReady()
{
	jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryAndItemsData: any) =>
{
	jcmp.print(inventoryAndItemsData)
	jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", inventoryAndItemsData);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemCreate", (itemData: any) =>
{
	sendItemCreate(JSON.parse(itemData))
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemOperations", (itemOperationsData: any) =>
{
	sendItemOperations(JSON.parse(itemOperationsData))
});

jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () =>
{
	sendUIReady();
});
