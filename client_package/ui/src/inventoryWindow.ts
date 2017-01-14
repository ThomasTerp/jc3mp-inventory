"use strict";
import * as Util from "./util";
import * as ItemManager from "./itemManager";
import {Window} from "./window";
import {InventorySlot} from "./inventorySlot";
import {ItemDrag} from "./itemDrag";
import {Item} from "./item";
import {Vector2} from "./vector2";


class InventoryWindow extends Window
{
	size: Vector2;
	items: Item[];
	slots: InventorySlot[][];
	
	private slotsHTML: JQuery;
	private itemsHTML: JQuery;
	
	constructor(titleHTML: string, size: Vector2)
	{
		super(titleHTML);
		
		this.size = size;
		this.items = [];
		this.slots = [];
		
		this.createContentHTML();
	}
	
	protected createHTML(): JQuery
	{
		super.createHTML();
		
		this.html.addClass("inventory-window");
		
		return this.html;
	}
	
	private createContentHTML(): JQuery
	{
		this.contentHTML.html(`
			<div class="slots"></div>
			<div class="items"></div>
		`);
		this.slotsHTML = this.contentHTML.find(".slots");
		this.itemsHTML = this.contentHTML.find(".items");
		
		for(let y = 0; y < this.size.y; y++)
		{
			let rowHTML = $('<div class="row"></div>');
			
			this.slots[y] = [];
			
			for(let x = 0; x < this.size.x; x++)
			{
				this.slots[y][x] = new InventorySlot(this, new Vector2(x, y));
				
				rowHTML.append(this.slots[y][x].html);
			}
			
			this.slotsHTML.append(rowHTML);
		}
		
		//Item dragging
		this.slotsHTML.on("mousedown", ".slot", (event) =>
		{
			if(!Util.isCtrlPressed())
			{
				let slot: InventorySlot = $(event.currentTarget).data("slot");
				
				if(slot && slot.item)
				{
					ItemManager.startDragging(slot.item, new Vector2(event.pageX, event.pageY));
					
					event.preventDefault();
				}
			}
		});
		
		return this.contentHTML;
	}
	
	updateHTML(): void
	{
		super.updateHTML();
		
		let slotSize = InventorySlot.getPixelSize();
		let inner = this.slotsHTML.find(".slot .inner");
		
		inner.css({
			"width": slotSize + "px",
			"height": slotSize + "px"
		});
		
		this.items.forEach((item, itemIndex) =>
		{
			this.updateItemHTMLPosition(item);
		});
	}
	
	updateItemHTMLPosition(item: Item): void
	{
		let slot = this.getSlot(item.inventoryPosition);
		let slotHTMLPosition = slot.html.position();
		
		item.html.css({
			"top": slotHTMLPosition.top + 1 + "px",
			"left": slotHTMLPosition.left + 1 + "px",
		});
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
					slot.state = "item";
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
					slot.state = "empty";
					slot.item = undefined;
					
					//Required for a rare bug
					ItemDrag.slotModifications.set(slot, slot.state);
				}
			}
		}
	}
	
	addItem(item: Item, position: Vector2): void
	{
		if(!this.hasItem(item))
		{
			this.items[item.id] = item;
			
			item.createHTML();
			
			item.inventoryWindow = this;
			item.inventoryPosition = position;
			item.state = "inventory";
			
			this.updateItemHTMLPosition(item);
			
			item.html.css("pointer-events", "none");
			
			this.html.find(".items").append(item.html);
			
			this.setSlotsItem(item);
		}
	}
	
	removeItem(item: Item): void
	{
		if(this.hasItem(item))
		{
			this.unsetSlotsItem(item);
			
			item.inventoryWindow = undefined;
			item.inventoryPosition = undefined;
			item.state = "invalid";
			
			item.html.detach().appendTo("body > .items");
			
			delete this.items[item.id];
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
	
	onResize(): void
	{
		super.onResize();
		
		this.updateHTML();
	}
}
export {InventoryWindow};


let localInventoryWindow = null;

export function setLocalInventoryWindow(inventoryWindow: InventoryWindow): void
{
	localInventoryWindow = inventoryWindow;
}

export function getLocalInventoryWindow(): InventoryWindow
{
	return localInventoryWindow
}
