"use strict";
import {Inventory} from "./classes/inventories/inventory";


let localInventoryWindow: Inventory;

export function set(inventoryWindow: Inventory): void
{
	localInventoryWindow = inventoryWindow;
}

export function get(): Inventory
{
	return localInventoryWindow;
}

export function exists(): boolean
{
	return localInventoryWindow != undefined;
}
