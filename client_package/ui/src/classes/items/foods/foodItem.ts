"use strict";
import {Item} from "./../item";
import * as labels from "./../../../labels";


export abstract class FoodItem extends Item
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
		this.updateDescription();
	}
	
	updateDescription()
	{
		let description = ``;
		
		if(this.health !== 0)
		{
			description += `Restore ` + labels.health() + ` by ` + labels.percentage(this.health);
		}
		
		if(this.hunger !== 0)
		{
			description += (this.hunger > 0 ? `Decrease` : `Increase`) + ` ` + labels.hunger() + ` by ` + labels.percentage(this.hunger) + `<br />`;
		}
		
		if(this.thirst !== 0)
		{
			description += (this.thirst > 0 ? `Decrease` : `Increase`) + ` ` + labels.thirst() + ` by ` + labels.percentage(this.thirst) + `<br />`;
		}
		
		this.description = description;
	}
}
