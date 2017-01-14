"use strict";
import * as ItemTypeManager from "./../../managers/itemTypeManager";
import * as Util from "./../../util";
import {InventorySlot} from "./../inventorySlot";
import {Inventory} from "./../inventory";


//Item base
abstract class Item
{
	id: number;
	rotation: number;
	isFlipped: boolean;
	slots: number[][];
	inventory: Inventory;
	inventoryPosition: Vector2;
	category: string;
	name: string;
	
	private _defaultSlots: number[][]
	set defaultSlots(value)
	{
		this._defaultSlots = value;
		this.slots = this.getDefaultSlotsClone();
	}
	get defaultSlots()
	{
		return this._defaultSlots;
	}
	
	constructor()
	{
		this.id = null;
		this.inventory = null;
		this.inventoryPosition = null;
		this.rotation = 0;
		this.isFlipped = false;
		
		this.category = "Misc";
		this.name = "Item " + (this.id === null ? "(NULL ID)" : this.id);
		this.defaultSlots = [
			[1, 1],
			[1, 1],
		];
	}
	
	getDefaultSlotsClone(): number[][]
	{
		return Util.cloneObject(this.defaultSlots);
	}
	
	//Get size without rotations and flipping
	getDefaultSize(): Vector2
	{
		return new Vector2(this.defaultSlots[0].length, this.defaultSlots.length);
	}
	
	//Get size with rotations and flipping
	getSize(): Vector2
	{
		return new Vector2(this.slots[0].length, this.slots.length);
	}
	
	updateSlots(): void
	{
		this.slots = this.getDefaultSlotsClone();
		
		if(this.isFlipped)
		{
			for(let y = 0; y < this.getDefaultSize().y; y++)
			{
				this.slots[y].reverse();
			}
		}
		
		this.slots = Util.rotateMatrix(this.slots, this.rotation);
	}
}
export {Item}


/*
//TODO: Put these other items in another file



class RavelloBeansItem extends FoodItem
{
	constructor(id: number)
	{
		super(id);
		
		this.hunger = 40;
		
		this.name = "Ravello Beans";
		this.updateDescription();
		this.src = "images/ravello_beans.png";
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
		this.src = "images/lais_chips.png";
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
		this.src = "images/snikers.png";
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
		this.src = "images/water_bottle.png";
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
		this.src = "images/milk_gallon.png";
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
		this.src = "images/u39_plechovka.png";
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
*/

/*
class BackpackItem extends Item
{
	backpackInventoryWindow: InventoryWindow;
	
	constructor(id: number)
	{
		super(id);
		
		this.backpackInventoryWindow = new InventoryWindow("Backpack", new Vector2(4, 6));
		WindowManager.add("backpack" + this.id, this.backpackInventoryWindow);
		
		this.name = "Backpack";
		this.updateDescription();
		this.src = "images/backpack.png";
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
		this.src = "images/small_wrench.png";
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
		this.src = "images/big_wrench.png";
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
		this.src = "images/toolbox.png";
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
		this.src = "images/map.png";
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
		this.src = "images/grappling_hook.png";
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
		this.src = "images/bavarium_wingsuit.png";
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
		this.src = "images/pills.png";
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
		this.src = "images/bandage.png";
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
		this.src = "images/first_aid_kit.png";
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
*/
