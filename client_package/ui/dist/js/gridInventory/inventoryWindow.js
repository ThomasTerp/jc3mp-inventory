"use strict";
window.gridInventory = window.gridInventory || {};


gridInventory.InventoryWindow = class extends gridInventory.Window
{
	constructor(titleHTML, size)
	{
		super(titleHTML);
		
		this.size = size;
		this.items = [];
		this.slots = [];
		
		this._createContentHTML();
		this.updateHTML();
	}
	
	_createHTML()
	{
		super._createHTML();
		
		this.html.addClass("inventory-window");
	}
	
	_createContentHTML()
	{
		this.contentHTML.html(`
			<div class="slots"></div>
			<div class="items"></div>
		`);
		this.slotsHTML = this.contentHTML.find(".slots");
		this.itemsHTML = this.contentHTML.find(".items");
		
		for(let y = 0; y < this.size.height; y++)
		{
			let rowHTML = $('<div class="row"></div>');
			
			this.slots[y] = [];
			
			for(let x = 0; x < this.size.width; x++)
			{
				this.slots[y][x] = new gridInventory.InventorySlot(this, {
					x: x,
					y: y
				});
				
				rowHTML.append(this.slots[y][x].html);
			}
			
			this.slotsHTML.append(rowHTML);
		}
		
		//Item dragging
		this.slotsHTML.on("mousedown", ".slot", (event) =>
		{
			if(!isCtrlPressed)
			{
				let slot = $(event.currentTarget).data("slot");
				
				if(slot && slot.item)
				{
					slot.item.itemManager.startDragging(slot.item, {
						x: event.pageX,
						y: event.pageY
					});
					
					event.preventDefault();
				}
			}
		});
		
		return this.contentHTML;
	}
	
	updateHTML()
	{
		let slotSize = gridInventory.InventorySlot.getPixelSize();
		let inner = this.slotsHTML.find(".slot .inner");
		
		inner.css({
			"width": slotSize + "px",
			"height": slotSize + "px"
		});
		
		this.items.forEach((item, itemIndex) =>
		{
			this.updateItemHTMLPosition(item);
		});
	};
	
	updateItemHTMLPosition(item)
	{
		let slot = this.getSlot(item.position);
		let slotHTMLPosition = slot.html.position();
		
		item.html.css({
			"top": slotHTMLPosition.top + 1 + "px",
			"left": slotHTMLPosition.left + 1 + "px",
		});
	}
	
	getSlot(position)
	{
		return this.slots[position.y][position.x];
	}
	
	setSlotsItem(item)
	{
		for(let y = 0; y < item.slots.length; y++)
		{
			for(let x = 0; x < item.slots[y].length; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot({
						x: item.position.x + x,
						y: item.position.y + y
					});
					slot.state = "item";
					slot.item = item;
				}
			}
		}
	}
	
	unsetSlotsItem(item)
	{
		for(let y = 0; y < item.slots.length; y++)
		{
			for(let x = 0; x < item.slots[y].length; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot({
						x: item.position.x + x,
						y: item.position.y + y
					});
					slot.state = "empty";
					slot.item = undefined;
					
					//Required for a rare bug
					slotModifications.set(slot, slot.state);
				}
			}
		}
	}
	
	addItem(item, position)
	{
		this.items[item.id] = item;
		
		item.createHTML();
		
		item.inventory = this;
		item.position = position;
		item.state = "inventory";
		
		this.updateItemHTMLPosition(item);
		
		item.html.css("pointer-events", "none");
		
		this.html.find(".items").append(item.html);
		
		this.setSlotsItem(item);
	};
	
	removeItem(item)
	{
		this.unsetSlotsItem(item);
		
		item.inventory = undefined;
		item.position = undefined;
		item.state = "invalid";
		
		item.html.detach().appendTo("body > .items");
		
		delete this.items[item.id];
	};
	
	isItemWithinInventory(item, position)
	{
		let itemSize = item.getSize();
		
		return position.x + itemSize.width <= this.size.width && position.y + itemSize.height <= this.size.height;
	};
	
	canItemBePlaced(item, position)
	{
		let itemSize = item.getSize();
		
		for(let y = 0; y < itemSize.height; y++)
		{
			for(let x = 0; x < itemSize.width; x++)
			{
				let isSolid = item.slots[y][x] == 1;
				
				if(isSolid)
				{
					let slot = this.getSlot({
						x: position.x + x,
						y: position.y + y
					});
					
					if(slot.item)
					{
						return false;
					}
				}
			}
		}
		
		return true
	};
	
	onResize()
	{
		super.onResize();
		
		this.updateHTML();
	}
}
