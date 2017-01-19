"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class RavelloBeansItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.hunger = 40;
		
		this.name = "Ravello Beans";
		this.defaultSlots = [
			[1],
			[1],
		];
	}
}

itemFactoryManager.add(RavelloBeansItem.name, "default", new ItemFactory(() =>
{
	return new RavelloBeansItem();
}));
