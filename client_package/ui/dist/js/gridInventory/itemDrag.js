"use strict";
window.gridInventory = window.gridInventory || {};


let slotModifications = new Map();

//Class for dragging items
gridInventory.ItemDrag = class
{
	static undoSlotModifications()
	{
		slotModifications.forEach((oldState, slot) =>
		{
			slot.state = oldState;
		});
		
		slotModifications.clear();
	}
	
	//Calls a provided function once per item with itemDrag, in an item manager
	//shouldBreak callback(itemDrag)
	static forEachItemInItemManager(itemManager, callback)
	{
		itemManager.forEach((id, item) =>
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
	
	static isAnyItemBeingDragged(itemManager)
	{
		let isAnyItemBeingDragged = false;
		
		gridInventory.ItemDrag.forEachInItemManager(itemManager, (itemDrag) =>
		{
			isAnyItemBeingDragged = true;
			
			return true;
		});
		
		return isAnyItemBeingDragged
	}
	
	constructor(item, offset)
	{
		this.item = item;
		this.offset = offset;
		
		this.hasMoved = false;
	}
	
	getPosition()
	{
		return {
			top: cursorPosition.y + this.offset.top,
			left: cursorPosition.x + this.offset.left
		};
	}
	
	getCursorOffset()
	{
		let position = this.getPosition();
		
		return {
			top: cursorPosition.y - position.top,
			left: cursorPosition.x - position.left
		};
	}
	
	getSlot(position)
	{
		let elementFromPointOffset = gridInventory.InventorySlot.getPixelSize() * 0.5;
		let element = $(document.elementFromPoint(position.left + elementFromPointOffset, position.top + elementFromPointOffset));
		
		if(element.hasClass("slot"))
		{
			return element.data("slot");
		}
	}
	
	update()
	{
		if(!this.hasMoved)
		{
			this.startMove();
			
			this.hasMoved = true;
		}
		
		let position = this.getPosition();
		
		this.item.html.css({
			"top": position.top + "px",
			"left": position.left + "px"
		});
		
		let slot = this.getSlot(position);
		let isValidPosition = true;
		
		if(slot && slot.inventory.isItemWithinInventory(this.item, slot.position))
		{
			let itemSize = this.item.getSize();
			
			for(let y = 0; y < itemSize.height; y++)
			{
				for(let x = 0; x < itemSize.width; x++)
				{
					let isSolid = this.item.slots[y][x] == 1;
					
					if(isSolid)
					{
						let slot2 = slot.inventory.getSlot({
							x: slot.position.x + x,
							y: slot.position.y + y
						});
						
						if(!slotModifications.has(slot2))
						{
							slotModifications.set(slot2, slot2.state);
							
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
	
	startMove()
	{
		this.item.html.css("pointer-events", "none");
		
		if(this.item.inventory)
		{
			this.item.inventory.removeItem(this.item);
		}
	}
}
