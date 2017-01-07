"use strict";
import * as ItemTypeManager from "./itemTypeManager";
import * as WindowManager from "./windowManager";
import * as Util from "./util";
import * as Labels from "./labels";
import {InventoryWindow} from "./inventoryWindow";
import {InventorySlot} from "./inventorySlot";
import {ItemDrag} from "./itemDrag";
import {Vector2} from "./vector2";


//Makes sure all items gets put in the ItemTypeManagers
export function initialize()
{
	//Yes, this is meant to be empty, I had to do it because of how importing works I think
}

//Item base
abstract class Item
{
	id: number;
	rotation: number;
	isFlipped: boolean;
	isSelected: boolean;
	padding: number;
	html: JQuery
	slots: number[][];
	inventoryWindow: InventoryWindow;
	inventoryPosition: Vector2;
	itemDrag: ItemDrag;
	category: string;
	name: string;
	description: string;
	
	_src: string;
	set src(value)
	{
		this._src = value;
		
		this.html.attr("src", this.src);
	}
	get src()
	{
		return this._src;
	}
	
	_defaultSlots: number[][]
	set defaultSlots(value)
	{
		this._defaultSlots = value;
		this.slots = this.getDefaultSlotsClone();
		
		this.updateHTML();
	}
	get defaultSlots()
	{
		return this._defaultSlots;
	}
	
	_state: string;
	//The state will be added with a "state-" prefix as html class
	//States: "none", "inventory", "selected", "dragging", "invalid"
	set state(value)
	{
		//Remove old state
		this.html.removeClass("state-" + this._state);
		//Add new state
		this.html.addClass("state-" + value);
		
		this._state = value;
	}
	get state()
	{
		return this._state;
	}
	
	constructor(id: number)
	{
		this.createHTML();
		
		this.id = id;
		this.rotation = 0;
		this.isFlipped = false;
		this.isSelected = false;
		this.padding = 2;
		this.state = "none";
		
		this.category = "Misc";
		this.name = "Item " + this.id;
		this.description = "";
		this.src = "dist/images/item_base.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
	
	get tooltip()
	{
		return "<b>" + this.name + "</b><br />" + this.description;
	}
	
	getDefaultSlotsClone()
	{
		return Util.cloneObject(this.defaultSlots);
	}
	
	createHTML()
	{
		if(!this.html)
		{
			this.html = $(`<img class="item" />`);
			this.html.data("item", this);
		}
		
		return this.html;
	}
	
	updateHTML()
	{
		let pixelDefaultSize = this.getPixelDefaultSize();
		
		this.html.css({
			"width": pixelDefaultSize.width + "px",
			"height": pixelDefaultSize.height + "px",
			"padding": this.padding + "px",
		});
		
		this.html.css("transform", "rotate(" + -this.rotation + "deg) scaleX(" + (this.isFlipped ? "-1" : "1") + ")")
		
		
		//Adjust position for rotation and flipping
		
		let top = 0;
		let left = 0;
		
		if(this.rotation == 0)
		{
			top = 0;
			left = 0;
			
			if(this.isFlipped)
			{
				left += pixelDefaultSize.width;
			}
		}
		else if(this.rotation == 90)
		{
			top = pixelDefaultSize.width;
			left = 0;
			
			if(this.isFlipped)
			{
				top -= pixelDefaultSize.width;
			}
		}
		else if(this.rotation == 180)
		{
			top = pixelDefaultSize.height;
			left = pixelDefaultSize.width;
			
			if(this.isFlipped)
			{
				left -= pixelDefaultSize.width;
			}
		}
		else if(this.rotation == 270)
		{
			top = 0;
			left = pixelDefaultSize.height;
			
			if(this.isFlipped)
			{
				top += pixelDefaultSize.width;
			}
		}
		
		this.html.css({
			"margin-top": top + "px",
			"margin-left": left + "px"
		});
	}
	
	//Get size without rotations
	getDefaultSize()
	{
		return {
			width: this.defaultSlots[0].length,
			height: this.defaultSlots.length
		};
	}
	
	//Get size with rotations
	getSize()
	{
		return {
			width: this.slots[0].length,
			height: this.slots.length
		};
	}
	
	//Get pixel size without rotations
	getPixelDefaultSize()
	{
		let defaultSize = this.getDefaultSize();
		let slotSize = InventorySlot.getPixelSize() + 2;
		
		return {
			width: slotSize * defaultSize.width - 1,
			height:  slotSize * defaultSize.height - 1
		};
	}
	
	//Get pixel size with rotations
	getPixelSize()
	{
		let size = this.getSize();
		let slotSize = InventorySlot.getPixelSize();
		
		return {
			width: slotSize * size.width * 1,
			height:  slotSize * size.height * 1
		};
	}
	
	rotateClockwise()
	{
		//Items can only be rotated while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.rotation += 90;
			
			if(this.rotation >= 360)
			{
				this.rotation = 0;
			}
			
			
			//Adjust drag offset
			
			let cursorOffset = this.itemDrag.getCursorOffset();
			
			this.itemDrag.offset.y -= this.getPixelSize().width - cursorOffset.y - cursorOffset.x;
			this.itemDrag.offset.x -= cursorOffset.y - cursorOffset.x;
			
			
			this.updateSlots();
		}
	}
	
