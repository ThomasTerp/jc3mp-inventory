"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import {Inventory} from "./../../inventories/inventory";
import {Vector2Grid} from "./../../vector2Grid";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";
import * as inventoryManager from "./../../../managers/inventoryManager";


export class BackpackItem extends Item
{
	backpackInventory: Inventory;
	
	constructor()
	{
		super();
		
		this.backpackInventory = new Inventory("Backpack", new Vector2Grid(4, 6));
		inventoryManager.add("backpack" + this.id, this.backpackInventory);
		
		this.useText = "Equip";
		this.destroyOnUse = false;
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
		this.description = `Size: ` + this.backpackInventory.size.cols + `x` + this.backpackInventory.size.rows;
	}
}

itemFactoryManager.add(BackpackItem.name, "default", new ItemFactory(() =>
{
	return new BackpackItem();
}));
