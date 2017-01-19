"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class FirstAidKitItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.health = 100;
		
		this.name = "First Aid Kit";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
}

itemFactoryManager.add(FirstAidKitItem.name, "default", new ItemFactory(() =>
{
	return new FirstAidKitItem();
}));
