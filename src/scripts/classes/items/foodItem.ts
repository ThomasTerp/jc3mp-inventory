"use strict";
import {Item} from "./item";


abstract class FoodItem extends Item
{
	health: number;
	hunger: number;
	thirst: number;
	
	constructor()
	{
		super();
		
		this.health = 0;
		this.hunger = 0;
		this.thirst = 0;
		
		this.category = "Food";
	}
}
export {FoodItem}
