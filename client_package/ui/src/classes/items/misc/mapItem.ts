"use strict";
import {Item} from "./../item";
import {ItemFactory} from "./../../itemFactory";
import * as itemFactoryManager from "./../../../managers/itemFactoryManager";


export class MapItem extends Item
{
	constructor()
	{
		super();
		
		this.useText = "Examine";
		this.name = "Map";
		this.description = "It has a red marker";
		this.src = "images/map.png";
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
