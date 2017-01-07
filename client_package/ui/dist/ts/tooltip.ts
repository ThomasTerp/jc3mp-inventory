"use strict";
import {Item} from "./item";
import {InventorySlot} from "./inventorySlot";


$(document).tooltip({
	track: true,
	items: ".slot, .item",
	hide: false,
	show: false,
	content: function()
	{
		console.log("content")
		let html = $(this);
		let item: Item;
		
		if(html.hasClass("slot"))
		{
			let slot: InventorySlot = html.data("slot");
			
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

$(document).on("mousedown", (event) =>
{
	$(document).tooltip("disable");
});

$(document).on("mouseup", (event) =>
{
	$(document).tooltip("enable");
});
