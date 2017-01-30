"use strict";


export function sendItemOperations(itemOperationsData: any): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
}

export function sendItemCreate(itemData: any): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemCreate", JSON.stringify(itemData));
}

export function sendItemUse(itemID: number): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemUse", itemID);
}

export function sendItemDestroy(itemID: number): void
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemDestroy", itemID);
}

export function sendUIReady()
{
	jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryAndItemsData: any) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", inventoryAndItemsData);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemCreate", (itemData: any) =>
{
	sendItemCreate(JSON.parse(itemData));
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemUse", (itemID: number) =>
{
	sendItemUse(itemID);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemDestroy", (itemID: number) =>
{
	sendItemDestroy(itemID);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemOperations", (itemOperationsData: any) =>
{
	sendItemOperations(JSON.parse(itemOperationsData));
});

jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () =>
{
	sendUIReady();
});
