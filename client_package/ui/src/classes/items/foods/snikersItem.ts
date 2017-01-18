"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class SnikersItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.hunger = 20;
		
		this.name = "Snikers";
		this.updateDescription();
		this.src = "images/snikers.png";
		this.defaultSlots = [
			[1, 1],
		];
	}
}

itemFactoryManager.add(SnikersItem.name, "default", new ItemFactory(() =>
{
	return new SnikersItem();
}));
