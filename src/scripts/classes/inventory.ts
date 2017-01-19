"use strict";
import {Item} from "./items";
import {Vector2Grid} from "./vector2Grid";


/** Class for an inventory with items */
export class Inventory
{
	uniqueName: string;
	name: string;
	items: Item[];
	slots: InventorySlot[][];
	size: Vector2Grid;
	
	constructor(name: string, size: Vector2Grid)
	{
		this.name = name;
		this.items = [];
		this.size = size;
		this.slots = [];
		
		this.createSlots();
	}
	
	createSlots()
	{
		for(let rows = 0; rows < this.size.rows; rows++)
		{
			this.slots[rows] = [];
			
			for(let cols = 0; cols < this.size.cols; cols++)
			{
				this.slots[rows][cols] = new InventorySlot(this, new Vector2Grid(cols, rows));
			}
		}
	}
	
	getSlot(position: Vector2Grid): InventorySlot
	{
		return this.slots[position.rows][position.cols];
	}
	
	setSlotsItem(item: Item): void
	{
		for(let rows = 0; rows < item.slots.length; rows++)
		{
			for(let cols = 0; cols < item.slots[rows].length; cols++)
			{
				let isSolid = item.slots[rows][cols] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
					slot.item = item;
				}
			}
		}
	}
	
	unsetSlotsItem(item: Item): void
	{
		for(let rows = 0; rows < item.slots.length; rows++)
		{
			for(let cols = 0; cols < item.slots[rows].length; cols++)
			{
				let isSolid = item.slots[rows][cols] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
					slot.item = undefined;
				}
			}
		}
	}
	
	addItem(item: Item, position: Vector2Grid): void
	{
		if(!this.hasItem(item))
		{
			this.items.push(item);
			
			item.inventory = this;
			item.inventoryPosition = position;
			
			this.setSlotsItem(item);
		}
	}
	
	removeItem(item: Item): void
	{
		if(this.hasItem(item))
		{
			this.unsetSlotsItem(item);
			
			item.inventory = undefined;
			item.inventoryPosition = undefined;
			
			this.items.splice(this.items.indexOf(item), 1);
		}
	}
	
	hasItem(item: Item): boolean
	{
		return this.items.indexOf(item) === -1 ? false : true;
	}
	
	/** Returns true if the item will be inside the inventory bounds  */
	isItemWithinInventory(item: Item, position: Vector2Grid): boolean
	{
		let itemSize = item.getSize();
		
		return position.cols + itemSize.cols <= this.size.cols && position.rows + itemSize.rows <= this.size.rows;
	}
	
	/** Returns true if the item will not collide with any other item */
	canItemBePlaced(item: Item, position: Vector2Grid): boolean
	{
		let itemSize = item.getSize();
		
		for(let rows = 0; rows < itemSize.rows; rows++)
		{
			for(let cols = 0; cols < itemSize.cols; cols++)
			{
				let isSolid = item.slots[rows][cols] === 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2Grid(position.cols + cols, position.rows + rows));
					
					if(slot.item != undefined)
					{
						return false;
					}
				}
			}
		}
		
		return true
	}
}

/** Class for a slot in an inventory */
export class InventorySlot
{
	inventory: Inventory;
	position: Vector2Grid;
	item: Item;
	
    constructor(inventoryWindow: Inventory, position: Vector2Grid)
    {
        this.inventory = inventoryWindow;
        this.position = position;
    }
}
