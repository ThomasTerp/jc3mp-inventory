"use strict";
import {Window} from "./window";
import {ItemDrag} from "./../itemDrag";
import {Item} from "./../items/item";
import {Vector2} from "./../vector2";
import {Vector2Grid} from "./../vector2Grid";
import * as util from "./../../util";
import * as itemManager from "./../../managers/itemManager";


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
					ItemDrag.slotModifications.set(slot, slot.state);
				}
			}
		}
	}
	
	addItem(item: Item, position: Vector2Grid): void
	{
		if(!this.hasItem(item))
		{
			this.items.push(item);
			
			item.createHTML();
			
			item.inventoryWindow = this;
			item.inventoryPosition = position;
			item.state = "inventory";
			
			this.updateItemHTMLPosition(item);
			
			item.html.css("pointer-events", "none");
			
			this.html.find(".items").append(item.html);
			
			this.setSlotsItem(item);
			
			addNetworkChange(itemManager.getItemIndex(item), "move");
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
			
			this.items.splice(this.items.indexOf(item), 1);
		}
	}
	
	hasItem(item: Item): boolean
	{
		return this.items.indexOf(item) === -1 ? false : true;
	}
	
	isItemWithinInventory(item: Item, position: Vector2Grid): boolean
	{
		let itemSize = item.getSize();
		
		return position.cols + itemSize.cols <= this.size.cols && position.rows + itemSize.rows <= this.size.rows;
	}
	
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
					
					if(slot.item !== null)
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
		
		this.item = null;
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


let localInventoryWindow = null;

export function setLocalInventoryWindow(inventoryWindow: InventoryWindow): void
{
	localInventoryWindow = inventoryWindow;
}

export function getLocalInventoryWindow(): InventoryWindow
{
	return localInventoryWindow
}


const networkChangesMap: Map<number, string> = new Map();
const networkPreChangesMap: Map<number, Object> = new Map();

export function addNetworkChange(itemIndex: number, networkChange: string): void
{
	networkChangesMap.set(itemIndex, networkChange)
}

export function addNetworkPreChange(itemIndex: number, networkPreChange: Object): void
{
	networkPreChangesMap.set(itemIndex, networkPreChange)
}

export function clearNetworkChanges(): void
{
	networkChangesMap.clear();
	networkPreChangesMap.clear();
}

export function sendNetworkChanges()
{
	const networkChangesData = [];
	
	for(let [itemIndex, networkChange] of networkChangesMap.entries())
	{
		const item = itemManager.getByItemIndex(itemIndex);
		
		if(item !== undefined)
		{
			const networkPreChange = networkPreChangesMap.get(itemIndex);
			
			if(networkPreChange !== undefined)
			{
				switch(networkChange)
				{
					//When a item is moved in any way
					case "move":
						if(networkChange === "move")
						{
							//If a item does not have an ID, and if the player is an admin (server sided check), a new item will be created
							if(item.id === null)
							{
								const finalNetworkChange = {
									changeType: "create",
									type: item.constructor.name,
									rotation: item.rotation,
									isFlipped: item.isFlipped
								};
								
								if(item.inventoryWindow !== null && item.inventoryWindow.uniqueName !== null)
								{
									finalNetworkChange.inventoryUniqueName = item.inventoryWindow.uníqueName,
									finalNetworkChange.inventoryPosition = {
										cols: item.inventoryPosition.cols,
										rows: item.inventoryPosition.rows
									}
								}
								
								networkChangesData.push(finalNetworkChange);
							}
							else
							{
								//If the item has actually changed in any way
								if(
									item.rotation !== networkPreChange.rotation ||
									item.isFlipped !== networkPreChange.isFlipped ||
									item.inventoryWindow !== networkPreChange.inventoryWindow ||
									item.inventoryPosition !== networkPreChange.inventoryPosition
								)
								{
									const finalNetworkChange = {
										changeType: "move",
										id: item.id,
										rotation: item.rotation,
										isFlipped: item.isFlipped
									};
									
									if(item.inventoryWindow !== null && item.inventoryWindow.uniqueName !== null)
									{
										finalNetworkChange.inventoryUniqueName = item.inventoryWindow.uniqueName,
										finalNetworkChange.inventoryPosition = {
											cols: item.inventoryPosition.cols,
											rows: item.inventoryPosition.rows
										}
									}
									
									networkChangesData.push(finalNetworkChange);
								}
							}
						}
						
						break;
					
					//When a item is dropped (dragged outside inventories)
					case "drop":
						//If a item does not have an ID, and if the player is an admin (server sided check), an new item will be created and dropped
						if(item.id === null)
						{
							networkChangesData.push({
								changeType: "dropCreate",
								type: item.constructor.name,
							});
						}
						else
						{
							networkChangesData.push({
								changeType: "drop",
								id: item.id
							});
						}
						
						break;
				}
			}
		}
	}
	
	if(networkChangesData.length > 0)
	{
		if(typeof jcmp !== "undefined")
		{
			jcmp.CallEvent("jc3mp-inventory/network/sendChanges", JSON.stringify(networkChangesData));
		}
	}
	
	clearNetworkChanges();
}
