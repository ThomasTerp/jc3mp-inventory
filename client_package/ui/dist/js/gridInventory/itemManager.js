"use strict";
window.gridInventory = window.gridInventory || {};


//Object for holding items
gridInventory.items = {
    initialize()
    {
        this.itemsHTML = $("body > .items");
        this.map = new Map();
		
		this.bindEvents();
    },
	
	//Call this before deleting the object
	destroy()
	{
		this._offEvents();
		
		this.forEach((id, item) =>
		{
			item.html.detach();
		});
	},
	
	bindEvents()
	{
		this.eventMouseMove = (event) =>
		{
			gridInventory.ItemDrag.undoSlotModifications();
			
			gridInventory.ItemDrag.forEachItemInItemManager(this, (itemDrag) =>
			{
				if(isCtrlPressed && !itemDrag.hasMoved)
				{
					delete itemDrag.item.itemDrag;
					
					return;
				}
				
				itemDrag.update();
			});
		};
		$(document.body).on("mousemove", this.eventMouseMove);
		
		//Dropping of item drag
		this.eventMouseUp = (event) =>
		{
			gridInventory.ItemDrag.forEachItemInItemManager(this, (itemDrag) =>
			{
				if(itemDrag.hasMoved)
				{
					itemDrag.update();
					
					gridInventory.ItemDrag.undoSlotModifications();
					
					let slot = itemDrag.getSlot(itemDrag.getPosition());
					let isDroppedOutside = false;
					
					if(slot)
					{
						if(!slot.inventory.isItemWithinInventory(itemDrag.item, slot.position) || !slot.inventory.canItemBePlaced(itemDrag.item, slot.position))
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
						slot.inventory.addItem(itemDrag.item, slot.position);
					}
					
					itemDrag.item.state = "selected";
				}
				
				delete itemDrag.item.itemDrag;
			});
		};
		$(document.body).on("mouseup", this.eventMouseUp);
		
		//Dragging of items outside inventory
		this.eventMouseDown = (event) =>
		{
			let item = $(event.currentTarget).data("item");
			
			if(item && this.get(item.id) && !isCtrlPressed)
			{
                this.startDragging(item, {
                    x: event.pageX,
                    y: event.pageY
                });
				
				event.preventDefault();
			}
		};
		$(document.body).on("mousedown", ".item", this.eventMouseDown);
		
		this.eventKeyDown = (event) =>
		{
			gridInventory.ItemDrag.undoSlotModifications();
			
			gridInventory.ItemDrag.forEachItemInItemManager(this, (itemDrag) =>
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
		};
		$(document.body).on("keydown", this.eventKeyDown);
		
		this.eventResize = (event) =>
		{
			this.forEach((id, item) =>
			{
				item.updateHTML();
			});
		};
		$(window).on("resize", (this.eventResize));
	},
	
	unbindEvents()
	{
		$(document.body).off("mousemove", this.eventMouseMove);
		$(document.body).off("mouseup", this.eventMouseUp);
		$(document.body).off("mousedown", ".item", this.eventMouseDown);
		$(document.body).off("keydown", this.eventKeyDown);
	},
	
    //Start dragging selected items, this should be called inside a mousedown event
    startDragging(item, position)
    {
        if(!item.isSelected)
        {
            //Selection is canceled if item is not part of the selection, and the item becomes the only selected item
            
            gridInventory.itemSelection.clearSelection();
            gridInventory.itemSelection.setSelectedHTML(item, true);
            gridInventory.itemSelection.selectedItems.set(item, true);
        }
        
        gridInventory.itemSelection.selectedItems.forEach((isSelected, item) =>
        {
            if(isSelected)
            {
                let offset = item.html.offset();
                offset.top -= position.y;
                offset.left -= position.x;
                
                item.itemDrag = new gridInventory.ItemDrag(item, offset);
            }
        });
    },
    
    //Add a window and give it an ID
    add(id, item)
    {
		item.id = id;
		item.itemManager = this;
		
        this.delete(id);
		
        this.map.set(id, item);
		
        item.html.appendTo(this.itemsHTML);
		
        return item;
    },
	
    //Delete a window from the manager and detach its HTML
    delete(id)
    {
        let item = this.get(id);
		
        if(item)
		{
            item.html.detach();
			
            this.map.delete(id);
        }
    },
	
    //Get a window by its unique name
    get(id)
    {
        return this.map.get(id)
    },
	
    //Loop through all windows
    //shouldBreak callback(id, item)
    forEach(callback)
    {
        for(let [id, item] of this.map.entries())
		{
            if(callback(id, item))
			{
                break;
            }
        }
    },
}
gridInventory.items.initialize();
