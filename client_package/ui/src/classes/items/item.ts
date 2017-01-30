"use strict";
import {InventoryWindow, InventorySlot} from "./../windows/inventoryWindow";
import {ItemDrag} from "./../itemDrag";
import {Vector2} from "./../vector2";
import {Vector2Grid} from "./../vector2Grid";
import {ContextMenu, ContextMenuOption} from "./../contextMenu";
import * as itemFactoryManager from "./../../managers/itemFactoryManager";
import * as windowManager from "./../../managers/windowManager";
import * as network from "./../../network";
import * as labels from "./../../labels";
import * as util from "./../../util";


//Item base
export abstract class Item
{
	id: number;
	rotation: number;
	isFlipped: boolean;
	isSelected: boolean;
	padding: number;
	html: JQuery
	slots: number[][];
	inventoryWindow: InventoryWindow;
	inventoryPosition: Vector2Grid;
	itemDrag: ItemDrag;
	category: string;
	useText: string;
	destroyOnUse: boolean;
	name: string;
	description: string;
	
	_src: string;
	set src(value)
	{
		this._src = value;
		
		this.html.attr("src", this.src);
	}
	get src()
	{
		return this._src;
	}
	
	_defaultSlots: number[][]
	set defaultSlots(value)
	{
		this._defaultSlots = value;
		this.slots = this.getDefaultSlotsClone();
		
		this.updateHTML();
	}
	get defaultSlots()
	{
		return this._defaultSlots;
	}
	
	_state: string;
	//The state will be added with a "state-" prefix as html class
	//States: "none", "inventory", "selected", "dragging", "invalid"
	set state(value)
	{
		//Remove old state
		this.html.removeClass("state-" + this._state);
		//Add new state
		this.html.addClass("state-" + value);
		
		this._state = value;
	}
	get state()
	{
		return this._state;
	}
	
