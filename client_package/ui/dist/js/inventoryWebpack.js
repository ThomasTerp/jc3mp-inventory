/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(1);
	__webpack_require__(14);
	const WindowManager = __webpack_require__(3);
	const inventoryWindow_1 = __webpack_require__(7);
	const adminWindow_1 = __webpack_require__(13);
	const vector2_1 = __webpack_require__(5);
	//Local inventory
	let localInventoryWindow = new inventoryWindow_1.InventoryWindow("Inventory", new vector2_1.Vector2(20, 12));
	WindowManager.add("local", localInventoryWindow);
	localInventoryWindow.hide();
	//Loot crate 1
	let lootInventoryWindow = new inventoryWindow_1.InventoryWindow("Loot Crate", new vector2_1.Vector2(10, 10));
	WindowManager.add("loot1", lootInventoryWindow);
	lootInventoryWindow.hide();
	//Loot crate 2
	let loot2InventoryWindow = new inventoryWindow_1.InventoryWindow("Loot Crate 2", new vector2_1.Vector2(10, 10));
	WindowManager.add("loot2", loot2InventoryWindow);
	loot2InventoryWindow.hide();
	//Admin window
	let adminWindow = new adminWindow_1.AdminWindow("Items");
	WindowManager.add("adminWindow", adminWindow);
	adminWindow.hide();
	$(document).on("keydown", (event) => {
	    //Key: I
	    if (event.which == 73) {
	        localInventoryWindow.toggle();
	    }
	    else if (event.which == 79) {
	        adminWindow.toggle();
	    }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemTypeManager = __webpack_require__(2);
	const WindowManager = __webpack_require__(3);
	const Util = __webpack_require__(4);
	const Labels = __webpack_require__(6);
	const inventoryWindow_1 = __webpack_require__(7);
	const inventorySlot_1 = __webpack_require__(11);
	const vector2_1 = __webpack_require__(5);
	//Makes sure all items gets put in the ItemTypeManagers
	function initialize() {
	    //Yes, this is meant to be empty, I had to do it because of how importing works I think
	}
	exports.initialize = initialize;
	//Item base
	class Item {
	    set src(value) {
	        this._src = value;
	        this.html.attr("src", this.src);
	    }
	    get src() {
	        return this._src;
	    }
	    set defaultSlots(value) {
	        this._defaultSlots = value;
	        this.slots = this.getDefaultSlotsClone();
	        this.updateHTML();
	    }
	    get defaultSlots() {
	        return this._defaultSlots;
	    }
	    //The state will be added with a "state-" prefix as html class
	    //States: "none", "inventory", "selected", "dragging", "invalid"
	    set state(value) {
	        //Remove old state
	        this.html.removeClass("state-" + this._state);
	        //Add new state
	        this.html.addClass("state-" + value);
	        this._state = value;
	    }
	    get state() {
	        return this._state;
	    }
	    constructor(id) {
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
	    get tooltip() {
	        return "<b>" + this.name + "</b><br />" + this.description;
	    }
	    getDefaultSlotsClone() {
	        return Util.cloneObject(this.defaultSlots);
	    }
	    createHTML() {
	        if (!this.html) {
	            this.html = $(`<img class="item" />`);
	            this.html.data("item", this);
	        }
	        return this.html;
	    }
	    updateHTML() {
	        let pixelDefaultSize = this.getPixelDefaultSize();
	        this.html.css({
	            "width": pixelDefaultSize.width + "px",
	            "height": pixelDefaultSize.height + "px",
	            "padding": this.padding + "px",
	        });
	        this.html.css("transform", "rotate(" + -this.rotation + "deg) scaleX(" + (this.isFlipped ? "-1" : "1") + ")");
	        //Adjust position for rotation and flipping
	        let top = 0;
	        let left = 0;
	        if (this.rotation == 0) {
	            top = 0;
	            left = 0;
	            if (this.isFlipped) {
	                left += pixelDefaultSize.width;
	            }
	        }
	        else if (this.rotation == 90) {
	            top = pixelDefaultSize.width;
	            left = 0;
	            if (this.isFlipped) {
	                top -= pixelDefaultSize.width;
	            }
	        }
	        else if (this.rotation == 180) {
	            top = pixelDefaultSize.height;
	            left = pixelDefaultSize.width;
	            if (this.isFlipped) {
	                left -= pixelDefaultSize.width;
	            }
	        }
	        else if (this.rotation == 270) {
	            top = 0;
	            left = pixelDefaultSize.height;
	            if (this.isFlipped) {
	                top += pixelDefaultSize.width;
	            }
	        }
	        this.html.css({
	            "margin-top": top + "px",
	            "margin-left": left + "px"
	        });
	    }
	    //Get size without rotations
	    getDefaultSize() {
	        return {
	            width: this.defaultSlots[0].length,
	            height: this.defaultSlots.length
	        };
	    }
	    //Get size with rotations
	    getSize() {
	        return {
	            width: this.slots[0].length,
	            height: this.slots.length
	        };
	    }
	    //Get pixel size without rotations
	    getPixelDefaultSize() {
	        let defaultSize = this.getDefaultSize();
	        let slotSize = inventorySlot_1.InventorySlot.getPixelSize() + 2;
	        return {
	            width: slotSize * defaultSize.width - 1,
	            height: slotSize * defaultSize.height - 1
	        };
	    }
	    //Get pixel size with rotations
	    getPixelSize() {
	        let size = this.getSize();
	        let slotSize = inventorySlot_1.InventorySlot.getPixelSize();
	        return {
	            width: slotSize * size.width * 1,
	            height: slotSize * size.height * 1
	        };
	    }
	    rotateClockwise() {
	        //Items can only be rotated while being dragged
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.rotation += 90;
	            if (this.rotation >= 360) {
	                this.rotation = 0;
	            }
	            //Adjust drag offset
	            let cursorOffset = this.itemDrag.getCursorOffset();
	            this.itemDrag.offset.y -= this.getPixelSize().width - cursorOffset.y - cursorOffset.x;
	            this.itemDrag.offset.x -= cursorOffset.y - cursorOffset.x;
	            this.updateSlots();
	        }
	    }
	    rotateCounterClockwise() {
	        //Items can only be rotated while being dragged
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.rotation -= 90;
	            if (this.rotation < 0) {
	                this.rotation = 270;
	            }
	            //Adjust drag offset
	            let cursorOffset = this.itemDrag.getCursorOffset();
	            this.itemDrag.offset.y -= cursorOffset.x - cursorOffset.y;
	            this.itemDrag.offset.x -= this.getPixelSize().height - cursorOffset.x - cursorOffset.y;
	            this.updateSlots();
	        }
	    }
	    flip() {
	        //Items can only be flipped while being dragged
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.isFlipped = !this.isFlipped;
	            //Adjust drag offset
	            if (this.rotation == 0 || this.rotation == 180) {
	                this.itemDrag.offset.x -= (this.getPixelDefaultSize().width * 0.5 - this.itemDrag.getCursorOffset().x) * 2;
	            }
	            else {
	                let oldOffsetTop = this.itemDrag.offset.y;
	                this.rotateClockwise();
	                this.rotateClockwise();
	                this.itemDrag.offset.y = oldOffsetTop;
	            }
	            this.updateSlots();
	        }
	    }
	    updateSlots() {
	        //Slots can only be updated while being dragged
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.slots = this.getDefaultSlotsClone();
	            if (this.isFlipped) {
	                for (let y = 0; y < this.getDefaultSize().height; y++) {
	                    this.slots[y].reverse();
	                }
	            }
	            this.slots = Util.rotateMatrix(this.slots, this.rotation);
	            this.updateHTML();
	        }
	    }
	}
	exports.Item = Item;
	//TODO: Put these other items in another file
	class FoodItem extends Item {
	    constructor(id) {
	        super(id);
	        this.health = 0;
	        this.hunger = 0;
	        this.thirst = 0;
	        this.category = "Food";
	        this.updateDescription();
	    }
	    updateDescription() {
	        let description = ``;
	        if (this.health !== 0) {
	            description += `Restore ` + Labels.health() + ` by ` + Labels.percentage(this.health);
	        }
	        if (this.hunger !== 0) {
	            description += (this.hunger > 0 ? `Decrease` : `Increase`) + ` ` + Labels.hunger() + ` by ` + Labels.percentage(this.hunger) + `<br />`;
	        }
	        if (this.thirst !== 0) {
	            description += (this.thirst > 0 ? `Decrease` : `Increase`) + ` ` + Labels.thirst() + ` by ` + Labels.percentage(this.thirst) + `<br />`;
	        }
	        this.description = description;
	    }
	}
	exports.FoodItem = FoodItem;
	class AppleItem extends FoodItem {
	    constructor(id) {
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
	exports.AppleItem = AppleItem;
	ItemTypeManager.add(AppleItem, [
	    () => {
	        return new AppleItem(-1);
	    }
	]);
	class RavelloBeansItem extends FoodItem {
	    constructor(id) {
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
	exports.RavelloBeansItem = RavelloBeansItem;
	ItemTypeManager.add(RavelloBeansItem, [
	    () => {
	        return new RavelloBeansItem(-1);
	    }
	]);
	class LaisChipsItem extends FoodItem {
	    constructor(id) {
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
	exports.LaisChipsItem = LaisChipsItem;
	ItemTypeManager.add(LaisChipsItem, [
	    () => {
	        return new LaisChipsItem(-1);
	    }
	]);
	class SnikersItem extends FoodItem {
	    constructor(id) {
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
	exports.SnikersItem = SnikersItem;
	ItemTypeManager.add(SnikersItem, [
	    () => {
	        return new SnikersItem(-1);
	    }
	]);
	class WaterBottleItem extends FoodItem {
	    constructor(id) {
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
	exports.WaterBottleItem = WaterBottleItem;
	ItemTypeManager.add(WaterBottleItem, [
	    () => {
	        return new WaterBottleItem(-1);
	    }
	]);
	class MilkGallonItem extends FoodItem {
	    constructor(id) {
	        super(id);
	        this.padding = 6;
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
	exports.MilkGallonItem = MilkGallonItem;
	ItemTypeManager.add(MilkGallonItem, [
	    () => {
	        return new MilkGallonItem(-1);
	    }
	]);
	class U39PlechovkaItem extends Item {
	    constructor(id) {
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
	exports.U39PlechovkaItem = U39PlechovkaItem;
	ItemTypeManager.add(U39PlechovkaItem, [
	    () => {
	        return new U39PlechovkaItem(-1);
	    }
	]);
	class GasCanItem extends Item {
	    constructor(id) {
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
	exports.GasCanItem = GasCanItem;
	ItemTypeManager.add(GasCanItem, [
	    () => {
	        return new GasCanItem(-1);
	    }
	]);
	class BackpackItem extends Item {
	    constructor(id) {
	        super(id);
	        this.backpackInventoryWindow = new inventoryWindow_1.InventoryWindow("Backpack", new vector2_1.Vector2(4, 6));
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
	    updateDescription() {
	        this.description = `Size: ` + this.backpackInventoryWindow.size.x + `x` + this.backpackInventoryWindow.size.y;
	    }
	}
	exports.BackpackItem = BackpackItem;
	ItemTypeManager.add(BackpackItem, [
	    () => {
	        return new BackpackItem(-1);
	    }
	]);
	class VehicleRepairItem extends Item {
	    constructor(id) {
	        super(id);
	        this.repairAmount = 100;
	        this.category = "Vehicles";
	        this.updateDescription();
	    }
	    updateDescription() {
	        let description = "";
	        if (this.repairAmount !== 0) {
	            description = Labels.repair(`Repair`) + ` a vehicle by ` + Labels.percentage(this.repairAmount);
	        }
	        this.description = description;
	    }
	}
	exports.VehicleRepairItem = VehicleRepairItem;
	class SmallWrenchItem extends VehicleRepairItem {
	    constructor(id) {
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
	exports.SmallWrenchItem = SmallWrenchItem;
	ItemTypeManager.add(SmallWrenchItem, [
	    () => {
	        return new SmallWrenchItem(-1);
	    }
	]);
	class BigWrenchItem extends VehicleRepairItem {
	    constructor(id) {
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
	exports.BigWrenchItem = BigWrenchItem;
	ItemTypeManager.add(BigWrenchItem, [
	    () => {
	        return new BigWrenchItem(-1);
	    }
	]);
	class ToolboxItem extends VehicleRepairItem {
	    constructor(id) {
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
	exports.ToolboxItem = ToolboxItem;
	ItemTypeManager.add(ToolboxItem, [
	    () => {
	        return new ToolboxItem(-1);
	    }
	]);
	class MapItem extends Item {
	    constructor(id) {
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
	exports.MapItem = MapItem;
	ItemTypeManager.add(MapItem, [
	    () => {
	        return new MapItem(-1);
	    }
	]);
	class GrapplingHookItem extends Item {
	    constructor(id) {
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
	exports.GrapplingHookItem = GrapplingHookItem;
	ItemTypeManager.add(GrapplingHookItem, [
	    () => {
	        return new GrapplingHookItem(-1);
	    }
	]);
	class BavariumWingsuitItem extends Item {
	    constructor(id) {
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
	exports.BavariumWingsuitItem = BavariumWingsuitItem;
	ItemTypeManager.add(BavariumWingsuitItem, [
	    () => {
	        return new BavariumWingsuitItem(-1);
	    }
	]);
	class PillsItem extends FoodItem {
	    constructor(id) {
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
	exports.PillsItem = PillsItem;
	ItemTypeManager.add(PillsItem, [
	    () => {
	        return new PillsItem(-1);
	    }
	]);
	class BandageItem extends FoodItem {
	    constructor(id) {
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
	exports.BandageItem = BandageItem;
	ItemTypeManager.add(BandageItem, [
	    () => {
	        return new BandageItem(-1);
	    }
	]);
	class FirstAidKitItem extends FoodItem {
	    constructor(id) {
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
	exports.FirstAidKitItem = FirstAidKitItem;
	ItemTypeManager.add(FirstAidKitItem, [
	    () => {
	        return new FirstAidKitItem(-1);
	    }
	]);


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	const itemTypeConstructorsMap = new Map();
	//Add constructors array for an item type, each constructor should return a new item
	//item: Item constructor()
	function add(itemType, constructors) {
	    remove(itemType);
	    itemTypeConstructorsMap.set(itemType, constructors);
	    return constructors;
	}
	exports.add = add;
	//Delete the constructors array for an item type
	function remove(itemType) {
	    let constructors = get(itemType);
	    if (constructors) {
	        itemTypeConstructorsMap.delete(itemType);
	    }
	}
	exports.remove = remove;
	//Get the constructors array for an item type
	function get(itemType) {
	    return itemTypeConstructorsMap.get(itemType);
	}
	exports.get = get;
	//Loop through all item types
	//callback(itemType: typeof Item, constructors: ItemConstructorFunction[]): boolean
	function forEach(callback) {
	    for (let [itemType, constructors] of itemTypeConstructorsMap.entries()) {
	        if (callback(itemType, constructors)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	let windowsHTML = $(".windows");
	let windowsMap = new Map();
	$(window).on("resize", (event) => {
	    this.forEach((uniqueName, window) => {
	        window.onResize();
	    });
	});
	//Add a window and give it a unique name
	function add(uniqueName, window) {
	    window.uniqueName = uniqueName;
	    remove(uniqueName);
	    windowsMap.set(uniqueName, window);
	    window.html.appendTo(windowsHTML);
	    return window;
	}
	exports.add = add;
	//Delete a window from the manager and detach its HTML
	function remove(uniqueName) {
	    let window = get(uniqueName);
	    if (window) {
	        window.uniqueName = null;
	        window.html.detach();
	        windowsMap.delete(uniqueName);
	    }
	}
	exports.remove = remove;
	//Get a window by its unique name
	function get(uniqueName) {
	    return windowsMap.get(uniqueName);
	}
	exports.get = get;
	//Loop through all windows, return true to break
	function forEach(callback) {
	    for (let [uniqueName, window] of windowsMap.entries()) {
	        if (callback(uniqueName, window)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const vector2_1 = __webpack_require__(5);
	//Modulo
	function mod(number, mod) {
	    return ((number % mod) + mod) % mod;
	}
	exports.mod = mod;
	;
	//Rotate a 2D array
	function rotateMatrix(matrix, direction) {
	    direction = mod(direction, 360) || 0;
	    //Efficiently builds and fills values at the same time.
	    let transpose = function (m) {
	        let result = new Array(m[0].length);
	        for (let i = 0; i < m[0].length; i++) {
	            result[i] = new Array(m.length - 1);
	            for (let j = m.length - 1; j > -1; j--) {
	                result[i][j] = m[j][i];
	            }
	        }
	        return result;
	    };
	    let reverseRows = function (m) {
	        return m.reverse();
	    };
	    let reverseCols = function (m) {
	        for (let i = 0; i < m.length; i++) {
	            m[i].reverse();
	        }
	        return m;
	    };
	    let rotate90Left = function (m) {
	        m = transpose(m);
	        m = reverseRows(m);
	        return m;
	    };
	    let rotate90Right = function (m) {
	        m = reverseRows(m);
	        m = transpose(m);
	        return m;
	    };
	    let rotate180 = function (m) {
	        m = reverseCols(m);
	        m = reverseRows(m);
	        return m;
	    };
	    if (direction == 90 || direction == -270) {
	        return rotate90Left(matrix);
	    }
	    else if (direction == -90 || direction == 270) {
	        return rotate90Right(matrix);
	    }
	    else if (Math.abs(direction) == 180) {
	        return rotate180(matrix);
	    }
	    return matrix;
	}
	exports.rotateMatrix = rotateMatrix;
	;
	function cloneObject(objectToClone) {
	    let objectClone = (objectToClone instanceof Array) ? [] : {};
	    for (let index in objectToClone) {
	        if (index == 'clone') {
	            continue;
	        }
	        if (objectToClone[index] && typeof objectToClone[index] == "object") {
	            objectClone[index] = cloneObject(objectToClone[index]);
	        }
	        else {
	            objectClone[index] = objectToClone[index];
	        }
	    }
	    return objectClone;
	}
	exports.cloneObject = cloneObject;
	;
	function capitalizeFirstLetter(text) {
	    return text.charAt(0).toUpperCase() + text.slice(1);
	}
	exports.capitalizeFirstLetter = capitalizeFirstLetter;
	;
	//Cursor position
	let cursorPosition = new vector2_1.Vector2(0, 0);
	$(window).on("mousemove", (event) => {
	    cursorPosition.x = event.pageX;
	    cursorPosition.y = event.pageY;
	});
	//Returns a position object for the cursor position
	function getCursorPosition() {
	    return cursorPosition;
	}
	exports.getCursorPosition = getCursorPosition;
	;
	//Is CTRL pressed
	let isCtrlPressedBool = false;
	$(window).on("keydown", (event) => {
	    //CTRL
	    if (event.which == 17) {
	        isCtrlPressedBool = true;
	    }
	});
	$(window).on("keyup", (event) => {
	    //CTRL
	    if (event.which == 17) {
	        isCtrlPressedBool = false;
	    }
	});
	//Returns true if CTRL is pressed
	function isCtrlPressed() {
	    return isCtrlPressedBool;
	}
	exports.isCtrlPressed = isCtrlPressed;
	;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	class Coord {
	    constructor(x = 0, y = 0) {
	        this.x = x;
	        this.y = y;
	    }
	}
	exports.Vector2 = Coord;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	//Returns a span string with a css class
	function spanClass(className, html) {
	    return `<span class="` + className + `">` + html + `</span>`;
	}
	exports.spanClass = spanClass;
	//Returns a span string with a css color
	function spanColor(color, html) {
	    return `<span style="color: ` + color + `;">` + html + `</span>`;
	}
	exports.spanColor = spanColor;
	//Adds a percentage sign (%) after the number. If the number is positive, it will be green, if not, it will be red.
	function percentage(amount) {
	    return this.spanClass(amount >= 0 ? "label-percentage-positive" : "label-percentage-negative", Math.abs(amount) + `%`);
	}
	exports.percentage = percentage;
	//Returns the health in red
	function health(html = `health`) {
	    return this.spanClass("label-health", html);
	}
	exports.health = health;
	//Returns the hunger in green
	function hunger(html = `hunger`) {
	    return this.spanClass("label-hunger", html);
	}
	exports.hunger = hunger;
	//Returns the thirst in blue
	function thirst(html = `thirst`) {
	    return this.spanClass("label-thirst", html);
	}
	exports.thirst = thirst;
	//Returns the repair in yellow
	function repair(html = `repair`) {
	    return this.spanClass("label-repair", html);
	}
	exports.repair = repair;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Util = __webpack_require__(4);
	const ItemManager = __webpack_require__(8);
	const window_1 = __webpack_require__(12);
	const inventorySlot_1 = __webpack_require__(11);
	const itemDrag_1 = __webpack_require__(10);
	const vector2_1 = __webpack_require__(5);
	class InventoryWindow extends window_1.Window {
	    constructor(titleHTML, size) {
	        super(titleHTML);
	        this.size = size;
	        this.items = [];
	        this.slots = [];
	        this.createContentHTML();
	        this.updateHTML();
	    }
	    createHTML() {
	        super.createHTML();
	        this.html.addClass("inventory-window");
	        return this.html;
	    }
	    createContentHTML() {
	        this.contentHTML.html(`
				<div class="slots"></div>
				<div class="items"></div>
			`);
	        this.slotsHTML = this.contentHTML.find(".slots");
	        this.itemsHTML = this.contentHTML.find(".items");
	        for (let y = 0; y < this.size.y; y++) {
	            let rowHTML = $('<div class="row"></div>');
	            this.slots[y] = [];
	            for (let x = 0; x < this.size.x; x++) {
	                this.slots[y][x] = new inventorySlot_1.InventorySlot(this, new vector2_1.Vector2(x, y));
	                rowHTML.append(this.slots[y][x].html);
	            }
	            this.slotsHTML.append(rowHTML);
	        }
	        //Item dragging
	        this.slotsHTML.on("mousedown", ".slot", (event) => {
	            if (!Util.isCtrlPressed()) {
	                let slot = $(event.currentTarget).data("slot");
	                if (slot && slot.item) {
	                    ItemManager.startDragging(slot.item, new vector2_1.Vector2(event.pageX, event.pageY));
	                    event.preventDefault();
	                }
	            }
	        });
	        return this.contentHTML;
	    }
	    updateHTML() {
	        let slotSize = inventorySlot_1.InventorySlot.getPixelSize();
	        let inner = this.slotsHTML.find(".slot .inner");
	        inner.css({
	            "width": slotSize + "px",
	            "height": slotSize + "px"
	        });
	        this.items.forEach((item, itemIndex) => {
	            this.updateItemHTMLPosition(item);
	        });
	    }
	    updateItemHTMLPosition(item) {
	        let slot = this.getSlot(item.inventoryPosition);
	        let slotHTMLPosition = slot.html.position();
	        item.html.css({
	            "top": slotHTMLPosition.top + 1 + "px",
	            "left": slotHTMLPosition.left + 1 + "px",
	        });
	    }
	    getSlot(position) {
	        return this.slots[position.y][position.x];
	    }
	    setSlotsItem(item) {
	        for (let y = 0; y < item.slots.length; y++) {
	            for (let x = 0; x < item.slots[y].length; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2_1.Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
	                    slot.state = "item";
	                    slot.item = item;
	                }
	            }
	        }
	    }
	    unsetSlotsItem(item) {
	        for (let y = 0; y < item.slots.length; y++) {
	            for (let x = 0; x < item.slots[y].length; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2_1.Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
	                    slot.state = "empty";
	                    slot.item = undefined;
	                    //Required for a rare bug
	                    itemDrag_1.ItemDrag.slotModifications.set(slot, slot.state);
	                }
	            }
	        }
	    }
	    addItem(item, position) {
	        this.items[item.id] = item;
	        item.createHTML();
	        item.inventoryWindow = this;
	        item.inventoryPosition = position;
	        item.state = "inventory";
	        this.updateItemHTMLPosition(item);
	        item.html.css("pointer-events", "none");
	        this.html.find(".items").append(item.html);
	        this.setSlotsItem(item);
	    }
	    removeItem(item) {
	        this.unsetSlotsItem(item);
	        item.inventoryWindow = undefined;
	        item.inventoryPosition = undefined;
	        item.state = "invalid";
	        item.html.detach().appendTo("body > .items");
	        delete this.items[item.id];
	    }
	    isItemWithinInventory(item, position) {
	        let itemSize = item.getSize();
	        return position.x + itemSize.width <= this.size.x && position.y + itemSize.height <= this.size.y;
	    }
	    canItemBePlaced(item, position) {
	        let itemSize = item.getSize();
	        for (let y = 0; y < itemSize.height; y++) {
	            for (let x = 0; x < itemSize.width; x++) {
	                let isSolid = item.slots[y][x] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2_1.Vector2(position.x + x, position.y + y));
	                    if (slot.item) {
	                        return false;
	                    }
	                }
	            }
	        }
	        return true;
	    }
	    onResize() {
	        super.onResize();
	        this.updateHTML();
	    }
	}
	exports.InventoryWindow = InventoryWindow;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemSelection = __webpack_require__(9);
	const Util = __webpack_require__(4);
	const itemDrag_1 = __webpack_require__(10);
	const vector2_1 = __webpack_require__(5);
	let itemsHTML = $("body > .items");
	let itemsMap = new Map();
	$(document.body).on("mousemove", (event) => {
	    itemDrag_1.ItemDrag.undoSlotModifications();
	    itemDrag_1.ItemDrag.forEachInItemManager((itemDrag) => {
	        if (Util.isCtrlPressed() && !itemDrag.hasMoved) {
	            delete itemDrag.item.itemDrag;
	            return;
	        }
	        itemDrag.update();
	    });
	});
	//Dropping of item drag
	$(document.body).on("mouseup", (event) => {
	    itemDrag_1.ItemDrag.forEachInItemManager((itemDrag) => {
	        if (itemDrag.hasMoved) {
	            itemDrag.update();
	            itemDrag_1.ItemDrag.undoSlotModifications();
	            let slot = itemDrag.getSlot(itemDrag.getPosition());
	            let isDroppedOutside = false;
	            if (slot) {
	                if (!slot.inventoryWindow.isItemWithinInventory(itemDrag.item, slot.position) || !slot.inventoryWindow.canItemBePlaced(itemDrag.item, slot.position)) {
	                    isDroppedOutside = true;
	                }
	            }
	            else {
	                isDroppedOutside = true;
	            }
	            if (isDroppedOutside) {
	                itemDrag.item.html.css({
	                    "pointer-events": "auto",
	                });
	            }
	            else {
	                slot.inventoryWindow.addItem(itemDrag.item, slot.position);
	            }
	            itemDrag.item.state = "selected";
	        }
	        delete itemDrag.item.itemDrag;
	    });
	});
	//Dragging of items outside inventory
	$(document.body).on("mousedown", ".item", (event) => {
	    let item = $(event.currentTarget).data("item");
	    if (item && get(item.id) && !Util.isCtrlPressed()) {
	        startDragging(item, new vector2_1.Vector2(event.pageX, event.pageY));
	        event.preventDefault();
	    }
	});
	$(document.body).on("keydown", (event) => {
	    itemDrag_1.ItemDrag.undoSlotModifications();
	    itemDrag_1.ItemDrag.forEachInItemManager((itemDrag) => {
	        if (itemDrag.hasMoved) {
	            switch (event.which) {
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
	$(window).on("resize", (event) => {
	    forEach((id, item) => {
	        item.updateHTML();
	    });
	});
	//Start dragging selected items, this should be called inside a mousedown event
	function startDragging(item, position) {
	    if (!item.isSelected) {
	        //Selection is canceled if item is not part of the selection, and the item becomes the only selected item
	        ItemSelection.clearSelection();
	        ItemSelection.setSelectedHTML(item, true);
	        ItemSelection.selectedItems.set(item, true);
	    }
	    ItemSelection.selectedItems.forEach((isSelected, item) => {
	        if (isSelected) {
	            let offset = item.html.offset();
	            item.itemDrag = new itemDrag_1.ItemDrag(item, new vector2_1.Vector2(offset.left - position.x, offset.top - position.y));
	        }
	    });
	}
	exports.startDragging = startDragging;
	function add(id, item) {
	    item.id = id;
	    remove(id);
	    itemsMap.set(id, item);
	    item.html.appendTo(itemsHTML);
	    return item;
	}
	exports.add = add;
	function remove(id) {
	    let item = get(id);
	    if (item) {
	        item.html.detach();
	        itemsMap.delete(id);
	    }
	}
	exports.remove = remove;
	//Get a window by its unique name
	function get(id) {
	    return itemsMap.get(id);
	}
	exports.get = get;
	//Loop through all items, return true to break
	function forEach(callback) {
	    for (let [id, item] of itemsMap.entries()) {
	        if (callback(id, item)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemManager = __webpack_require__(8);
	const Util = __webpack_require__(4);
	const vector2_1 = __webpack_require__(5);
	//TODO: Do this in a better way
	exports.selectingItems = new Map();
	exports.selectedItems = new Map();
	//Create selection when mouse is down
	$("body").on("mousedown", (event) => {
	    let shouldCreateItemSelection = true;
	    let targetHTML = $(event.target);
	    removeHTML();
	    if (!Util.isCtrlPressed()) {
	        //Selections can't be started on an item if ctrl is pressed
	        if (targetHTML.hasClass("slot")) {
	            let slot = targetHTML.data("slot");
	            if (slot && slot.item) {
	                shouldCreateItemSelection = false;
	            }
	        }
	        else if (targetHTML.data("item")) {
	            shouldCreateItemSelection = false;
	        }
	    }
	    //Selections can't be started in ui draggables
	    if (targetHTML.closest(".ui-draggable-handle").length > 0) {
	        shouldCreateItemSelection = false;
	    }
	    if (shouldCreateItemSelection) {
	        if (!Util.isCtrlPressed()) {
	            clearSelection();
	        }
	        createHTML(new vector2_1.Vector2(event.pageX, event.pageY));
	    }
	    update();
	    event.preventDefault();
	});
	$("body").on("mousemove", (event) => {
	    update();
	});
	$("body").on("mouseup", (event) => {
	    applySelection();
	    removeHTML();
	});
	function createHTML(position) {
	    exports.selectionPosition = position;
	    exports.selectionHTML = $(`<div class="item-selection"></div>`);
	    exports.selectionHTML.css({
	        "top": position.y,
	        "left": position.x
	    });
	    $("body").append(exports.selectionHTML);
	    return exports.selectionHTML;
	}
	exports.createHTML = createHTML;
	function removeHTML() {
	    if (exports.selectionHTML) {
	        exports.selectionHTML.remove();
	        exports.selectionHTML = undefined;
	    }
	}
	exports.removeHTML = removeHTML;
	function update() {
	    if (exports.selectionHTML) {
	        let cursorPosition = Util.getCursorPosition();
	        //Update selection size
	        exports.selectionHTML.css({
	            "top": Math.min(cursorPosition.y, exports.selectionPosition.y),
	            "left": Math.min(cursorPosition.x, exports.selectionPosition.x),
	            "height": Math.abs(cursorPosition.y - exports.selectionPosition.y),
	            "width": Math.abs(cursorPosition.x - exports.selectionPosition.x)
	        });
	        ItemManager.forEach((id, item) => {
	            let isSelected = false;
	            if (item.inventoryWindow) {
	                let itemSize = item.getSize();
	                //Check if any inventory slot from the item is inside the selection
	                checkForSlotsInSelection: for (let y = 0; y < itemSize.height; y++) {
	                    for (let x = 0; x < itemSize.width; x++) {
	                        let isSolid = item.slots[y][x] == 1;
	                        if (isSolid) {
	                            let slot = item.inventoryWindow.getSlot(new vector2_1.Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
	                            if (isHTMLInsideSelection(slot.html)) {
	                                isSelected = true;
	                                break checkForSlotsInSelection;
	                            }
	                        }
	                    }
	                }
	            }
	            else {
	                //If the item is outside an inventory
	                if (isHTMLInsideSelection(item.html)) {
	                    isSelected = true;
	                }
	            }
	            if (exports.selectedItems.get(item)) {
	                isSelected = !isSelected;
	            }
	            setSelectedHTML(item, isSelected);
	            exports.selectingItems.set(item, isSelected);
	        });
	    }
	}
	exports.update = update;
	function applySelection() {
	    exports.selectingItems.forEach((isSelected, item) => {
	        exports.selectedItems.set(item, isSelected);
	        item.isSelected = isSelected;
	    });
	}
	exports.applySelection = applySelection;
	function isHTMLInsideSelection(html) {
	    let thisHTMLTop = exports.selectionHTML.offset().top;
	    let thisHTMLLeft = exports.selectionHTML.offset().left;
	    let htmlTop = html.offset().top;
	    let htmlLeft = html.offset().left;
	    return !(((thisHTMLTop + exports.selectionHTML.height()) < (htmlTop)) ||
	        (thisHTMLTop > (htmlTop + html.height())) ||
	        ((thisHTMLLeft + exports.selectionHTML.width()) < htmlLeft) ||
	        (thisHTMLLeft > (htmlLeft + html.width())));
	}
	exports.isHTMLInsideSelection = isHTMLInsideSelection;
	function setSelectedHTML(item, isSelected) {
	    if (isSelected) {
	        item.state = "selected";
	    }
	    else {
	        if (item.inventoryWindow) {
	            item.state = "inventory";
	        }
	        else {
	            item.state = "invalid";
	        }
	    }
	}
	exports.setSelectedHTML = setSelectedHTML;
	function clearSelection() {
	    exports.selectedItems.forEach((isSelected, item) => {
	        setSelectedHTML(item, false);
	        item.isSelected = false;
	    });
	    exports.selectedItems.clear();
	    exports.selectingItems.clear();
	}
	exports.clearSelection = clearSelection;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemManager = __webpack_require__(8);
	const Util = __webpack_require__(4);
	const inventorySlot_1 = __webpack_require__(11);
	const vector2_1 = __webpack_require__(5);
	//Class for dragging items
	class ItemDrag {
	    constructor(item, offset) {
	        this.item = item;
	        this.offset = offset;
	        this.hasMoved = false;
	    }
	    static undoSlotModifications() {
	        ItemDrag.slotModifications.forEach((oldState, slot) => {
	            slot.state = oldState;
	        });
	        ItemDrag.slotModifications.clear();
	    }
	    //Calls a provided function once per item with itemDrag, in an item manager
	    //shouldBreak callback(itemDrag)
	    static forEachInItemManager(callback) {
	        ItemManager.forEach((id, item) => {
	            if (item.itemDrag) {
	                if (callback(item.itemDrag)) {
	                    return true;
	                }
	            }
	        });
	    }
	    static isAnyItemBeingDragged() {
	        let isAnyItemBeingDragged = false;
	        ItemDrag.undoSlotModifications();
	        ItemDrag.forEachInItemManager((itemDrag) => {
	            isAnyItemBeingDragged = true;
	            return true;
	        });
	        return isAnyItemBeingDragged;
	    }
	    getPosition() {
	        let cursorPosition = Util.getCursorPosition();
	        return new vector2_1.Vector2(cursorPosition.x + this.offset.x, cursorPosition.y + this.offset.y);
	    }
	    getCursorOffset() {
	        let position = this.getPosition();
	        let cursorPosition = Util.getCursorPosition();
	        return new vector2_1.Vector2(cursorPosition.x - position.x, cursorPosition.y - position.y);
	    }
	    getSlot(position) {
	        let elementFromPointOffset = inventorySlot_1.InventorySlot.getPixelSize() * 0.5;
	        let element = $(document.elementFromPoint(position.x + elementFromPointOffset, position.y + elementFromPointOffset));
	        if (element.hasClass("slot")) {
	            return element.data("slot");
	        }
	    }
	    update() {
	        if (!this.hasMoved) {
	            this.startMove();
	            this.hasMoved = true;
	        }
	        let position = this.getPosition();
	        this.item.html.css({
	            "left": position.x + "px",
	            "top": position.y + "px"
	        });
	        let slot = this.getSlot(position);
	        let isValidPosition = true;
	        if (slot && slot.inventoryWindow.isItemWithinInventory(this.item, slot.position)) {
	            let itemSize = this.item.getSize();
	            for (let y = 0; y < itemSize.height; y++) {
	                for (let x = 0; x < itemSize.width; x++) {
	                    let isSolid = this.item.slots[y][x] == 1;
	                    if (isSolid) {
	                        let slot2 = slot.inventoryWindow.getSlot(new vector2_1.Vector2(slot.position.x + x, slot.position.y + y));
	                        if (!ItemDrag.slotModifications.has(slot2)) {
	                            ItemDrag.slotModifications.set(slot2, slot2.state);
	                            if (slot2.item) {
	                                isValidPosition = false;
	                                slot2.state = "hover-item";
	                            }
	                            else {
	                                slot2.state = "hover";
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        else {
	            isValidPosition = false;
	        }
	        if (isValidPosition) {
	            this.item.state = "dragging";
	        }
	        else {
	            this.item.state = "invalid";
	        }
	    }
	    startMove() {
	        this.item.html.css("pointer-events", "none");
	        if (this.item.inventoryWindow) {
	            this.item.inventoryWindow.removeItem(this.item);
	        }
	    }
	}
	ItemDrag.slotModifications = new Map();
	exports.ItemDrag = ItemDrag;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	//Class for a slot in an inventory
	class InventorySlot {
	    static getPixelSize() {
	        return $(window).width() * 0.02 + 1;
	    }
	    //Set state of the slot
	    //The state will be added with a "state-" prefix as html class
	    //States: "empty", "item", "hover", "hover-item"
	    set state(value) {
	        //Remove old state
	        this.html.removeClass("state-" + this._state);
	        //Add new state
	        this.html.addClass("state-" + value);
	        this._state = value;
	    }
	    //Get state of the slot
	    get state() {
	        return this._state;
	    }
	    constructor(inventoryWindow, position) {
	        this.createHTML();
	        this.inventoryWindow = inventoryWindow;
	        this.position = position;
	        this.state = "empty";
	    }
	    createHTML() {
	        if (!this.html) {
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
	exports.InventorySlot = InventorySlot;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	//Class for a draggable window
	class Window {
	    set uniqueName(value) {
	        this._uniqueName = value;
	        this.html.attr("id", "window-" + this.uniqueName);
	    }
	    get uniqueName() {
	        return this._uniqueName;
	    }
	    set isVisible(value) {
	        this._isVisible = value;
	        if (this.isVisible) {
	            this.html.show();
	        }
	        else {
	            this.html.hide();
	        }
	    }
	    get isVisible() {
	        return this._isVisible;
	    }
	    constructor(titleHTML) {
	        this.createHTML();
	        this.uniqueName = null;
	        this.titleHTML.html(titleHTML);
	        this.show();
	    }
	    destroy() {
	        this.html.remove();
	    }
	    createHTML() {
	        if (!this.html) {
	            this.html = $(`
					<div class="window">
						<div class="top-bar">
							<div class="title"></div>
							<div class="close">✖</div>
						</div>
						<div class="content"></div>
					<div>
				`);
	            this.html.data("window", this);
	            //Move window to front when it gets pressed
	            this.html.on("mousedown", (event) => {
	                this.moveToFront();
	            });
	            //Close inventory when clicking on close button
	            this.html.find(".close").on("click", (event) => {
	                this.hide();
	            });
	            //Make window draggable
	            this.html.draggable({
	                handle: ".top-bar",
	                snap: ".window",
	                snapTolerance: 10,
	                containment: "body",
	                scroll: false
	            });
	            this.titleHTML = this.html.find(".top-bar .title");
	            this.contentHTML = this.html.find(".content");
	        }
	        return this.html;
	    }
	    moveToFront() {
	        $(".window").css("z-index", "");
	        this.html.css("z-index", "1");
	    }
	    show() {
	        this.isVisible = true;
	    }
	    hide() {
	        this.isVisible = false;
	    }
	    toggle() {
	        this.isVisible = !this.isVisible;
	    }
	    onResize() {
	    }
	}
	exports.Window = Window;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemManager = __webpack_require__(8);
	const ItemTypeManager = __webpack_require__(2);
	const window_1 = __webpack_require__(12);
	const vector2_1 = __webpack_require__(5);
	class ItemCloner {
	    constructor(itemConstructor) {
	        this.itemConstructor = itemConstructor;
	        this.item = this.itemConstructor();
	        this.item.html.css("position", "relative");
	        this.createHTML();
	        this.bindEvents();
	    }
	    destroy() {
	        this.html.remove();
	    }
	    createHTML() {
	        this.html = $(`<div class="item-cloner"></div>`);
	        this.html.append(this.item.html);
	        this.html.data("itemCloner", this);
	        return this.html;
	    }
	    bindEvents() {
	        //On mousedown, create an item clone and start dragging it
	        $(this.html).on("mousedown", { itemCloner: this }, (event) => {
	            let position = this.html.offset();
	            let item = this.itemConstructor();
	            item.html.css({
	                "left": position.left + "px",
	                "top": position.top + "px"
	            });
	            ItemManager.add(Math.floor(Math.random() * (100000 - 100 + 1)) + 100, item);
	            ItemManager.startDragging(item, new vector2_1.Vector2(event.pageX, event.pageY));
	            item.itemDrag.hasMoved = true;
	            event.preventDefault();
	        });
	    }
	}
	exports.ItemCloner = ItemCloner;
	class AdminWindow extends window_1.Window {
	    constructor(titleHTML) {
	        super(titleHTML);
	        this.createContentHTML();
	    }
	    destroy() {
	        super.destroy();
	    }
	    createHTML() {
	        super.createHTML();
	        this.html.addClass("admin-window");
	        return this.html;
	    }
	    createContentHTML() {
	        this.contentHTML.html(`<div class="items"></div>`);
	        this.itemsHTML = this.contentHTML.find(".items");
	        ItemTypeManager.forEach((itemType, constructors) => {
	            constructors.forEach((constructor, constructorIndex) => {
	                this.itemsHTML.append(new ItemCloner(constructor).html);
	            });
	        });
	        return this.contentHTML;
	    }
	}
	exports.AdminWindow = AdminWindow;


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	$(document).tooltip({
	    track: true,
	    items: ".slot, .item",
	    hide: false,
	    show: false,
	    content: function () {
	        console.log("content");
	        let html = $(this);
	        let item;
	        if (html.hasClass("slot")) {
	            let slot = html.data("slot");
	            if (slot && slot.item) {
	                item = slot.item;
	            }
	        }
	        else if (html.hasClass("item")) {
	            item = html.data("item");
	        }
	        if (item) {
	            return item.tooltip;
	        }
	    }
	});
	$(document).on("mousedown", (event) => {
	    $(document).tooltip("disable");
	});
	$(document).on("mouseup", (event) => {
	    $(document).tooltip("enable");
	});


/***/ }
/******/ ]);