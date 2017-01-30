"use strict";
import {Item} from "./../item";
import * as labels from "./../../../labels";


export abstract class VehicleRepairItem extends Item
{
	repairAmount: number;
	
	constructor()
	{
		super();
		
		this.repairAmount = 100;
		
		this.category = "Vehicles";
		this.destroyOnUse = true;
		this.updateDescription();
	}
	
	updateDescription()
	{
		let description = "";
		
		if(this.repairAmount !== 0)
		{
			description = labels.repair(`Repair`) + ` a vehicle by ` + labels.percentage(this.repairAmount);
		}
		
		this.description = description;
	}
}
