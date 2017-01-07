"use strict";
import "./item";
import "./tooltip";
import * as ItemManager from "./itemManager";
import * as ItemTypeManager from "./windowManager";
import * as WindowManager from "./windowManager";
import {InventoryWindow} from "./inventoryWindow"
import {AdminWindow} from "./adminWindow"
import {Vector2} from "./vector2";


//Local inventory
let localInventoryWindow = new InventoryWindow("Inventory", new Vector2(20, 12));
WindowManager.add("local", localInventoryWindow);
localInventoryWindow.hide();

//Loot crate 1
let lootInventoryWindow = new InventoryWindow("Loot Crate", new Vector2(10, 10));
WindowManager.add("loot1", lootInventoryWindow);
lootInventoryWindow.hide();

//Loot crate 2
let loot2InventoryWindow = new InventoryWindow("Loot Crate 2", new Vector2(10, 10));
WindowManager.add("loot2", loot2InventoryWindow);
loot2InventoryWindow.hide();

//Admin window
let adminWindow = new AdminWindow("Items");
WindowManager.add("adminWindow", adminWindow);
adminWindow.hide();


$(document).on("keydown", (event) =>
{
	//Key: I
	if(event.which == 73)
	{
		localInventoryWindow.toggle();
	}
	else if(event.which == 79)
	{
		adminWindow.toggle();
	}
});
