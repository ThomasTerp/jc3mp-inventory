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
		this.useText = "Equip";
		this.destroyOnUse = false;
		this.name = "U-39 Plechovka";
		this.src = "images/u39_plechovka.png";
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
