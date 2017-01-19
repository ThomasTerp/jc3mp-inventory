"use strict";
import {Inventory, InventorySlot} from "./../inventory";
import {Vector2Grid} from "./../vector2Grid";
import * as util from "./../../util";


//Item base
export abstract class Item
{
	id: number;
	rotation: number;
	isFlipped: boolean;
	slots: number[][];
	inventory: Inventory;
	inventoryPosition: Vector2Grid;
	category: string;
	name: string;
	
	private _defaultSlots: number[][]
	set defaultSlots(value)
	{
		this._defaultSlots = value;
		this.slots = this.getDefaultSlotsClone();
	}
	get defaultSlots()
	{
		return this._defaultSlots;
	}
	
	constructor()
	{
		this.rotation = 0;
		this.isFlipped = false;
		
		this.category = "Misc";
		this.name = "Item " + (this.id == undefined ? "(NO ID)" : this.id);
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
	
	getDefaultSlotsClone(): number[][]
	{
		return util.cloneObject(this.defaultSlots);
	}
	
	/** Get size without rotations and flipping */
	getDefaultSize(): Vector2Grid
	{
		return new Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
	}
	
	/** Get size with rotations and flipping */
	getSize(): Vector2Grid
	{
		return new Vector2Grid(this.slots[0].length, this.slots.length);
	}
	
	updateSlots(): void
	{
		this.slots = this.getDefaultSlotsClone();
		
		if(this.isFlipped)
		{
			for(let rows = 0; rows < this.getDefaultSize().rows; rows++)
			{
				this.slots[rows].reverse();
			}
		}
		
		this.slots = util.rotateMatrix(this.slots, this.rotation);
	}
}
