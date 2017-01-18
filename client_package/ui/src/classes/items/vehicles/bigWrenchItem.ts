"use strict";
import {Item} from "./../item";
import {VehicleRepairItem} from "./vehicleRepairItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class BigWrenchItem extends VehicleRepairItem
{
	constructor()
	{
		super();
		
		this.repairAmount = 40;
		
		this.name = "Big Wrench";
		this.updateDescription();
		this.src = "images/big_wrench.png";
		this.defaultSlots = [
			[1, 1, 1],
		];
	}
}

itemFactoryManager.add(BigWrenchItem.name, "default", new ItemFactory(() =>
{
	return new BigWrenchItem();
}));
