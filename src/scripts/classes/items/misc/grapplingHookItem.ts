"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class GrapplingHookItem extends Item
{
	constructor()
	{
		super();
		
		this.destroyOnUse = false;
		this.name = "Grappling Hook";
		this.defaultSlots = [
			[1, 1, 1, 1],
			[1, 1, 1, 1],
		];
	}
}

itemFactoryManager.add(GrapplingHookItem.name, "default", new ItemFactory(() =>
{
	return new GrapplingHookItem();
}));
