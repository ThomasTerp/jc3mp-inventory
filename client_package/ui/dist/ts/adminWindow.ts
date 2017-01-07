"use strict";
import * as ItemManager from "./itemManager";
import * as ItemTypeManager from "./itemTypeManager";
import {Item} from "./item";
import {Window} from "./window";
import {Vector2} from "./vector2";


class ItemCloner
{
	itemConstructor: () => Item;
	item: Item;
	html: JQuery;
	
	constructor(itemConstructor: () => Item)
	{
		this.itemConstructor = itemConstructor;
		
		this.item = this.itemConstructor();
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
			
			let item = this.itemConstructor();
			item.html.css({
				"left": position.left + "px",
				"top": position.top + "px"
			})
			
			ItemManager.add(Math.floor(Math.random() * (100000 - 100 + 1)) + 100, item);
			ItemManager.startDragging(item, new Vector2(event.pageX, event.pageY));
			item.itemDrag.hasMoved = true;
			
			event.preventDefault();
		});
	}
}
export {ItemCloner};

class AdminWindow extends Window
{
	itemsHTML: JQuery;
	
	constructor(titleHTML: string)
	{
		super(titleHTML);
		
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
		
		ItemTypeManager.forEach((itemType, constructors) =>
		{
			constructors.forEach((constructor, constructorIndex) =>
			{
				this.itemsHTML.append(new ItemCloner(constructor).html);
			});
		});
		
		return this.contentHTML;
    }
}
export {AdminWindow};
