"use strict";
import {Item} from "./../classes/items";
import {ItemDrag} from "./../classes/itemDrag";
import {Vector2} from "./../classes/vector2";
import {addNetworkChange} from "./../classes/windows/inventoryWindow";
import * as itemSelection from "./../itemSelection";
import * as util from "./../util";


const itemsHTML = $("body > .items");
const items: Array<Item> = [];
const itemsMap: Map<number, Item> = new Map();


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
			const itemIndex = getItemIndex(itemDrag.item);
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
				
				addNetworkChange(itemIndex, "drop");
			}
			else
			{
				slot.inventoryWindow.addItem(itemDrag.item, slot.position);
				
				addNetworkChange(itemIndex, "move");
			}
			
			itemDrag.item.state = "selected";
		}
		
		delete itemDrag.item.itemDrag;
	});
});

//Dragging of items outside inventory
$(document.body).on("mousedown", ".item", (event) =>
{
	let item: Item = $(event.currentTarget).data("item");
	
	if(item && exists(item) && !util.isCtrlPressed())
	{
        startDragging(item, new Vector2(event.pageX, event.pageY));
		
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
	forEach((id, item) =>
	{
		item.updateHTML();
	});
});


/** Start dragging selected items, this should be called inside a mousedown event */
export function startDragging(item: Item, position: Vector2): void
{
    if(!item.isSelected)
    {
        //Selection is canceled if item is not part of the selection, and the item becomes the only selected item
        
        itemSelection.clearSelection();
        itemSelection.setSelectedHTML(item, true);
        itemSelection.selectedItems.set(item, true);
    }
    
    itemSelection.selectedItems.forEach((isSelected, item) =>
    {
        if(isSelected)
        {
            let offset = item.html.offset();
			
            item.itemDrag = new ItemDrag(item, new Vector2(offset.left - position.x, offset.top - position.y));
        }
    });
}

export function add(item: Item): Item
{
    remove(item);
	
	if(item.id !== null)
	{
	    itemsMap.set(item.id, item);
	}
	
    items.push(item);
	
    item.html.appendTo(itemsHTML);
	
    return item;
}

export function remove(item: Item): void
{
    if(exists(item))
	{
        item.html.detach();
		
		if(item.id !== null)
		{
	        itemsMap.delete(item.id);
		}
		
		items.splice(items.indexOf(item), 1);
    }
}

/** Get a item by its id */
export function getByID(id: number): Item
{
    return itemsMap.get(id)
}

export function getByItemIndex(itemIndex: number)
{
	return items[itemIndex];
}

export function getItemIndex(item: Item)
{
	return items.indexOf(item);
}

export function exists(item: Item): boolean
{
	if(getByID(item.id) !== undefined)
	{
		return true;
	}
	
	if(items.indexOf(item) !== -1)
	{
		return true;
	}
	
	return false;
}

/** Loop through all items, return true to break */
export function forEach(callback: (itemIndex: number, item: Item) => any): void
{
	for(var itemIndex = 0; itemIndex < items.length; itemIndex++)
	{
		const item = items[itemIndex];
		
		if(callback(itemIndex, item))
		{
            break;
        }
	};
}
