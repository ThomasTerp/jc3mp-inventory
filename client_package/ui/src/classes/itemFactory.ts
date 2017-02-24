"use strict";
import {Item} from "./item";


/** Class to assemble items */
export class ItemFactory
{
	assemble: () => Item;
	
	/**
	 * param assemble - Function that returns a new item
	 */
	constructor(assemble: () => Item)
	{
		this.assemble = assemble;
	}
}
