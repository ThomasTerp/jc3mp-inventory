"use strict";


export function sendItemOperations(itemOperationsData)
{
	jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
}

export function sendUIReady()
{
	jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryData) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", inventoryData);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendItemOperations", (itemOperationsData) =>
{
	sendItemOperations(JSON.parse(itemOperationsData))
});

jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () =>
{
	sendUIReady();
});
