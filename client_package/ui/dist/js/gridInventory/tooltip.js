"use strict";
window.gridInventory = window.gridInventory || {};


gridInventory.tooltips = {
	initialize()
	{
		this.bindEvents();
	},
	
	bindEvents()
	{
		$(document).tooltip({
			track: true,
			items: ".slot, .item",
			hide: false,
			show: false,
			content: function()
			{
				let html = $(this);
				let item;
				
				if(html.hasClass("slot"))
				{
					let slot = html.data("slot");
					
					if(slot && slot.item)
					{
						item = slot.item;
					}
				}
				else if(html.hasClass("item"))
				{
					item = html.data("item");
				}
				
				if(item)
				{
					return item.tooltip;
				}
			}
		});
		
		this.eventMouseDown = (event) =>
		{
			$(document).tooltip("disable");
		};
		$(document).on("mousedown", this.eventMouseDown);
		
		this.eventMouseUp = (event) =>
		{
			$(document).tooltip("enable");
		};
		$(document).on("mouseup", this.eventMouseUp);

	},
	
	unbindEvents()
	{
		$(document).off("mousedown", this.eventMouseDown);
		$(document).off("mouseup", this.eventMouseUp);
	},
}
gridInventory.tooltips.initialize();
