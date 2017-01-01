"use strict";
window.gridInventory = window.gridInventory || {};


gridInventory.ItemCloner = class
{
	constructor(itemConstructor, position)
	{
		this.itemConstructor = itemConstructor;
		
		this.item = this.itemConstructor();
		this.item.html.css("position", "relative");
		
		this._createHTML();
		this._bindEvents();
	}
	
	destroy()
	{
		this._unbindEvents();
	}
	
	_createHTML()
	{
		this.html = $(`<div class="item-cloner"></div>`)
		this.html.append(this.item.html);
		this.html.data("itemCloner", this);
		
		return this.html;
	}
	
	_bindEvents()
	{
		//On mousedown, create an item clone and start dragging it
		this._eventMouseDown = (event) =>
		{
			let position = this.html.offset();
			
			let item = this.itemConstructor();
			item.html.css({
				"left": position.left + "px",
				"top": position.top + "px"
			})
			
			gridInventory.items.add(Math.floor(Math.random() * (100000 - 100 + 1)) + 100, item);
			gridInventory.items.startDragging(item, {
				x: event.pageX,
				y: event.pageY
			});
			item.itemDrag.hasMoved = true;
			
			event.preventDefault();
		};
		$(this.html).on("mousedown", {itemCloner: this}, this._eventMouseDown);
	}
	
	_unbindEvents()
	{
		$(this.html).off("mousedown", this._eventMouseDown);
	}
}

gridInventory.AdminWindow = class extends gridInventory.Window
{
	constructor(itemManager, itemTypeManager)
	{
		super("Administration");
		
		this.itemManager = itemManager;
		this.itemTypeManager = itemTypeManager;
		
		this._createContentHTML();
	}
	
	destroy()
	{
		
	}
	
	_createHTML()
	{
		super._createHTML();
		
		this.html.addClass("admin-window");
	}
	
	_createContentHTML()
	{
		this.contentHTML.html(`<div class="items"></div>`);
		this.itemsHTML = this.contentHTML.find(".items");
		
		this.itemTypeManager.forEach((itemType, constructors) =>
		{
			constructors.forEach((constructor, constructorIndex) =>
			{
				this.itemsHTML.append(new gridInventory.ItemCloner(constructor).html);
			});
		});
		
		return this.contentHTML;
    }
}
