"use strict";
window.gridInventory = window.gridInventory || {};


//Item base
gridInventory.Item = class
{
	constructor(id)
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
	
	set src(value)
	{
		this._src = value;
		
		this.html.attr("src", this.src);
	}
	
	get src()
	{
		return this._src;
	}
	
	get tooltip()
	{
		return "<b>" + this.name + "</b><br />" + this.description;
	}
	
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
	
	getDefaultSlotsClone()
	{
		return gridInventory.cloneObject(this.defaultSlots);
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
		let slotSize = gridInventory.InventorySlot.getPixelSize() + 2;
		
		return {
			width: slotSize * defaultSize.width - 1,
			height:  slotSize * defaultSize.height - 1
		};
	}
	
	//Get pixel size with rotations
	getPixelSize()
	{
		let size = this.getSize();
		let slotSize = gridInventory.InventorySlot.getPixelSize();
		
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
			
			this.itemDrag.offset.top -= this.getPixelSize().width - cursorOffset.top - cursorOffset.left;
			this.itemDrag.offset.left -= cursorOffset.top - cursorOffset.left;
			
			
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
			
			this.itemDrag.offset.top -= cursorOffset.left - cursorOffset.top;
			this.itemDrag.offset.left -= this.getPixelSize().height - cursorOffset.left - cursorOffset.top;
			
			
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
				this.itemDrag.offset.left -= (this.getPixelDefaultSize().width * 0.5 - this.itemDrag.getCursorOffset().left) * 2;
			}
			else
			{
				let oldOffsetTop = this.itemDrag.offset.top;
				
				this.rotateClockwise();
				this.rotateClockwise();
				
				this.itemDrag.offset.top = oldOffsetTop;
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
			
			this.slots = gridInventory.rotateMatrix(this.slots, this.rotation);
			
			this.updateHTML();
		}
	}
}


//TODO: Put these other items in another file

gridInventory.FoodItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
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
			description += `Restore ` + gridInventory.labels.health() + ` by ` + gridInventory.labels.percentage(this.health);
		}
		
		if(this.hunger !== 0)
		{
			description += (this.hunger > 0 ? `Decrease` : `Increase`) + ` ` + gridInventory.labels.hunger() + ` by ` + gridInventory.labels.percentage(this.hunger) + `<br />`;
		}
		
		if(this.thirst !== 0)
		{
			description += (this.thirst > 0 ? `Decrease` : `Increase`) + ` ` + gridInventory.labels.thirst() + ` by ` + gridInventory.labels.percentage(this.thirst) + `<br />`;
		}
		
		this.description = description;
	}
}

gridInventory.AppleItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.AppleItem, [
	() =>
	{
		return new gridInventory.AppleItem();
	}
]);

gridInventory.RavelloBeansItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.RavelloBeansItem, [
	() =>
	{
		return new gridInventory.RavelloBeansItem();
	}
]);

gridInventory.LaisChipsItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.LaisChipsItem, [
	() =>
	{
		return new gridInventory.LaisChipsItem();
	}
]);

gridInventory.SnikersItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
		this.hunger = 20;
		
		this.name = "Snikers";
		this.updateDescription();
		this.src = "dist/images/snikers.png";
		this.defaultSlots = [
			[1, 1],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.SnikersItem, [
	() =>
	{
		return new gridInventory.SnikersItem();
	}
]);

gridInventory.WaterBottleItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.WaterBottleItem, [
	() =>
	{
		return new gridInventory.WaterBottleItem();
	}
]);

gridInventory.MilkGallonItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.MilkGallonItem, [
	() =>
	{
		return new gridInventory.MilkGallonItem();
	}
]);

gridInventory.U39PlechovkaItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
		this.category = "Weapons";
		this.name = "U-39 Plechovka";
		this.src = "dist/images/u39_plechovka.png";
		this.defaultSlots = [
			[1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 0],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.U39PlechovkaItem, [
	() =>
	{
		return new gridInventory.U39PlechovkaItem();
	}
]);

