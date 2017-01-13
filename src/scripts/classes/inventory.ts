"use strict";
import {Item} from "./items";
import {InventorySlot} from "./inventorySlot";


class Inventory
{
	uniqueName: string;
	items: Item[];
	slots: InventorySlot[][];
	size: Vector2;
	
	constructor(size: Vector2)
	{
		this.uniqueName = null;
		this.items = [];
		this.size = size;
		this.slots = [];
		
		this.createSlots();
	}
	
	createSlots()
	{
		for(let y = 0; y < this.size.y; y++)
		{
			this.slots[y] = [];
			
			for(let x = 0; x < this.size.x; x++)
			{
				this.slots[y][x] = new InventorySlot(this, new Vector2(x, y));
			}
		}
	}
	
	getSlot(position: Vector2): InventorySlot
	{
		return this.slots[position.y][position.x];
	}
	
	setSlotsItem(item: Item): void
	{
		for(let y = 0; y < item.slots.length; y++)
		{
			for(let x = 0; x < item.slots[y].length; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
					slot.item = item;
				}
			}
		}
	}
	
	unsetSlotsItem(item: Item): void
	{
		for(let y = 0; y < item.slots.length; y++)
		{
			for(let x = 0; x < item.slots[y].length; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
					slot.item = undefined;
				}
			}
		}
	}
	
	addItem(item: Item, position: Vector2): void
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
			
			item.inventory = null;
			item.inventoryPosition = null;
			
			this.items.splice(this.items.indexOf(item), 1);
		}
	}
	
	hasItem(item: Item): boolean
	{
		return this.items.indexOf(item) === -1 ? false : true;
	}
	
	isItemWithinInventory(item: Item, position: Vector2): boolean
	{
		let itemSize = item.getSize();
		
		return position.x + itemSize.width <= this.size.x && position.y + itemSize.height <= this.size.y;
	}
	
	canItemBePlaced(item: Item, position: Vector2): boolean
	{
		let itemSize = item.getSize();
		
		for(let y = 0; y < itemSize.height; y++)
		{
			for(let x = 0; x < itemSize.width; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot(new Vector2(position.x + x, position.y + y));
					
					if(slot.item)
					{
						return false;
					}
				}
			}
		}
		
		return true
	}
}
export {Inventory};
