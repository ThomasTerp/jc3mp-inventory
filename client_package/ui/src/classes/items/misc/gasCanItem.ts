"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class GasCanItem extends Item
{
	constructor()
	{
		super();
		
		this.destroyOnUse = true;
		this.name = "Gas Can";
		this.src = "images/gas_can.png";
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
