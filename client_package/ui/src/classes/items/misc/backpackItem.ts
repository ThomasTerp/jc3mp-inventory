"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import {InventoryWindow} from "./../../windows/inventoryWindow";
import {Vector2Grid} from "./../../vector2Grid";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";
import * as windowManager from "./../../../managers/windowManager";


export class BackpackItem extends Item
{
	backpackInventoryWindow: InventoryWindow;
	
	constructor()
	{
		super();
		
		this.backpackInventoryWindow = new InventoryWindow("Backpack", new Vector2Grid(4, 6));
		windowManager.add("backpack" + this.id, this.backpackInventoryWindow);
		
		this.useText = "Equip";
		this.name = "Backpack";
		this.updateDescription();
		this.src = "images/backpack.png";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		];
	}
	
	updateDescription()
	{
		this.description = `Size: ` + this.backpackInventoryWindow.size.cols + `x` + this.backpackInventoryWindow.size.rows;
	}
}

itemFactoryManager.add(BackpackItem.name, "default", new ItemFactory(() =>
{
	return new BackpackItem();
}));
