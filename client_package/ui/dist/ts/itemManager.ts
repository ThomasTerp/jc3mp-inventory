"use strict";
import * as ItemSelection from "./itemSelection";
import * as Util from "./util";
import {Item} from "./item";
import {ItemDrag} from "./itemDrag";
import {Vector2} from "./vector2";


let itemsHTML = $("body > .items");
let itemsMap: Map<number, Item> = new Map();


$(document.body).on("mousemove", (event) =>
{
	ItemDrag.undoSlotModifications();
	
	ItemDrag.forEachInItemManager((itemDrag) =>
	{
		if(Util.isCtrlPressed() && !itemDrag.hasMoved)
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
			
			let slot = itemDrag.getSlot(itemDrag.getPosition());
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
			}
			else
			{
				slot.inventoryWindow.addItem(itemDrag.item, slot.position);
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
	
	if(item && get(item.id) && !Util.isCtrlPressed())
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


//Start dragging selected items, this should be called inside a mousedown event
export function startDragging(item: Item, position: Vector2): void
{
    if(!item.isSelected)
    {
        //Selection is canceled if item is not part of the selection, and the item becomes the only selected item
        
        ItemSelection.clearSelection();
        ItemSelection.setSelectedHTML(item, true);
        ItemSelection.selectedItems.set(item, true);
    }
    
    ItemSelection.selectedItems.forEach((isSelected, item) =>
    {
        if(isSelected)
        {
            let offset = item.html.offset();
			
            item.itemDrag = new ItemDrag(item, new Vector2(offset.left - position.x, offset.top - position.y));
        }
    });
}

export function add(id: number, item: Item): Item
{
	item.id = id;
	
    remove(id);
	
    itemsMap.set(id, item);
	
    item.html.appendTo(itemsHTML);
	
    return item;
}

export function remove(id: number): void
{
    let item = get(id);
	
    if(item)
	{
        item.html.detach();
		
        itemsMap.delete(id);
    }
}
	
//Get a window by its unique name
export function get(id: number): Item
{
    return itemsMap.get(id)
}

//Loop through all items, return true to break
export function forEach(callback: (id: number, item: Item) => any): void
{
    for(let [id, item] of itemsMap.entries())
	{
        if(callback(id, item))
		{
            break;
        }
    }
}
