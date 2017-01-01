"use strict";
window.gridInventory = window.gridInventory || {};


//Class for a selection box
gridInventory.itemSelection = {
	initialize()
	{
		this.selectingItems = new Map();
		this.selectedItems = new Map();
		
		this.bindEvents();
	},
	
	bindEvents()
	{
		//Create selection when mouse is down
		this.eventMouseDown = (event) =>
		{
			let shouldCreateItemSelection = true;
			let targetHTML = $(event.target);
			
			this.removeHTML();
			
			if(!isCtrlPressed)
			{
				//Selections can't be started on an item if ctrl is pressed
				
				if(targetHTML.hasClass("slot"))
				{
					let slot = targetHTML.data("slot");
					
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
			
			if(shouldCreateItemSelection)
			{
				if(!isCtrlPressed)
				{
					this.clearSelection();
				}
				
				this.createHTML({
					x: event.pageX,
					y: event.pageY
				});
			}
			
			this.update();
			
			
			event.preventDefault();
		};
		$("body").on("mousedown", this.eventMouseDown);
		
		this.eventMouseMove = (event) =>
		{
			this.update();
		};
		$("body").on("mousemove", this.eventMouseMove);
		
		this.eventMouseUp = (event) =>
		{
			this.applySelection();
			this.removeHTML();
		};
		$("body").on("mouseup", this.eventMouseUp);
	},
	
	unbindEvents()
	{
		$("body").off("mousedown", this.eventMouseDown);
		$("body").off("mousemove", this.eventMouseMove);
		$("body").off("mouseup", this.eventMouseUp);
	},
	
	createHTML(position)
	{
		this.position = position;
		
		this.html = $(`<div class="item-selection"></div>`)
		this.html.css({
			"top": position.y,
			"left": position.x
		});
		
		$("body").append(this.html);
		
		return this.html;
	},
	
	removeHTML()
	{
		if(this.html)
		{
			this.html.remove();
			this.html = undefined;
		}
	},
	
	update()
	{
		if(this.html)
		{
			//Update selection size
			this.html.css({
				"top": Math.min(cursorPosition.y, this.position.y),
				"left": Math.min(cursorPosition.x, this.position.x),
				"height": Math.abs(cursorPosition.y - this.position.y),
				"width": Math.abs(cursorPosition.x - this.position.x)
			});
			
			gridInventory.items.forEach((id, item) =>
			{
				let isSelected = false;
				
				if(item.inventory)
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
								let slot = item.inventory.getSlot({
									x: item.position.x + x,
									y: item.position.y + y
								});
								
								if(this.isHTMLInsideSelection(slot.html))
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
					
					if(this.isHTMLInsideSelection(item.html))
					{
						isSelected = true;
					}
				}
				
				if(this.selectedItems.get(item))
				{
					isSelected = !isSelected;
				}
				
				this.setSelectedHTML(item, isSelected);
				this.selectingItems.set(item, isSelected);
			});
		}
	},
	
	applySelection()
	{
		this.selectingItems.forEach((isSelected, item) =>
		{
			this.selectedItems.set(item, isSelected);
			
			item.isSelected = isSelected;
		});
	},
	
	isHTMLInsideSelection(html)
	{
		let thisHTMLTop = this.html.offset().top;
		let thisHTMLLeft = this.html.offset().left;
		let htmlTop = html.offset().top;
		let htmlLeft = html.offset().left;

		return !(
			((thisHTMLTop + this.html.height()) < (htmlTop)) ||
			(thisHTMLTop > (htmlTop + html.height())) ||
			((thisHTMLLeft + this.html.width()) < htmlLeft) ||
			(thisHTMLLeft > (htmlLeft + html.width()))
	    );
	},
	
	setSelectedHTML(item, isSelected)
	{
		if(isSelected)
		{
			item.state = "selected";
		}
		else
		{
			if(item.inventory)
			{
				item.state = "inventory";
			}
			else
			{
				item.state = "invalid";
			}
		}
	},
	
	clearSelection()
	{
		this.selectedItems.forEach((isSelected, item) =>
		{
			this.setSelectedHTML(item, false);
			
			item.isSelected = false;
		});
		this.selectedItems.clear();
		
		this.selectingItems.clear();
	},
}
gridInventory.itemSelection.initialize();
