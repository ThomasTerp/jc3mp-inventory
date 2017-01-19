"use strict";
import {Item} from "./../item";
import {VehicleRepairItem} from "./vehicleRepairItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class SmallWrenchItem extends VehicleRepairItem
{
	constructor()
	{
		super();
		
		this.repairAmount = 20;
		
		this.name = "Small Wrench";
		this.defaultSlots = [
			[1, 1],
		];
	}
}

itemFactoryManager.add(SmallWrenchItem.name, "default", new ItemFactory(() =>
{
	return new SmallWrenchItem();
}));
