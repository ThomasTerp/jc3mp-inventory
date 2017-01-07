"use strict";
import * as ItemManager from "./itemManager";
import * as Util from "./util";
import {InventorySlot} from "./inventorySlot";
import {Item} from "./item";
import {Vector2} from "./vector2";


interface ForEachInItemManagerCallbackFunction
{
	(itemDrag: ItemDrag): any
}
export {ForEachInItemManagerCallbackFunction}

//Class for dragging items
class ItemDrag
{
	static slotModifications = new Map();
	
	static undoSlotModifications(): void
	{
		ItemDrag.slotModifications.forEach((oldState, slot) =>
		{
			slot.state = oldState;
		});
		
		ItemDrag.slotModifications.clear();
	}
	
	//Calls a provided function once per item with itemDrag, in an item manager
	//shouldBreak callback(itemDrag)
	static forEachInItemManager(callback: ForEachInItemManagerCallbackFunction): void
	{
		ItemManager.forEach((id, item) =>
		{
			if(item.itemDrag)
			{
				if(callback(item.itemDrag))
				{
					return true;
				}
			}
		});
	}
	
	static isAnyItemBeingDragged(): boolean
	{
		let isAnyItemBeingDragged = false;
		
		ItemDrag.undoSlotModifications();
		
		ItemDrag.forEachInItemManager((itemDrag) =>
		{
			isAnyItemBeingDragged = true;
			
			return true;
		});
		
		return isAnyItemBeingDragged
	}
	
	item: Item;
	offset: Vector2;
	hasMoved: boolean;
	
	constructor(item: Item, offset: Vector2)
	{
		this.item = item;
		this.offset = offset;
		
		this.hasMoved = false;
	}
	
	getPosition(): Vector2
	{
		let cursorPosition = Util.getCursorPosition();
		
		return new Vector2(cursorPosition.x + this.offset.x, cursorPosition.y + this.offset.y);
	}
	
	getCursorOffset(): Vector2
	{
		let position = this.getPosition();
		let cursorPosition = Util.getCursorPosition();
		
		return new Vector2(cursorPosition.x - position.x, cursorPosition.y - position.y)
	}
	
	getSlot(position: Vector2): InventorySlot
	{
		let elementFromPointOffset = InventorySlot.getPixelSize() * 0.5;
		let element = $(document.elementFromPoint(position.x + elementFromPointOffset, position.y + elementFromPointOffset));
		
		if(element.hasClass("slot"))
		{
			return element.data("slot");
		}
	}
	
	update(): void
	{
		if(!this.hasMoved)
		{
			this.startMove();
			
			this.hasMoved = true;
		}
		
		let position = this.getPosition();
		
		this.item.html.css({
			"left": position.x + "px",
			"top": position.y + "px"
		});
		
		let slot = this.getSlot(position);
		let isValidPosition = true;
		
		if(slot && slot.inventoryWindow.isItemWithinInventory(this.item, slot.position))
		{
			let itemSize = this.item.getSize();
			
			for(let y = 0; y < itemSize.height; y++)
			{
				for(let x = 0; x < itemSize.width; x++)
				{
					let isSolid = this.item.slots[y][x] == 1;
					
					if(isSolid)
					{
						let slot2 = slot.inventoryWindow.getSlot(new Vector2(slot.position.x + x, slot.position.y + y));
						
						if(!ItemDrag.slotModifications.has(slot2))
						{
							ItemDrag.slotModifications.set(slot2, slot2.state);
							
							if(slot2.item)
							{
								isValidPosition = false;
								
								slot2.state = "hover-item";
							}
							else
							{
								slot2.state = "hover";
							}
						}
					}
				}
			}
		}
		else
		{
			isValidPosition = false;
		}
		
		if(isValidPosition)
		{
			this.item.state = "dragging";
		}
		else
		{
			this.item.state = "invalid";
		}
	}
	
	startMove(): void
	{
		this.item.html.css("pointer-events", "none");
		
		if(this.item.inventoryWindow)
		{
			this.item.inventoryWindow.removeItem(this.item);
		}
	}
}
export {ItemDrag};
