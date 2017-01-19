"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class AppleItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.hunger = 30;
		this.thirst = 20;
		
		this.name = "Apple";
		this.defaultSlots = [
			[1],
		];
	}
}

itemFactoryManager.add(AppleItem.name, "default", new ItemFactory(() =>
{
	return new AppleItem();
}));
