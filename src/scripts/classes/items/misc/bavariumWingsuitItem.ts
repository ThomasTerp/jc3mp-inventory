"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class BavariumWingsuitItem extends Item
{
	constructor()
	{
		super();
		
		this.destroyOnUse = false;
		this.name = "Bavarium Wingsuit Booster";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		];
	}
}

itemFactoryManager.add(BavariumWingsuitItem.name, "default", new ItemFactory(() =>
{
	return new BavariumWingsuitItem();
}));
