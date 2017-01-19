"use strict";
import {InventoryWindow} from "./classes/windows/inventoryWindow";


let localInventoryWindow: InventoryWindow;

export function set(inventoryWindow: InventoryWindow): void
{
	localInventoryWindow = inventoryWindow;
}

export function get(): InventoryWindow
{
	return localInventoryWindow;
}

export function exists(): boolean
{
	return localInventoryWindow != undefined;
}
