"use strict";
import "./classes/items";
import "./itemSelection";
import "./tooltip";
import "./events";
import * as windowManager from "./managers/windowManager";
import {getLocalInventoryWindow} from "./classes/windows/inventoryWindow";
import {AdminWindow} from "./classes/windows/adminWindow";


//Admin window
let adminWindow = new AdminWindow("Items");
windowManager.add("adminWindow", adminWindow);


let chatIsOpen = false;

if(typeof jcmp !== "undefined")
{
	jcmp.AddEvent('chat_input_state', function(state) {
	    chatIsOpen = state;
	});
}

$(document).on("keydown", (event) =>
{
	if(!chatIsOpen)
	{
		switch(event.which)
		{
			//Key I
			case 73:
				const inventoryWindow = getLocalInventoryWindow();
				
				if(inventoryWindow !== null)
				{
					inventoryWindow.toggle();
				}
				
				break;
			
			//Key O
			case 79:
				adminWindow.toggle();
				
				break;
			
			//Exit this function if any other keys triggered the event
			default:
				return;
		}
	}
});
