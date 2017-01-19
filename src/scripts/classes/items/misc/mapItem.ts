"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class MapItem extends Item
{
	constructor()
	{
		super();
		
		this.name = "Map";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
}

itemFactoryManager.add(MapItem.name, "default", new ItemFactory(() =>
{
	return new MapItem();
}));
