"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class U39PlechovkaItem extends Item
{
	constructor()
	{
		super();
		
		this.category = "Weapons";
		this.name = "U-39 Plechovka";
		this.defaultSlots = [
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 0],
		];
	}
}

itemFactoryManager.add(U39PlechovkaItem.name, "default", new ItemFactory(() =>
{
	return new U39PlechovkaItem();
}));
