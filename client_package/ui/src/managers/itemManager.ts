"use strict";
import {Item} from "./../classes/item";
import {ItemDrag} from "./../classes/itemDrag";
import {Vector2} from "./../classes/vector2";
import * as itemManager from "./../managers/itemManager";
import * as itemSelection from "./../itemSelection";
import * as util from "./../util";


const itemsHTML = $("body > .items");
const items: Array<Item> = [];
const itemsMap: Map<number, Item> = new Map();

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
	
	if(item.id != undefined)
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
		
		if(item.id != undefined)
		{
	        itemsMap.delete(item.id);
		}
		
		delete items[getItemIndex(item)];
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
	if(getByID(item.id) != undefined)
	{
		return true;
	}
	
	if(getItemIndex(item) !== -1)
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
		
		if(item != undefined && callback(itemIndex, item))
		{
            break;
        }
	};
}

$(document.body).on("contextmenu", (event) =>
{
	const item: Item = $(event.target).data("item");
	
	if(item != undefined)
	{
		item.openContextMenu(new Vector2(event.pageX, event.pageY));
		
		event.preventDefault();
	}
});
