"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import {Inventory} from "./../../inventory";
import {Vector2Grid} from "./../../vector2Grid";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";
import * as inventoryManager from "./../../../managers/inventoryManager";


export class BackpackItem extends Item
{
	backpackInventoryWindow: Inventory;
	
	constructor()
	{
		super();
		
		//TODO: Figure out how to properly save this
		this.backpackInventoryWindow = new Inventory("Backpack", new Vector2Grid(4, 6));
		
		this.destroyOnUse = false;
		this.name = "Backpack";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		];
	}
}

itemFactoryManager.add(BackpackItem.name, "default", new ItemFactory(() =>
{
	return new BackpackItem();
}));
