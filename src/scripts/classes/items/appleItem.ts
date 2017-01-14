"use strict";
import * as ItemTypeManager from "./../../managers/itemTypeManager";
import {FoodItem} from "./foodItem";


class AppleItem extends FoodItem
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
export {AppleItem}
ItemTypeManager.add(AppleItem.name, [
	() =>
	{
		return new AppleItem();
	}
]);
