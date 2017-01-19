"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class MilkGallonItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.thirst = 85;
		
		this.name = "Milk Gallon";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}

itemFactoryManager.add(MilkGallonItem.name, "default", new ItemFactory(() =>
{
	return new MilkGallonItem();
}));
