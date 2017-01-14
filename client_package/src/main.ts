"use strict";


const ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;



jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) =>
{
    jcmp.localPlayer.controlsEnabled = !isVisible;
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendInventory", (inventoryData) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/sendInventory", inventoryData);
	
	inventoryData = JSON.parse(inventoryData);
	
	jcmp.events.CallRemote("jc3mp-inventory/network/requestInventoryItems", inventoryData.uniqueName);
});

jcmp.events.AddRemoteCallable("jc3mp-inventory/network/sendItems", (itemsData) =>
{
	jcmp.ui.CallEvent("jc3mp-inventory/ui/sendItems", itemsData);
});
