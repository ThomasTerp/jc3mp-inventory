"use strict";
import "./item";
import "./tooltip";
import "./itemSelection";
import "./events";
import * as ItemManager from "./itemManager";
import * as ItemTypeManager from "./ItemTypeManager";
import * as WindowManager from "./windowManager";
import {InventoryWindow, getLocalInventoryWindow} from "./inventoryWindow";
import {AdminWindow} from "./adminWindow";
import {Vector2} from "./vector2";


//Admin window
let adminWindow = new AdminWindow("Items");
WindowManager.add("adminWindow", adminWindow);


let chatIsOpen = false;

jcmp.AddEvent('chat_input_state', function(state) {
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
});

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
