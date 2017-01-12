"use strict";
import {InventoryWindow} from "./inventoryWindow";
import {Item} from "./item";
import {Vector2} from "./vector2";


//Class for a slot in an inventory
class InventorySlot
{
    static getPixelSize(): number
    {
        return $(window).width() * 0.02 + 1;
    }
	
	inventoryWindow: InventoryWindow;
	item: Item;
	position: Vector2;
	html: JQuery;
	innerHTML: JQuery;
	
	private _state: string;
	//Set state of the slot
    //The state will be added with a "state-" prefix as html class
    //States: "empty", "item", "hover", "hover-item"
    set state(value: string)
    {
        //Remove old state
        this.html.removeClass("state-" + this._state);
		
        //Add new state
        this.html.addClass("state-" + value);
		
        this._state = value;
    }
    //Get state of the slot
    get state(): string
    {
        return this._state;
    }
	
    constructor(inventoryWindow: InventoryWindow, position: Vector2)
    {
		this.createHTML();
		
        this.inventoryWindow = inventoryWindow;
        this.position = position;
        this.state = "empty";
    }
	
    private createHTML(): JQuery
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
}
export {InventorySlot};
