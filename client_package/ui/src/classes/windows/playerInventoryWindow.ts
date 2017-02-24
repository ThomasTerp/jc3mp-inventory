"use strict";
import {InventoryWindow} from "./inventoryWindow";
import {Vector2Grid} from "./../vector2Grid";


export class PlayerInventoryWindow extends InventoryWindow
{
	constructor(titleHTML: string, size: Vector2Grid)
	{
		super(titleHTML, size);
	}
}
