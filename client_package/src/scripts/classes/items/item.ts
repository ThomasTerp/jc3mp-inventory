"use strict";
import {Inventory, InventorySlot} from "./../inventories/inventory";
import {Vector2Grid} from "./../vector2Grid";
import * as itemFactoryManager from "./../../managers/itemFactoryManager";
import * as windowManager from "./../../managers/inventoryManager";
import * as network from "./../../network";
import * as labels from "./../../labels";
import * as util from "./../../util";


//Item base
export abstract class Item
{
	id: number;
	rotation: number;
	isFlipped: boolean;
	isSelected: boolean;
	padding: number;
	slots: number[][];
	inventory: Inventory;
	inventoryPosition: Vector2Grid;
	category: string;
	useText: string;
	destroyOnUse: boolean;
	name: string;
	description: string;
	src: string;
	
	_defaultSlots: number[][]
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
		this.padding = 2;
		
		this.category = "Misc";
		this.useText = "Use";
		this.destroyOnUse = true;
		this.name = "Item";
		this.description = "";
		this.src = "images/item_base.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
	
	get tooltip(): string
	{
		return "<b>" + this.name + "</b><br />" + this.description;
	}
	
	/** The callRemoteUse method will only be called if this returns true */
	canUse(): boolean
	{
		return true
	}
	
	/**
	 * Tells the server that the local player wants to use this item.
	 * If the serverside canUse method returns true, the serverside use method will be called, which also calls the clientside use method
	 */
	callRemoteUse(): void
	{
		network.itemUse(this);
	}
	
	/** Called after the serverside canUse and use methods has been called */
	use(): void
	{
		
	}
	
	/** The callRemoteDestroy method will only be called if this returns true */
	canDestroy()
	{
		return true;
	}
	
	/** Called after the serverside canDestroy and destroy methods has been called */
	destroy()
	{
		
	}
	
	/** Tells the server that the local player wants to destroy this item */
	callRemoteDestroy()
	{
		network.itemDestroy(this);
	}
	
	getDefaultSlotsClone(): number[][]
	{
		return util.cloneObject(this.defaultSlots);
	}
	
	//Get size without rotations
	getDefaultSize(): Vector2Grid
	{
		return new Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
	}
	
	//Get size with rotations
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