	constructor()
	{
		this.createHTML();
		
		this.rotation = 0;
		this.isFlipped = false;
		this.isSelected = false;
		this.padding = 2;
		this.state = "none";
		
		this.category = "Misc";
		this.useText = "Use";
		this.destroyOnUse = true;
		this.name = "Item " + this.id;
		this.description = "";
		this.src = "images/item_base.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
	
	destroy()
	{
		if(this.html != undefined)
		{
			this.html.remove();
		}
	}
	
	get tooltip(): string
	{
		return "<b>" + this.name + "</b><br />" + this.description;
	}
	
	/** The callRemoteUse method will only be called if this returns true */
	canUse(): boolean
	{
		return true
	}
	
	/**
	 * Tells the server that the local player wants to use this item.
	 * If the serverside canUse method returns true, the serverside use method will be called, which also calls the clientside use method
	 */
	callRemoteUse(): void
	{
		network.sendItemUse(this);
	}
	
	/** Called after the serverside canUse and use methods has been called */
	use(): void
	{
		if(this.destroyOnUse)
		{
			//TODO: Handle destroy
		}
	}
	
	/** Tells the server that the local player wants to destroy this item */
	callRemoteDestroy()
	{
		network.sendItemDestroy(this);
	}
	
	/** Create and open a context menu for this item at the specified position */
	openContextMenu(position: Vector2): ContextMenu
	{
		const contextMenu = new ContextMenu(position, [
			new ContextMenuOption(this.useText, () => {
				if(this.canUse())
				{
					this.callRemoteUse();
				}
			}),
			new ContextMenuOption("Destroy", () => {
				this.callRemoteDestroy();
			})
		]);
		
		ContextMenu.open(contextMenu);
		
		return contextMenu;
	}
	
	getDefaultSlotsClone(): number[][]
	{
		return util.cloneObject(this.defaultSlots);
	}
	
	createHTML(): JQuery
	{
		if(this.html == undefined)
		{
			this.html = $(`<img class="item" />`);
			this.html.data("item", this);
		}
		
		return this.html;
	}
	
	updateHTML(): void
	{
		let pixelDefaultSize = this.getPixelDefaultSize();
		
		this.html.css({
			"width": pixelDefaultSize.x + "px",
			"height": pixelDefaultSize.y + "px",
			"padding": this.padding + "px",
		});
		
		this.html.css("transform", "rotate(" + -this.rotation + "deg) scaleX(" + (this.isFlipped ? "-1" : "1") + ")")
		
		
		//Adjust position for rotation and flipping
		
		let top = 0;
		let left = 0;
		
		if(this.rotation == 0)
		{
			top = 0;
			left = 0;
			
			if(this.isFlipped)
			{
				left += pixelDefaultSize.x;
			}
		}
		else if(this.rotation == 90)
		{
			top = pixelDefaultSize.x;
			left = 0;
			
			if(this.isFlipped)
			{
				top -= pixelDefaultSize.x;
			}
		}
		else if(this.rotation == 180)
		{
			top = pixelDefaultSize.y;
			left = pixelDefaultSize.x;
			
			if(this.isFlipped)
			{
				left -= pixelDefaultSize.x;
			}
		}
		else if(this.rotation == 270)
		{
			top = 0;
			left = pixelDefaultSize.y;
			
			if(this.isFlipped)
			{
				top += pixelDefaultSize.x;
			}
		}
		
		this.html.css({
			"margin-top": top + "px",
			"margin-left": left + "px"
		});
	}
	
	//Get size without rotations
	getDefaultSize(): Vector2Grid
	{
		return new Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
	}
	
	//Get size with rotations
	getSize(): Vector2Grid
	{
		return new Vector2Grid(this.slots[0].length, this.slots.length);
	}
	
	//Get pixel size without rotations
	getPixelDefaultSize(): Vector2
	{
		let defaultSize = this.getDefaultSize();
		let slotSize = InventorySlot.getPixelSize() + 2;
		
		return new Vector2(slotSize * defaultSize.cols - 1, slotSize * defaultSize.rows - 1);
	}
	
	//Get pixel size with rotations
	getPixelSize(): Vector2
	{
		let size = this.getSize();
		let slotSize = InventorySlot.getPixelSize();
		
		return new Vector2(slotSize * size.cols * 1, slotSize * size.rows * 1);
	}
	
	rotateClockwise(): void
	{
		//Items can only be rotated while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.rotation += 90;
			
			if(this.rotation >= 360)
			{
				this.rotation = 0;
			}
			
			
			//Adjust drag offset
			
			let cursorOffset = this.itemDrag.getCursorOffset();
			
			this.itemDrag.offset.y -= this.getPixelSize().x - cursorOffset.y - cursorOffset.x;
			this.itemDrag.offset.x -= cursorOffset.y - cursorOffset.x;
			
			
			this.updateSlots();
		}
	}
	
	rotateCounterClockwise(): void
	{
		//Items can only be rotated while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.rotation -= 90;
			
			if(this.rotation < 0)
			{
				this.rotation = 270;
			}
			
			
			//Adjust drag offset
			
			let cursorOffset = this.itemDrag.getCursorOffset();
			
			this.itemDrag.offset.y -= cursorOffset.x - cursorOffset.y;
			this.itemDrag.offset.x -= this.getPixelSize().y - cursorOffset.x - cursorOffset.y;
			
			
			this.updateSlots();
		}
	}
	
	flip(): void
	{
		//Items can only be flipped while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.isFlipped = !this.isFlipped;
			
			
			//Adjust drag offset
			
			if(this.rotation == 0 || this.rotation == 180)
			{
				this.itemDrag.offset.x -= (this.getPixelDefaultSize().x * 0.5 - this.itemDrag.getCursorOffset().x) * 2;
			}
			else
			{
				let oldOffsetTop = this.itemDrag.offset.y;
				
				this.rotateClockwise();
				this.rotateClockwise();
				
				this.itemDrag.offset.y = oldOffsetTop;
			}
			
			
			this.updateSlots();
		}
	}
	
	updateSlots(): void
	{
		this.slots = this.getDefaultSlotsClone();
		
		if(this.isFlipped)
		{
			for(let rows = 0; rows < this.getDefaultSize().rows; rows++)
			{
				this.slots[rows].reverse();
			}
		}
		
		this.slots = util.rotateMatrix(this.slots, this.rotation);
		
		this.updateHTML();
	}
}
