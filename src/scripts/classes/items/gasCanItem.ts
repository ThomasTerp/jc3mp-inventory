"use strict";
import * as ItemTypeManager from "./../../managers/itemTypeManager";
import {Item} from "./item";


class GasCanItem extends Item
{
	constructor()
	{
		super();
		
		this.name = "Gas Can";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}
export {GasCanItem}
ItemTypeManager.add(GasCanItem.name, [
	() =>
	{
		return new GasCanItem();
	}
]);
