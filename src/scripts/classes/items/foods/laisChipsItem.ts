"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class LaisChipsItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.hunger = 60;
		this.thirst = -20;
		
		this.name = "Lais Chips";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}

itemFactoryManager.add(LaisChipsItem.name, "default", new ItemFactory(() =>
{
	return new LaisChipsItem();
}));
