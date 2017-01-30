"use strict";
import {InventorySlot} from "./windows/inventoryWindow";
import {Item} from "./items/item";
import {Vector2} from "./vector2";
import {Vector2Grid} from "./vector2Grid";
import * as itemManager from "./../managers/itemManager";
import * as network from "./../network";
import * as util from "./../util";


/** Class for dragging items */
export class ItemDrag
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
	
	/**
	 * Calls a provided function once per item with itemDrag
	 * Return true to break
	 */
	static forEachInItemManager(callback: (itemDrag: ItemDrag) => any): void
	{
		itemManager.forEach((itemIndex, item) =>
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
	
	/** Returns true if any item is currently being dragged */
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
	onDropped: () => void;
	
	constructor(item: Item, offset: Vector2)
	{
		this.item = item;
		this.offset = offset;
		
		this.hasMoved = false;
	}
	
	getPosition(): Vector2
	{
		let cursorPosition = util.getCursorPosition();
		
		return new Vector2(cursorPosition.x + this.offset.x, cursorPosition.y + this.offset.y);
	}
	
	getCursorOffset(): Vector2
	{
		let position = this.getPosition();
		let cursorPosition = util.getCursorPosition();
		
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
			
			for(let rows = 0; rows < itemSize.rows; rows++)
			{
				for(let cols = 0; cols < itemSize.cols; cols++)
				{
					let isSolid = this.item.slots[rows][cols] == 1;
					
					if(isSolid)
					{
						let slot2 = slot.inventoryWindow.getSlot(new Vector2Grid(slot.position.cols + cols, slot.position.rows + rows));
						
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
		if(this.item.id != undefined)
		{
			network.addPreItemOperation(itemManager.getItemIndex(this.item), {
				rotation: this.item.rotation,
				isFlipped: this.item.isFlipped,
				inventoryWindow: this.item.inventoryWindow,
				inventoryPosition: this.item.inventoryPosition
			});
		}
		
		
		this.item.html.css("pointer-events", "none");
		
		if(this.item.inventoryWindow)
		{
			this.item.inventoryWindow.removeItem(this.item);
		}
	}
}

$(document.body).on("mousemove", (event) =>
{
	ItemDrag.undoSlotModifications();
	
	ItemDrag.forEachInItemManager((itemDrag) =>
	{
		if(util.isCtrlPressed() && !itemDrag.hasMoved)
		{
			delete itemDrag.item.itemDrag;
			
			return;
		}
		
		itemDrag.update();
	});
});

//Dropping of item drag
$(document.body).on("mouseup", (event) =>
{
	ItemDrag.forEachInItemManager((itemDrag) =>
	{
		if(itemDrag.hasMoved)
		{
			itemDrag.update();
			ItemDrag.undoSlotModifications();
			
			const slot = itemDrag.getSlot(itemDrag.getPosition());
			const itemIndex = itemManager.getItemIndex(itemDrag.item);
			let isDroppedOutside = false;
			
			if(slot)
			{
				if(!slot.inventoryWindow.isItemWithinInventory(itemDrag.item, slot.position) || !slot.inventoryWindow.canItemBePlaced(itemDrag.item, slot.position))
				{
					isDroppedOutside = true;
				}
			}
			else
			{
				isDroppedOutside = true;
			}
			
			
			if(isDroppedOutside)
			{
				itemDrag.item.html.css({
					"pointer-events": "auto",
				});
				
				network.addItemOperation(itemIndex, "drop");
			}
			else
			{
				slot.inventoryWindow.addItem(itemDrag.item, slot.position);
				
				network.addItemOperation(itemIndex, "move");
			}
			
			itemDrag.item.state = "selected";
		}
		
		if(itemDrag.onDropped != undefined)
		{
			itemDrag.onDropped();
		}
		
		delete itemDrag.item.itemDrag;
	});
});

//Dragging of items outside inventory
$(document.body).on("mousedown", ".item", (event) =>
{
	const item: Item = $(event.currentTarget).data("item");
	
	if(item != undefined && itemManager.exists(item) && !util.isCtrlPressed())
	{
        itemManager.startDragging(item, new Vector2(event.pageX, event.pageY));
		
		event.preventDefault();
	}
});

$(document.body).on("keydown", (event) =>
{
	ItemDrag.undoSlotModifications();
	
	ItemDrag.forEachInItemManager((itemDrag) =>
	{
		if(itemDrag.hasMoved)
		{
			switch(event.which) {
				//Left
				case 37:
					itemDrag.item.rotateClockwise();
					
					break;
				
				//Up
				case 38:
					itemDrag.item.flip();
					
					break;
				
				//Right
				case 39:
					itemDrag.item.rotateCounterClockwise();
					
					break;
					
				//Down
				case 40:
					itemDrag.item.flip();
					
					break;
				
				//Exit this function if any other keys triggered the event
				default:
					return;
			}
			
			itemDrag.update();
		}
	});
});

$(window).on("resize", (event) =>
{
	itemManager.forEach((id, item) =>
	{
		item.updateHTML();
	});
});
