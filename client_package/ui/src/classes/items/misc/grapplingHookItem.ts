"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class GrapplingHookItem extends Item
{
	constructor()
	{
		super();
		
		this.useText = "Equip";
		this.name = "Grappling Hook";
		this.description = "";
		this.src = "images/grappling_hook.png";
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
