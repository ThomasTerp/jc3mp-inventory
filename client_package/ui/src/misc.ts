"use strict";
import {AdminWindow} from "./classes/windows/adminWindow";
import {InventoryWindow} from "./classes/windows/inventoryWindow";
import {Vector2Grid} from "./classes/vector2Grid";
import * as localInventoryWindow from "./localInventoryWindow";
import * as windowManager from "./managers/windowManager";
import * as client from "./client";


//For browser testing
if(typeof jcmp == "undefined")
{
	//Local inventory
	let inventoryWindow = new InventoryWindow("Inventory", new Vector2Grid(18, 12));
	windowManager.add("local", inventoryWindow);
	localInventoryWindow.set(inventoryWindow);
}


//Admin window
let adminWindow = new AdminWindow("Items");
windowManager.add("adminWindow", adminWindow);


let chatIsOpen = false;

if(typeof jcmp != "undefined")
{
	//Chat visibility state
	jcmp.AddEvent("chat_input_state", function(state) {
	    chatIsOpen = state;
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
			client.itemOperations();
		}
	});
}

$(document).on("keydown", (event) =>
{
	if(!chatIsOpen)
	{
		switch(event.which)
		{
			//Key I
			//Toggle InventoryWindow.localInventoryWindow
			case 73:
				if(localInventoryWindow.exists())
				{
					localInventoryWindow.get().toggle();
				}
				
				break;
			
			//Key O
			//Toggle adminWindow
			case 79:
				adminWindow.toggle();
				
				break;
			
			//Exit this function if any other keys triggered the event
			default:
				return;
		}
	}
});

//Disable all text selection
$.fn.disableSelection = function()
{
    return this
		.attr("unselectable", "on")
        .css("user-select", "none")
		.on("selectstart", false);
};
