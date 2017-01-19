"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class WaterBottleItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.thirst = 65;
		
		this.name = "Water Bottle";
		this.defaultSlots = [
			[1],
			[1],
			[1],
		];
	}
}

itemFactoryManager.add(WaterBottleItem.name, "default", new ItemFactory(() =>
{
	return new WaterBottleItem();
}));