gridInventory.GasCanItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.GasCanItem, [
	() =>
	{
		return new gridInventory.GasCanItem();
	}
]);

gridInventory.BackpackItem = class extends gridInventory.Item
{
	constructor(windowManager)
	{
		super();
		
		this.backpackInventoryWindow = new gridInventory.InventoryWindow("Backpack", {
			width: 4,
			height: 6
		});
		windowManager.add("backpack" + this.id, this.backpackInventoryWindow);
		
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
		this.description = `Size: ` + this.backpackInventoryWindow.size.width + `x` + this.backpackInventoryWindow.size.height;
	}
}
gridInventory.itemTypes.add(gridInventory.BackpackItem, [
	() =>
	{
		return new gridInventory.BackpackItem(gridInventory.windows);
	}
]);

gridInventory.VehicleRepairItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
		this.repairAmount = 100;
		
		this.category = "Vehicles";
		this.updateDescription();
	}
	
	updateDescription()
	{
		let description = "";
		
		if(this.repairAmount !== 0)
		{
			description = gridInventory.labels.repair(`Repair`) + ` a vehicle by ` + gridInventory.labels.percentage(this.repairAmount);
		}
		
		this.description = description;
	}
}

gridInventory.SmallWrenchItem = class extends gridInventory.VehicleRepairItem
{
	constructor()
	{
		super();
		
		this.repairAmount = 20;
		
		this.name = "Small Wrench";
		this.updateDescription();
		this.src = "dist/images/small_wrench.png";
		this.defaultSlots = [
			[1, 1]
		];
	}
}
gridInventory.itemTypes.add(gridInventory.SmallWrenchItem, [
	() =>
	{
		return new gridInventory.SmallWrenchItem();
	}
]);

gridInventory.BigWrenchItem = class extends gridInventory.VehicleRepairItem
{
	constructor()
	{
		super();
		
		this.repairAmount = 40;
		
		this.name = "Big Wrench";
		this.updateDescription();
		this.src = "dist/images/big_wrench.png";
		this.defaultSlots = [
			[1, 1, 1],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.BigWrenchItem, [
	() =>
	{
		return new gridInventory.BigWrenchItem();
	}
]);

gridInventory.ToolboxItem = class extends gridInventory.VehicleRepairItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.ToolboxItem, [
	() =>
	{
		return new gridInventory.ToolboxItem();
	}
]);

gridInventory.MapItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
		this.name = "Map";
		this.description = "It has a red marker";
		this.src = "dist/images/map.png";
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.MapItem, [
	() =>
	{
		return new gridInventory.MapItem();
	}
]);

gridInventory.GrapplingHookItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
		this.name = "Grappling Hook";
		this.description = "";
		this.src = "dist/images/grappling_hook.png";
		this.defaultSlots = [
			[1, 1, 1, 1],
			[1, 1, 1, 1],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.GrapplingHookItem, [
	() =>
	{
		return new gridInventory.GrapplingHookItem();
	}
]);

gridInventory.BavariumWingsuitItem = class extends gridInventory.Item
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.BavariumWingsuitItem, [
	() =>
	{
		return new gridInventory.BavariumWingsuitItem();
	}
]);

gridInventory.PillsItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
		this.health = 20;
		
		this.name = "Pills";
		this.updateDescription();
		this.src = "dist/images/pills.png";
		this.defaultSlots = [
			[1],
		];
	}
}
gridInventory.itemTypes.add(gridInventory.PillsItem, [
	() =>
	{
		return new gridInventory.PillsItem();
	}
]);

gridInventory.BandageItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.BandageItem, [
	() =>
	{
		return new gridInventory.BandageItem();
	}
]);


gridInventory.FirstAidKitItem = class extends gridInventory.FoodItem
{
	constructor()
	{
		super();
		
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
gridInventory.itemTypes.add(gridInventory.FirstAidKitItem, [
	() =>
	{
		return new gridInventory.FirstAidKitItem();
	}
]);
