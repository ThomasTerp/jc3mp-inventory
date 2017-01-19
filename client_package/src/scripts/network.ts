"use strict";


export function requestInventoryItems(inventoryUniqueName)
{
	jcmp.events.CallRemote("jc3mp-inventory/network/requestInventoryItems", inventoryUniqueName);
}

export function sendChanges(changesData)
{
	jcmp.events.CallRemote("jc3mp-inventory/network/sendChanges", JSON.stringify(changesData));
}

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendInventory", (inventoryData) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/sendInventory", inventoryData);
	
	inventoryData = JSON.parse(inventoryData);
	
	requestInventoryItems(inventoryData.uniqueName)
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendItems", (itemsData) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/sendItems", itemsData);
});

jcmp.ui.AddEvent("jc3mp-inventory/client/sendChanges", (changesData) =>
{
	sendChanges(JSON.parse(changesData))
});

jcmp.ui.AddEvent("jc3mp-inventory/client/requestLocalInventory", () =>
{
	jcmp.events.CallRemote("jc3mp-inventory/network/requestLocalInventory");
});
