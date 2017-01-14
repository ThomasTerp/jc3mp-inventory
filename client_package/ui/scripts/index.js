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
	__webpack_require__(13);
	__webpack_require__(9);
	__webpack_require__(14);
	const WindowManager = __webpack_require__(3);
	const inventoryWindow_1 = __webpack_require__(7);
	const adminWindow_1 = __webpack_require__(15);
	let adminWindow = new adminWindow_1.AdminWindow("Items");
	WindowManager.add("adminWindow", adminWindow);
	let chatIsOpen = false;
	jcmp.AddEvent('chat_input_state', function (state) {
	    chatIsOpen = state;
	});
	jcmp.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	    if (isVisible) {
	        jcmp.ShowCursor();
	    }
	    else {
	        jcmp.HideCursor();
	    }
	});
	$(document).on("keydown", (event) => {
	    if (!chatIsOpen) {
	        switch (event.which) {
	            case 73:
	                const inventoryWindow = inventoryWindow_1.getLocalInventoryWindow();
	                if (inventoryWindow !== null) {
	                    inventoryWindow.toggle();
	                }
	                break;
	            case 79:
	                adminWindow.toggle();
	                break;
	            default:
	                return;
	        }
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
	function initialize() {
	}
	exports.initialize = initialize;
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
	    set state(value) {
	        this.html.removeClass("state-" + this._state);
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
	        this.src = "images/item_base.png";
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
	    getDefaultSize() {
	        return {
	            width: this.defaultSlots[0].length,
	            height: this.defaultSlots.length
	        };
	    }
	    getSize() {
	        return {
	            width: this.slots[0].length,
	            height: this.slots.length
	        };
	    }
	    getPixelDefaultSize() {
	        let defaultSize = this.getDefaultSize();
	        let slotSize = inventorySlot_1.InventorySlot.getPixelSize() + 2;
	        return {
	            width: slotSize * defaultSize.width - 1,
	            height: slotSize * defaultSize.height - 1
	        };
	    }
	    getPixelSize() {
	        let size = this.getSize();
	        let slotSize = inventorySlot_1.InventorySlot.getPixelSize();
	        return {
	            width: slotSize * size.width * 1,
	            height: slotSize * size.height * 1
	        };
	    }
	    rotateClockwise() {
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.rotation += 90;
	            if (this.rotation >= 360) {
	                this.rotation = 0;
	            }
	            let cursorOffset = this.itemDrag.getCursorOffset();
	            this.itemDrag.offset.y -= this.getPixelSize().width - cursorOffset.y - cursorOffset.x;
	            this.itemDrag.offset.x -= cursorOffset.y - cursorOffset.x;
	            this.updateSlots();
	        }
	    }
	    rotateCounterClockwise() {
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.rotation -= 90;
	            if (this.rotation < 0) {
	                this.rotation = 270;
	            }
	            let cursorOffset = this.itemDrag.getCursorOffset();
	            this.itemDrag.offset.y -= cursorOffset.x - cursorOffset.y;
	            this.itemDrag.offset.x -= this.getPixelSize().height - cursorOffset.x - cursorOffset.y;
	            this.updateSlots();
	        }
	    }
	    flip() {
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.isFlipped = !this.isFlipped;
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
	        this.src = "images/apple.png";
	        this.defaultSlots = [
	            [1],
	        ];
	    }
	}
	exports.AppleItem = AppleItem;
	ItemTypeManager.add(AppleItem.name, [
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
	        this.src = "images/ravello_beans.png";
	        this.defaultSlots = [
	            [1],
	            [1],
	        ];
	    }
	}
	exports.RavelloBeansItem = RavelloBeansItem;
	ItemTypeManager.add(RavelloBeansItem.name, [
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
	        this.src = "images/lais_chips.png";
	        this.defaultSlots = [
	            [1, 1],
	            [1, 1],
	            [1, 1],
	        ];
	    }
	}
	exports.LaisChipsItem = LaisChipsItem;
	ItemTypeManager.add(LaisChipsItem.name, [
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
	        this.src = "images/snikers.png";
	        this.defaultSlots = [
	            [1, 1],
	        ];
	    }
	}
	exports.SnikersItem = SnikersItem;
	ItemTypeManager.add(SnikersItem.name, [
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
	        this.src = "images/water_bottle.png";
	        this.defaultSlots = [
	            [1],
	            [1],
	            [1],
	        ];
	    }
	}
	exports.WaterBottleItem = WaterBottleItem;
	ItemTypeManager.add(WaterBottleItem.name, [
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
	        this.src = "images/milk_gallon.png";
	        this.defaultSlots = [
	            [1, 1],
	            [1, 1],
	            [1, 1],
	        ];
	    }
	}
	exports.MilkGallonItem = MilkGallonItem;
	ItemTypeManager.add(MilkGallonItem.name, [
	    () => {
	        return new MilkGallonItem(-1);
	    }
	]);
	class U39PlechovkaItem extends Item {
	    constructor(id) {
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
	exports.U39PlechovkaItem = U39PlechovkaItem;
	ItemTypeManager.add(U39PlechovkaItem.name, [
	    () => {
	        return new U39PlechovkaItem(-1);
	    }
	]);
	class GasCanItem extends Item {
	    constructor(id) {
	        super(id);
	        this.name = "Gas Can";
	        this.src = "images/gas_can.png";
	        this.defaultSlots = [
	            [1, 1],
	            [1, 1],
	            [1, 1],
	            [1, 1],
	        ];
	    }
	}
	exports.GasCanItem = GasCanItem;
	ItemTypeManager.add(GasCanItem.name, [
	    () => {
	        return new GasCanItem(-1);
	    }
	]);
	class BackpackItem extends Item {
	    constructor(id) {
	        super(id);
	        this.backpackInventoryWindow = new inventoryWindow_1.InventoryWindow("Backpack", new vector2_1.Vector2(4, 6));
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
	    updateDescription() {
	        this.description = `Size: ` + this.backpackInventoryWindow.size.x + `x` + this.backpackInventoryWindow.size.y;
	    }
	}
	exports.BackpackItem = BackpackItem;
	ItemTypeManager.add(BackpackItem.name, [
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
	        this.src = "images/small_wrench.png";
	        this.defaultSlots = [
	            [1, 1]
	        ];
	    }
	}
	exports.SmallWrenchItem = SmallWrenchItem;
	ItemTypeManager.add(SmallWrenchItem.name, [
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
	        this.src = "images/big_wrench.png";
	        this.defaultSlots = [
	            [1, 1, 1],
	        ];
	    }
	}
	exports.BigWrenchItem = BigWrenchItem;
	ItemTypeManager.add(BigWrenchItem.name, [
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
	        this.src = "images/toolbox.png";
	        this.defaultSlots = [
	            [1, 1, 1],
	            [1, 1, 1],
	        ];
	    }
	}
	exports.ToolboxItem = ToolboxItem;
	ItemTypeManager.add(ToolboxItem.name, [
	    () => {
	        return new ToolboxItem(-1);
	    }
	]);
	class MapItem extends Item {
	    constructor(id) {
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
	exports.MapItem = MapItem;
	ItemTypeManager.add(MapItem.name, [
	    () => {
	        return new MapItem(-1);
	    }
	]);
	class GrapplingHookItem extends Item {
	    constructor(id) {
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
	exports.GrapplingHookItem = GrapplingHookItem;
	ItemTypeManager.add(GrapplingHookItem.name, [
	    () => {
	        return new GrapplingHookItem(-1);
	    }
	]);
	class BavariumWingsuitItem extends Item {
	    constructor(id) {
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
	exports.BavariumWingsuitItem = BavariumWingsuitItem;
	ItemTypeManager.add(BavariumWingsuitItem.name, [
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
	        this.src = "images/pills.png";
	        this.defaultSlots = [
	            [1],
	        ];
	    }
	}
	exports.PillsItem = PillsItem;
	ItemTypeManager.add(PillsItem.name, [
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
	        this.src = "images/bandage.png";
	        this.defaultSlots = [
	            [1],
	            [1],
	        ];
	    }
	}
	exports.BandageItem = BandageItem;
	ItemTypeManager.add(BandageItem.name, [
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
	        this.src = "images/first_aid_kit.png";
	        this.defaultSlots = [
	            [1, 1],
	            [1, 1],
	        ];
	    }
	}
	exports.FirstAidKitItem = FirstAidKitItem;
	ItemTypeManager.add(FirstAidKitItem.name, [
	    () => {
	        return new FirstAidKitItem(-1);
	    }
	]);


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	const itemTypeConstructorsMap = new Map();
	function add(itemType, constructors) {
	    remove(itemType);
	    itemTypeConstructorsMap.set(itemType, constructors);
	    return constructors;
	}
	exports.add = add;
	function remove(itemType) {
	    let constructors = get(itemType);
	    if (constructors) {
	        itemTypeConstructorsMap.delete(itemType);
	    }
	}
	exports.remove = remove;
	function get(itemType) {
	    return itemTypeConstructorsMap.get(itemType);
	}
	exports.get = get;
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
	const windowsHTML = $(".windows");
	const windowsMap = new Map();
	$(window).on("resize", (event) => {
	    this.forEach((uniqueName, window) => {
	        window.onResize();
	    });
	});
	function add(uniqueName, window) {
	    window.uniqueName = uniqueName;
	    remove(uniqueName);
	    windowsMap.set(uniqueName, window);
	    window.html.appendTo(windowsHTML);
	    return window;
	}
	exports.add = add;
	function remove(uniqueName) {
	    let window = get(uniqueName);
	    if (window) {
	        window.uniqueName = null;
	        window.html.detach();
	        windowsMap.delete(uniqueName);
	    }
	}
	exports.remove = remove;
	function get(uniqueName) {
	    return windowsMap.get(uniqueName);
	}
	exports.get = get;
	function forEach(callback) {
	    for (let [uniqueName, window] of windowsMap.entries()) {
	        if (callback(uniqueName, window)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;
	function isAnyWindowVisible() {
	    let isAnyWindowVisible = false;
	    forEach((uniqueName, window) => {
	        if (window.isVisible) {
	            isAnyWindowVisible = true;
	            return true;
	        }
	    });
	    return isAnyWindowVisible;
	}
	exports.isAnyWindowVisible = isAnyWindowVisible;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const vector2_1 = __webpack_require__(5);
	function mod(number, mod) {
	    return ((number % mod) + mod) % mod;
	}
	exports.mod = mod;
	;
	function rotateMatrix(matrix, direction) {
	    direction = mod(direction, 360) || 0;
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
	let cursorPosition = new vector2_1.Vector2(0, 0);
	$(window).on("mousemove", (event) => {
	    cursorPosition.x = event.pageX;
	    cursorPosition.y = event.pageY;
	});
	function getCursorPosition() {
	    return cursorPosition;
	}
	exports.getCursorPosition = getCursorPosition;
	;
	let isCtrlPressedBool = false;
	$(window).on("keydown", (event) => {
	    if (event.which == 17) {
	        isCtrlPressedBool = true;
	    }
	});
	$(window).on("keyup", (event) => {
	    if (event.which == 17) {
	        isCtrlPressedBool = false;
	    }
	});
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
	function spanClass(className, html) {
	    return `<span class="` + className + `">` + html + `</span>`;
	}
	exports.spanClass = spanClass;
	function spanColor(color, html) {
	    return `<span style="color: ` + color + `;">` + html + `</span>`;
	}
	exports.spanColor = spanColor;
	function percentage(amount) {
	    return this.spanClass(amount >= 0 ? "label-percentage-positive" : "label-percentage-negative", Math.abs(amount) + `%`);
	}
	exports.percentage = percentage;
	function health(html = `health`) {
	    return this.spanClass("label-health", html);
	}
	exports.health = health;
	function hunger(html = `hunger`) {
	    return this.spanClass("label-hunger", html);
	}
	exports.hunger = hunger;
	function thirst(html = `thirst`) {
	    return this.spanClass("label-thirst", html);
	}
	exports.thirst = thirst;
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
	        super.updateHTML();
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
	                    itemDrag_1.ItemDrag.slotModifications.set(slot, slot.state);
	                }
	            }
	        }
	    }
	    addItem(item, position) {
	        if (!this.hasItem(item)) {
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
	    }
	    removeItem(item) {
	        if (this.hasItem(item)) {
	            this.unsetSlotsItem(item);
	            item.inventoryWindow = undefined;
	            item.inventoryPosition = undefined;
	            item.state = "invalid";
	            item.html.detach().appendTo("body > .items");
	            delete this.items[item.id];
	        }
	    }
	    hasItem(item) {
	        return this.items.indexOf(item) === -1 ? false : true;
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
	let localInventoryWindow = null;
	function setLocalInventoryWindow(inventoryWindow) {
	    localInventoryWindow = inventoryWindow;
	}
	exports.setLocalInventoryWindow = setLocalInventoryWindow;
	function getLocalInventoryWindow() {
	    return localInventoryWindow;
	}
	exports.getLocalInventoryWindow = getLocalInventoryWindow;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ItemSelection = __webpack_require__(9);
	const Util = __webpack_require__(4);
	const itemDrag_1 = __webpack_require__(10);
	const vector2_1 = __webpack_require__(5);
	const itemsHTML = $("body > .items");
	const itemsMap = new Map();
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
	                case 37:
	                    itemDrag.item.rotateClockwise();
	                    break;
	                case 38:
	                    itemDrag.item.flip();
	                    break;
	                case 39:
	                    itemDrag.item.rotateCounterClockwise();
	                    break;
	                case 40:
	                    itemDrag.item.flip();
	                    break;
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
	function startDragging(item, position) {
	    if (!item.isSelected) {
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
	function get(id) {
	    return itemsMap.get(id);
	}
	exports.get = get;
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
	const WindowManager = __webpack_require__(3);
	const Util = __webpack_require__(4);
	const inventoryWindow_1 = __webpack_require__(7);
	const vector2_1 = __webpack_require__(5);
	exports.selectingItems = new Map();
	exports.selectedItems = new Map();
	$("body").on("mousedown", (event) => {
	    let shouldCreateItemSelection = true;
	    let targetHTML = $(event.target);
	    removeHTML();
	    if (!Util.isCtrlPressed()) {
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
	    if (targetHTML.closest(".ui-draggable-handle").length > 0) {
	        shouldCreateItemSelection = false;
	    }
	    let isAnyInventoryWindowOpen = false;
	    WindowManager.forEach((uniqueName, window) => {
	        if (window.isVisible && window instanceof inventoryWindow_1.InventoryWindow) {
	            isAnyInventoryWindowOpen = true;
	            return true;
	        }
	    });
	    if (!isAnyInventoryWindowOpen) {
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
	class InventorySlot {
	    static getPixelSize() {
	        return $(window).width() * 0.02 + 1;
	    }
	    set state(value) {
	        this.html.removeClass("state-" + this._state);
	        this.html.addClass("state-" + value);
	        this._state = value;
	    }
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
	            this.updateHTML();
	        }
	        else {
	            this.html.hide();
	        }
	        jcmp.CallEvent("jc3mp-inventory/ui/windowVisibilityChanged", this.uniqueName, this.isVisible);
	    }
	    get isVisible() {
	        return this._isVisible;
	    }
	    constructor(titleHTML) {
	        this.createHTML();
	        this.uniqueName = null;
	        this.titleHTML.html(titleHTML);
	        this.html.hide();
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
	            this.html.on("mousedown", (event) => {
	                this.moveToFront();
	            });
	            this.html.find(".close").on("click", (event) => {
	                this.hide();
	            });
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
	    updateHTML() {
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
/***/ function(module, exports) {

	"use strict";
	$(document).tooltip({
	    track: true,
	    items: ".slot, .item",
	    hide: false,
	    show: false,
	    content: function () {
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const windowManager = __webpack_require__(3);
	const itemManager = __webpack_require__(8);
	const itemTypeManager = __webpack_require__(2);
	const inventoryWindow_1 = __webpack_require__(7);
	const vector2_1 = __webpack_require__(5);
	jcmp.AddEvent("jc3mp-inventory/ui/sendInventory", (inventoryData) => {
	    inventoryData = JSON.parse(inventoryData);
	    let inventoryWindow = windowManager.get(inventoryData.uniqueName);
	    if (inventoryWindow === undefined) {
	        inventoryWindow = new inventoryWindow_1.InventoryWindow(inventoryData.uniqueName, new vector2_1.Vector2(inventoryData.size.x, inventoryData.size.y));
	        windowManager.add(inventoryData.uniqueName, inventoryWindow);
	    }
	    if (inventoryData.isLocal) {
	        inventoryWindow_1.setLocalInventoryWindow(inventoryWindow);
	    }
	});
	jcmp.AddEvent("jc3mp-inventory/ui/sendItems", (itemsData) => {
	    itemsData = JSON.parse(itemsData);
	    itemsData.forEach((itemData, itemDataIndex) => {
	        let item = itemManager.get(itemData.id);
	        if (item === undefined) {
	            const constructors = itemTypeManager.get(itemData.type);
	            const constructor = constructors !== undefined ? constructors[0] : undefined;
	            if (constructor === undefined) {
	                console.log(`[jc3mp-inventory] Error: Item type (${itemData.type}) does not have a constructor in the item type manager`);
	            }
	            else {
	                item = constructor();
	                item.rotation = itemData.rotation;
	                item.isFlipped = itemData.isFlipped;
	                itemManager.add(item.id, item);
	                if (itemData.inventoryUniqueName !== undefined) {
	                    const inventoryWindow = windowManager.get(itemData.inventoryUniqueName);
	                    if (inventoryWindow !== undefined) {
	                        console.log(inventoryWindow);
	                        inventoryWindow.removeItem(item);
	                        inventoryWindow.addItem(item, new vector2_1.Vector2(itemData.inventoryPosition.x, itemData.inventoryPosition.y));
	                    }
	                }
	            }
	        }
	    });
	});


/***/ },
/* 15 */
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
	        this.itemCloners = [];
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
	                let itemCloner = new ItemCloner(constructor);
	                this.itemCloners.push(itemCloner);
	                this.itemsHTML.append(itemCloner.html);
	            });
	        });
	        return this.contentHTML;
	    }
	    updateHTML() {
	        super.updateHTML();
	        let highestWidth = 64;
	        this.itemCloners.forEach((itemCloner, itemClonerIndex) => {
	            let itemClonerWidth = itemCloner.html.width();
	            if (itemClonerWidth > highestWidth) {
	                highestWidth = itemClonerWidth;
	            }
	        });
	        this.itemsHTML.css("width", highestWidth + "px");
	    }
	}
	exports.AdminWindow = AdminWindow;


/***/ }
/******/ ]);