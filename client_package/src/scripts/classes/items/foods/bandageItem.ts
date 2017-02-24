"use strict";
import {Item} from "./../item";
import {FoodItem} from "./foodItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class BandageItem extends FoodItem
{
	constructor()
	{
		super();
		
		this.health = 50;
		
		this.name = "Bandage";
		this.updateDescription();
		this.src = "images/bandage.png";
		this.defaultSlots = [
			[1],
			[1],
		];
	}
}

itemFactoryManager.add(BandageItem.name, "default", new ItemFactory(() =>
{
	return new BandageItem();
}));
