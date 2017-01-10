"use strict";
import "./item";
import "./tooltip";
import "./itemSelection";
import * as ItemManager from "./itemManager";
import * as ItemTypeManager from "./windowManager";
import * as WindowManager from "./windowManager";
import {InventoryWindow} from "./inventoryWindow"
import {AdminWindow} from "./adminWindow"
import {Vector2} from "./vector2";


//Local inventory
let localInventoryWindow = new InventoryWindow("Inventory", new Vector2(20, 12));
WindowManager.add("local", localInventoryWindow);

//Loot crate 1
let lootInventoryWindow = new InventoryWindow("Loot Crate", new Vector2(10, 10));
WindowManager.add("loot1", lootInventoryWindow);

//Loot crate 2
let loot2InventoryWindow = new InventoryWindow("Loot Crate 2", new Vector2(10, 10));
WindowManager.add("loot2", loot2InventoryWindow);

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
				localInventoryWindow.toggle();
				
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
