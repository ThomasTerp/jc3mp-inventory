"use strict";
import {InventorySlot} from "./inventorySlot";

class Inventory
{
	size: Vector2;
	items: any[];
	slots: InventorySlot[][];
	
	constructor(size: Vector2)
	{
		this.size = size;
		this.items = [];
		this.slots = [];
	}
	
	getSlot(position: Vector2): InventorySlot
	{
		return this.slots[position.y][position.x];
	}
	
	setSlotsItem(item: any): void
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
	
	unsetSlotsItem(item: any): void
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
	
	addItem(item: any, position: Vector2): void
	{
		this.items[item.id] = item;
		
		item.createHTML();
		
		item.inventoryWindow = this;
		item.inventoryPosition = position;
		item.state = "inventory";
		
		this.setSlotsItem(item);
	}
	
	removeItem(item: any): void
	{
		this.unsetSlotsItem(item);
		
		item.inventoryWindow = null;
		item.inventoryPosition = null;
		item.state = "invalid";
		
		delete this.items[item.id];
	}
	
	isItemWithinInventory(item: any, position: Vector2): boolean
	{
		let itemSize = item.getSize();
		
		return position.x + itemSize.width <= this.size.x && position.y + itemSize.height <= this.size.y;
	}
	
	canItemBePlaced(item: any, position: Vector2): boolean
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
