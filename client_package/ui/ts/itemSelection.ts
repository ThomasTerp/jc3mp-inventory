"use strict";
import * as ItemManager from "./itemManager";
import * as WindowManager from "./windowManager";
import * as Util from "./util";
import {Item} from "./item";
import {InventorySlot} from "./inventorySlot";
import {InventoryWindow} from "./inventoryWindow";
import {Vector2} from "./vector2";


//TODO: Do this in a better way
export const selectingItems:  Map<Item, boolean> = new Map();
export const selectedItems: Map<Item, boolean> = new Map();
export let selectionHTML: JQuery;
export let selectionPosition: Vector2;


//Create selection when mouse is down
$("body").on("mousedown", (event) =>
{
	let shouldCreateItemSelection = true;
	let targetHTML = $(event.target);
	
	removeHTML();
	
	if(!Util.isCtrlPressed())
	{
		//Selections can't be started on an item if ctrl is pressed
		
		if(targetHTML.hasClass("slot"))
		{
			let slot: InventorySlot = targetHTML.data("slot");
			
			if(slot && slot.item)
			{
				shouldCreateItemSelection = false;
			}
		}
		else if(targetHTML.data("item"))
		{
			shouldCreateItemSelection = false;
		}
	}
	
	//Selections can't be started in ui draggables
	if(targetHTML.closest(".ui-draggable-handle").length > 0)
	{
		shouldCreateItemSelection = false;
	}
	
	
	let isAnyInventoryWindowOpen = false;
	
	WindowManager.forEach((uniqueName, window) =>
	{
		if(window.isVisible && window instanceof InventoryWindow)
		{
			isAnyInventoryWindowOpen = true;
			
			return true;
		}
	});
	
	if(!isAnyInventoryWindowOpen)
	{
		shouldCreateItemSelection = false;
	}
	
	
	if(shouldCreateItemSelection)
	{
		if(!Util.isCtrlPressed())
		{
			clearSelection();
		}
		
		createHTML(new Vector2(event.pageX, event.pageY));
	}
	
	update();
	
	
	event.preventDefault();
});

$("body").on("mousemove", (event) =>
{
	update();
});

$("body").on("mouseup", (event) =>
{
	applySelection();
	removeHTML();
});


export function createHTML(position: Vector2): JQuery
{
	selectionPosition = position;
	
	selectionHTML = $(`<div class="item-selection"></div>`)
	selectionHTML.css({
		"top": position.y,
		"left": position.x
	});
	
	$("body").append(selectionHTML);
	
	return selectionHTML;
}

export function removeHTML(): void
{
	if(selectionHTML)
	{
		selectionHTML.remove();
		selectionHTML = undefined;
	}
}

export function update(): void
{
	if(selectionHTML)
	{
		let cursorPosition = Util.getCursorPosition();
		
		//Update selection size
		selectionHTML.css({
			"top": Math.min(cursorPosition.y, selectionPosition.y),
			"left": Math.min(cursorPosition.x, selectionPosition.x),
			"height": Math.abs(cursorPosition.y - selectionPosition.y),
			"width": Math.abs(cursorPosition.x - selectionPosition.x)
		});
		
		ItemManager.forEach((id, item) =>
		{
			let isSelected = false;
			
			if(item.inventoryWindow)
			{
				let itemSize = item.getSize();
				
				//Check if any inventory slot from the item is inside the selection
				checkForSlotsInSelection:
				for(let y = 0; y < itemSize.height; y++)
				{
					for(let x = 0; x < itemSize.width; x++)
					{
						let isSolid = item.slots[y][x] == 1;
						
						if(isSolid)
						{
							let slot = item.inventoryWindow.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
							
							if(isHTMLInsideSelection(slot.html))
							{
								isSelected = true;
								
								break checkForSlotsInSelection;
							}
						}
					}
				}
			}
			else
			{
				//If the item is outside an inventory
				
				if(isHTMLInsideSelection(item.html))
				{
					isSelected = true;
				}
			}
			
			if(selectedItems.get(item))
			{
				isSelected = !isSelected;
			}
			
			setSelectedHTML(item, isSelected);
			selectingItems.set(item, isSelected);
		});
	}
}

export function applySelection(): void
{
	selectingItems.forEach((isSelected, item) =>
	{
		selectedItems.set(item, isSelected);
		
		item.isSelected = isSelected;
	});
}

export function isHTMLInsideSelection(html: JQuery): boolean
{
	let thisHTMLTop = selectionHTML.offset().top;
	let thisHTMLLeft = selectionHTML.offset().left;
	let htmlTop = html.offset().top;
	let htmlLeft = html.offset().left;

	return !(
		((thisHTMLTop + selectionHTML.height()) < (htmlTop)) ||
		(thisHTMLTop > (htmlTop + html.height())) ||
		((thisHTMLLeft + selectionHTML.width()) < htmlLeft) ||
		(thisHTMLLeft > (htmlLeft + html.width()))
    );
}

export function setSelectedHTML(item: Item, isSelected: boolean): void
{
	if(isSelected)
	{
		item.state = "selected";
	}
	else
	{
		if(item.inventoryWindow)
		{
			item.state = "inventory";
		}
		else
		{
			item.state = "invalid";
		}
	}
}

export function clearSelection(): void
{
	selectedItems.forEach((isSelected, item) =>
	{
		setSelectedHTML(item, false);
		
		item.isSelected = false;
	});
	selectedItems.clear();
	
	selectingItems.clear();
}
