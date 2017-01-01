"use strict";
window.gridInventory = window.gridInventory || {};


//Class for a slot in an inventory
gridInventory.InventorySlot = class
{
    static getPixelSize()
    {
        return $(window).width() * 0.02 + 1;
    }
	
    constructor(inventory, position)
    {
		this.createHTML();
		
        this.inventory = inventory;
        this.position = position;
        this.state = "empty";
    }
	
    createHTML()
    {
		if(!this.html)
		{
	        this.html = $('\
				<div class="slot">\
					<div class="inner">\
						\
					</div>\
				</div>\
			');
	        this.html.data("slot", this);
			
	        this.innerHTML = this.html.find(".inner");
	        this.state = "empty";
		}
		
        return this.html;
    }
	
    //Set state of the slot
    //The state will be added with a "state-" prefix as html class
    //States: "empty", "item", "hover", "hover-item"
    set state(value)
    {
        //Remove old state
        this.html.removeClass("state-" + this._state);
		
        //Add new state
        this.html.addClass("state-" + value);
		
        this._state = value;
    }
	
    //Get state of the slot
    get state()
    {
        return this._state;
    }
}
