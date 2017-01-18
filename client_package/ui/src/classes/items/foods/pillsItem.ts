"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class PillsItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.health = 20;
		
		this.name = "Pills";
		this.updateDescription();
		this.src = "images/pills.png";
		this.defaultSlots = [
			[1],
		];
	}
}

itemFactoryManager.add(PillsItem.name, "default", new ItemFactory(() =>
{
	return new PillsItem();
}));
