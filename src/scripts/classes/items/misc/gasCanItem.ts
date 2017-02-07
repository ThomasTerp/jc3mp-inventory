"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class GasCanItem extends Item
{
	constructor()
	{
		super();
		
		this.destroyOnUse = false;
		this.name = "Gas Can";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}

itemFactoryManager.add(GasCanItem.name, "default", new ItemFactory(() =>
{
	return new GasCanItem();
}));
