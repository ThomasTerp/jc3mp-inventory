"use strict";
import {Window} from "./window";
import {ItemDrag} from "./../itemDrag";
import {Item} from "./../items/item";
import {Vector2} from "./../vector2";
import {Vector2Grid} from "./../vector2Grid";
import * as util from "./../../util";
import * as itemManager from "./../../managers/itemManager";
import * as network from "./../../network";


/** Class for an inventory with items */
export class InventoryWindow extends Window
{
	size: Vector2Grid;
	items: Item[];
	slots: InventorySlot[][];
	
	private slotsHTML: JQuery;
	private itemsHTML: JQuery;
	
	constructor(titleHTML: string, size: Vector2Grid)
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
		
		for(let rows = 0; rows < this.size.rows; rows++)
		{
			let rowHTML = $('<div class="row"></div>');
			
			this.slots[rows] = [];
			
			for(let cols = 0; cols < this.size.cols; cols++)
			{
				this.slots[rows][cols] = new InventorySlot(this, new Vector2Grid(cols, rows));
				
				rowHTML.append(this.slots[rows][cols].html);
			}
			
			this.slotsHTML.append(rowHTML);
		}
		
		//Item dragging
		this.slotsHTML.on("mousedown", ".slot", (event) =>
		{
			if(!util.isCtrlPressed())
			{
				let slot: InventorySlot = $(event.currentTarget).data("slot");
				
				if(slot && slot.item)
				{
					itemManager.startDragging(slot.item, new Vector2(event.pageX, event.pageY));
					
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
					slot.state = "item";
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
					slot.state = "empty";
					slot.item = undefined;
					
					//Required for a rare bug
					//ItemDrag.slotModifications.set(slot, slot.state);
				}
			}
		}
	}
	
	addItem(item: Item, position: Vector2Grid): void
	{
		if(item.inventoryWindow != undefined)
		{
			item.inventoryWindow.removeItem(item);
		}
		
		this.items.push(item);
		
		item.createHTML();
		
		item.inventoryWindow = this;
		item.inventoryPosition = position;
		item.state = "inventory";
		
		this.updateItemHTMLPosition(item);
		
		item.html.css("pointer-events", "none");
		
		this.html.find(".items").append(item.html);
		
		this.setSlotsItem(item);
		
		network.addItemOperation(itemManager.getItemIndex(item), "move");
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
	
	onResize(): void
	{
		super.onResize();
		
		this.updateHTML();
	}
}

/** Class for a slot in an inventory */
export class InventorySlot
{
    static getPixelSize(): number
    {
        return $(window).width() * 0.02 + 1;
    }
	
	inventoryWindow: InventoryWindow;
	item: Item;
	position: Vector2Grid;
	html: JQuery;
	innerHTML: JQuery;
	
	private _state: string;
	/**
     * The state will be added with a "state-" prefix as html class
     * States: "empty", "item", "hover", "hover-item"
	 */
    set state(value: string)
    {
        //Remove old state
        this.html.removeClass("state-" + this._state);
		
        //Add new state
        this.html.addClass("state-" + value);
		
        this._state = value;
    }
    get state(): string
    {
        return this._state;
    }
	
    constructor(inventoryWindow: InventoryWindow, position: Vector2Grid)
    {
		this.createHTML();
		
        this.inventoryWindow = inventoryWindow;
        this.position = position;
        this.state = "empty";
    }
	
    private createHTML(): JQuery
    {
		if(!this.html)
		{
	        this.html = $('\
				<div class="slot">\
					<div class="inner">\
						\
					</div>\
				</div>\
			');
	        this.html.data("slot", this);
			
	        this.innerHTML = this.html.find(".inner");
	        this.state = "empty";
		}
		
        return this.html;
    }
}
