"use strict";
import {Item} from "./../item";
import {VehicleRepairItem} from "./vehicleRepairItem";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class ToolboxItem extends VehicleRepairItem
{
	constructor()
	{
		super();
		
		this.repairAmount = 100;
		
		this.name = "Toolbox";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
		];
	}
}

itemFactoryManager.add(ToolboxItem.name, "default", new ItemFactory(() =>
{
	return new ToolboxItem();
}));
