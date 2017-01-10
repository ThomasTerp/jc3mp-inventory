"use strict";
import {Inventory} from "./inventory";


//Class for a slot in an inventory
class InventorySlot
{
	inventory: Inventory;
	position: Vector2;
	item: any;
	
    constructor(inventoryWindow: Inventory, position: Vector2)
    {
        this.inventory = inventoryWindow;
        this.position = position;
		this.item = null;
    }
}
export {InventorySlot};