	rotateCounterClockwise()
	{
		//Items can only be rotated while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.rotation -= 90;
			
			if(this.rotation < 0)
			{
				this.rotation = 270;
			}
			
			
			//Adjust drag offset
			
			let cursorOffset = this.itemDrag.getCursorOffset();
			
			this.itemDrag.offset.y -= cursorOffset.x - cursorOffset.y;
			this.itemDrag.offset.x -= this.getPixelSize().height - cursorOffset.x - cursorOffset.y;
			
			
			this.updateSlots();
		}
	}
	
	flip()
	{
		//Items can only be flipped while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.isFlipped = !this.isFlipped;
			
			
			//Adjust drag offset
			
			if(this.rotation == 0 || this.rotation == 180)
			{
				this.itemDrag.offset.x -= (this.getPixelDefaultSize().width * 0.5 - this.itemDrag.getCursorOffset().x) * 2;
			}
			else
			{
				let oldOffsetTop = this.itemDrag.offset.y;
				
				this.rotateClockwise();
				this.rotateClockwise();
				
				this.itemDrag.offset.y = oldOffsetTop;
			}
			
			
			this.updateSlots();
		}
	}
	
	updateSlots()
	{
		//Slots can only be updated while being dragged
		if(this.itemDrag && this.itemDrag.hasMoved)
		{
			this.slots = this.getDefaultSlotsClone();
			
			if(this.isFlipped)
			{
				for(let y = 0; y < this.getDefaultSize().height; y++)
				{
					this.slots[y].reverse();
				}
			}
			
			this.slots = Util.rotateMatrix(this.slots, this.rotation);
			
			this.updateHTML();
		}
	}
}
export {Item}

//TODO: Put these other items in another file

abstract class FoodItem extends Item
{
	health: number;
	hunger: number;
	thirst: number;
	
	constructor(id: number)
	{
		super(id);
		
		this.health = 0;
		this.hunger = 0;
		this.thirst = 0;
		
		this.category = "Food";
		this.updateDescription();
	}
	
	updateDescription()
	{
		let description = ``;
		
		if(this.health !== 0)
		{
			description += `Restore ` + Labels.health() + ` by ` + Labels.percentage(this.health);
		}
		
		if(this.hunger !== 0)
		{
			description += (this.hunger > 0 ? `Decrease` : `Increase`) + ` ` + Labels.hunger() + ` by ` + Labels.percentage(this.hunger) + `<br />`;
		}
		
		if(this.thirst !== 0)
		{
			description += (this.thirst > 0 ? `Decrease` : `Increase`) + ` ` + Labels.thirst() + ` by ` + Labels.percentage(this.thirst) + `<br />`;
		}
		
		this.description = description;
	}
}
export {FoodItem}

class AppleItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.hunger = 30;
		this.thirst = 20;
		
		this.name = "Apple";
		this.updateDescription();
		this.src = "dist/images/apple.png";
		this.defaultSlots = [
			[1],
		];
	}
}
export {AppleItem}
ItemTypeManager.add(AppleItem, [
	() =>
	{
		return new AppleItem(-1);
	}
]);

class RavelloBeansItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.hunger = 40;
		
		this.name = "Ravello Beans";
		this.updateDescription();
		this.src = "dist/images/ravello_beans.png";
		this.defaultSlots = [
			[1],
			[1],
		];
	}
}
export {RavelloBeansItem}
ItemTypeManager.add(RavelloBeansItem, [
	() =>
	{
		return new RavelloBeansItem(-1);
	}
]);

class LaisChipsItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.padding = 4;
		
		this.hunger = 60;
		this.thirst = -20;
		
		this.name = "Lais Chips";
		this.updateDescription();
		this.src = "dist/images/lais_chips.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}
export {LaisChipsItem}
ItemTypeManager.add(LaisChipsItem, [
	() =>
	{
		return new LaisChipsItem(-1);
	}
]);

class SnikersItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.hunger = 20;
		
		this.name = "Snikers";
		this.updateDescription();
		this.src = "dist/images/snikers.png";
		this.defaultSlots = [
			[1, 1],
		];
	}
}
export {SnikersItem}
ItemTypeManager.add(SnikersItem, [
	() =>
	{
		return new SnikersItem(-1);
	}
]);

class WaterBottleItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.thirst = 65;
		
		this.name = "Water Bottle";
		this.updateDescription();
		this.src = "dist/images/water_bottle.png";
		this.defaultSlots = [
			[1],
			[1],
			[1],
		];
	}
}
export {WaterBottleItem}
ItemTypeManager.add(WaterBottleItem, [
	() =>
	{
		return new WaterBottleItem(-1);
	}
]);

class MilkGallonItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.padding = 6
		
		this.thirst = 85;
		
		this.name = "Milk Gallon";
		this.updateDescription();
		this.src = "dist/images/milk_gallon.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}
export {MilkGallonItem}
ItemTypeManager.add(MilkGallonItem, [
	() =>
	{
		return new MilkGallonItem(-1);
	}
]);

class U39PlechovkaItem extends Item
{
	constructor(id: number)
	{
		super(id);
		
		this.category = "Weapons";
		this.name = "U-39 Plechovka";
		this.src = "dist/images/u39_plechovka.png";
		this.defaultSlots = [
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 0],
		];
	}
}
export {U39PlechovkaItem}
ItemTypeManager.add(U39PlechovkaItem, [
	() =>
	{
		return new U39PlechovkaItem(-1);
	}
]);

class GasCanItem extends Item
{
	constructor(id: number)
	{
		super(id);
		
		this.name = "Gas Can";
		this.src = "dist/images/gas_can.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
			[1, 1],
			[1, 1],
		];
	}
}
export {GasCanItem}
ItemTypeManager.add(GasCanItem, [
	() =>
	{
		return new GasCanItem(-1);
	}
]);

class BackpackItem extends Item
{
	backpackInventoryWindow: InventoryWindow;
	
	constructor(id: number)
	{
		super(id);
		
		this.backpackInventoryWindow = new InventoryWindow("Backpack", new Vector2(4, 6));
		WindowManager.add("backpack" + this.id, this.backpackInventoryWindow);
		
		this.backpackInventoryWindow.hide();
		
		this.name = "Backpack";
		this.updateDescription();
		this.src = "dist/images/backpack.png";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		];
	}
	
	updateDescription()
	{
		this.description = `Size: ` + this.backpackInventoryWindow.size.x + `x` + this.backpackInventoryWindow.size.y;
	}
}
export {BackpackItem}
ItemTypeManager.add(BackpackItem, [
	() =>
	{
		return new BackpackItem(-1);
	}
]);

abstract class VehicleRepairItem extends Item
{
	repairAmount: number;
	
	constructor(id: number)
	{
		super(id);
		
		this.repairAmount = 100;
		
		this.category = "Vehicles";
		this.updateDescription();
	}
	
