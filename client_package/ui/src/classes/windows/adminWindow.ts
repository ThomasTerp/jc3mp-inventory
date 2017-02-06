"use strict";
import {Item} from "./../items/item";
import {Window} from "./window";
import {Vector2} from "./../vector2";
import {ItemFactory} from "./../itemFactory";
import * as network from "./../../network";
import * as itemManager from "./../../managers/itemManager";
import * as itemFactoryManager from "./../../managers/itemFactoryManager";


export class AdminWindow extends Window
{
	itemsHTML: JQuery;
	itemCloners: ItemCloner[];
	
	constructor(titleHTML: string)
	{
		super(titleHTML);
		
		this.itemCloners = [];
		
		this.createContentHTML();
	}
	
	destroy(): void
	{
		super.destroy();
	}
	
	protected createHTML(): JQuery
	{
		super.createHTML();
		
		this.html.addClass("admin-window");
		
		return this.html;
	}
	
	protected createContentHTML(): JQuery
	{
		this.contentHTML.html(`<div class="items"></div>`);
		this.itemsHTML = this.contentHTML.find(".items");
		
		itemFactoryManager.forEach((itemName, itemFactories) =>
		{
			for (var itemFactory of itemFactories.values())
			{
				let itemCloner = new ItemCloner(itemFactory)
				
				this.itemCloners.push(itemCloner);
				this.itemsHTML.append(itemCloner.html);
			}
		});
		
		return this.contentHTML;
    }
	
	public updateHTML()
	{
		super.updateHTML();
		
		let highestWidth = 64;
		
		this.itemCloners.forEach((itemCloner, itemClonerIndex) =>
		{
			let itemClonerWidth = itemCloner.html.width();
			
			if(itemClonerWidth > highestWidth)
			{
				highestWidth = itemClonerWidth;
			}
		});
		
		this.itemsHTML.css("width", highestWidth + "px")
	}
}

export class ItemCloner
{
	itemFactory: ItemFactory;
	item: Item;
	html: JQuery;
	
	constructor(itemFactory: ItemFactory)
	{
		this.itemFactory = itemFactory;
		this.item = itemFactory.assemble();
		this.item.html.css("position", "relative");
		
		this.createHTML();
		this.bindEvents();
	}
	
	destroy()
	{
		this.html.remove();
	}
	
	protected createHTML()
	{
		this.html = $(`<div class="item-cloner"></div>`)
		this.html.append(this.item.html);
		this.html.data("itemCloner", this);
		
		return this.html;
	}
	
	private bindEvents()
	{
		//On mousedown, create an item clone and start dragging it
		$(this.html).on("mousedown", {itemCloner: this}, (event) =>
		{
			let position = this.html.offset();
			
			let item = this.itemFactory.assemble();
			item.html.css({
				"left": position.left + "px",
				"top": position.top + "px"
			})
			
			itemManager.add(item);
			itemManager.startDragging(item, new Vector2(event.pageX, event.pageY));
			
			item.itemDrag.hasMoved = true;
			item.itemDrag.onDropped = () =>
			{
				if(item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined)
				{
					network.sendItemCreate(item);
					
					item.inventoryWindow.removeItem(item);
				}
				
				itemManager.remove(item);
				item.destroy();
			}
			
			event.preventDefault();
		});
	}
}
