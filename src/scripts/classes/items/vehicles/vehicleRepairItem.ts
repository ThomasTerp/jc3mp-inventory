"use strict";
import {Item} from "./../item";


export abstract class VehicleRepairItem extends Item
{
	repairAmount: number;
	
	constructor()
	{
		super();
		
		this.repairAmount = 100;
		
		this.category = "Vehicles";
	}
}