	updateDescription()
	{
		let description = "";
		
		if(this.repairAmount !== 0)
		{
			description = Labels.repair(`Repair`) + ` a vehicle by ` + Labels.percentage(this.repairAmount);
		}
		
		this.description = description;
	}
}
export {VehicleRepairItem}

class SmallWrenchItem extends VehicleRepairItem
{
	constructor(id: number)
	{
		super(id);
		
		this.repairAmount = 20;
		
		this.name = "Small Wrench";
		this.updateDescription();
		this.src = "dist/images/small_wrench.png";
		this.defaultSlots = [
			[1, 1]
		];
	}
}
export {SmallWrenchItem}
ItemTypeManager.add(SmallWrenchItem, [
	() =>
	{
		return new SmallWrenchItem(-1);
	}
]);

class BigWrenchItem extends VehicleRepairItem
{
	constructor(id: number)
	{
		super(id);
		
		this.repairAmount = 40;
		
		this.name = "Big Wrench";
		this.updateDescription();
		this.src = "dist/images/big_wrench.png";
		this.defaultSlots = [
			[1, 1, 1],
		];
	}
}
export {BigWrenchItem}
ItemTypeManager.add(BigWrenchItem, [
	() =>
	{
		return new BigWrenchItem(-1);
	}
]);

class ToolboxItem extends VehicleRepairItem
{
	constructor(id: number)
	{
		super(id);
		
		this.repairAmount = 100;
		
		this.name = "Toolbox";
		this.updateDescription();
		this.src = "dist/images/toolbox.png";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
		];
	}
}
export {ToolboxItem}
ItemTypeManager.add(ToolboxItem, [
	() =>
	{
		return new ToolboxItem(-1);
	}
]);

class MapItem extends Item
{
	constructor(id: number)
	{
		super(id);
		
		this.name = "Map";
		this.description = "It has a red marker";
		this.src = "dist/images/map.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
}
export {MapItem}
ItemTypeManager.add(MapItem, [
	() =>
	{
		return new MapItem(-1);
	}
]);

class GrapplingHookItem extends Item
{
	constructor(id: number)
	{
		super(id);
		
		this.name = "Grappling Hook";
		this.description = "";
		this.src = "dist/images/grappling_hook.png";
		this.defaultSlots = [
			[1, 1, 1, 1],
			[1, 1, 1, 1],
		];
	}
}
export {GrapplingHookItem}
ItemTypeManager.add(GrapplingHookItem, [
	() =>
	{
		return new GrapplingHookItem(-1);
	}
]);

class BavariumWingsuitItem extends Item
{
	constructor(id: number)
	{
		super(id);
		
		this.name = "Bavarium Wingsuit Booster";
		this.description = "Requires wingsuit";
		this.src = "dist/images/bavarium_wingsuit.png";
		this.defaultSlots = [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		];
	}
}
export {BavariumWingsuitItem}
ItemTypeManager.add(BavariumWingsuitItem, [
	() =>
	{
		return new BavariumWingsuitItem(-1);
	}
]);

class PillsItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.health = 20;
		
		this.name = "Pills";
		this.updateDescription();
		this.src = "dist/images/pills.png";
		this.defaultSlots = [
			[1],
		];
	}
}
export {PillsItem}
ItemTypeManager.add(PillsItem, [
	() =>
	{
		return new PillsItem(-1);
	}
]);

class BandageItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.health = 50;
		
		this.name = "Bandage";
		this.updateDescription();
		this.src = "dist/images/bandage.png";
		this.defaultSlots = [
			[1],
			[1],
		];
	}
}
export {BandageItem}
ItemTypeManager.add(BandageItem, [
	() =>
	{
		return new BandageItem(-1);
	}
]);


class FirstAidKitItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.health = 100;
		
		this.name = "First Aid Kit";
		this.updateDescription();
		this.src = "dist/images/first_aid_kit.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
}
export {FirstAidKitItem}
ItemTypeManager.add(FirstAidKitItem, [
	() =>
	{
		return new FirstAidKitItem(-1);
	}
]);
