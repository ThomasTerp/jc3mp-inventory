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
	Object.defineProperty(exports, "__esModule", { value: true });
	__webpack_require__(1);
	__webpack_require__(9);
	__webpack_require__(3);
	__webpack_require__(10);
	jcmp.localPlayer.wingsuit.boostEnabled = true;
	jcmp.localPlayer.wingsuit.boostCooldown = 7;
	jcmp.localPlayer.wingsuit.boostDuration = 999999999;
	jcmp.localPlayer.wingsuit.boostPower = 999999999;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vector2Grid_1 = __webpack_require__(2);
	const network = __webpack_require__(3);
	const itemManager = __webpack_require__(8);
	const inventoryManager = __webpack_require__(5);
	exports.ui = new WebUIWindow("jc3mp-inventory-ui", "package://jc3mp-inventory/ui/index.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
	exports.ui.autoResize = true;
	function inventoriesAndItemsData(data) {
	    jcmp.ui.CallEvent("jc3mp-inventory/ui/inventoriesAndItemsData", JSON.stringify(data));
	}
	exports.inventoriesAndItemsData = inventoriesAndItemsData;
	jcmp.ui.AddEvent("jc3mp-inventory/client/itemOperation", (itemOperationData) => {
	    itemOperationData = JSON.parse(itemOperationData);
	    switch (itemOperationData.itemOperationType) {
	        case "move":
	            (() => {
	                const item = itemManager.getByID(itemOperationData.id);
	                if (item != undefined) {
	                    const oldInventory = item.inventory;
	                    const newInventory = inventoryManager.get(itemOperationData.inventoryUniqueName);
	                    if (oldInventory != undefined) {
	                        oldInventory.removeItem(item);
	                    }
	                    item.rotation = itemOperationData.rotation;
	                    item.isFlipped = itemOperationData.isFlipped;
	                    item.updateSlots();
	                    newInventory.addItem(item, new vector2Grid_1.Vector2Grid(itemOperationData.inventoryPosition.cols, itemOperationData.inventoryPosition.rows));
	                }
	            })();
	            break;
	        case "drop":
	            (() => {
	                const item = itemManager.getByID(itemOperationData.id);
	                if (item != undefined) {
	                    const oldInventory = item.inventory;
	                    if (oldInventory != undefined) {
	                        oldInventory.removeItem(item);
	                    }
	                }
	            })();
	            break;
	    }
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/itemCreate", (itemData) => {
	    network.itemCreate(JSON.parse(itemData));
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/itemUse", (itemID) => {
	    const item = itemManager.getByID(itemID);
	    if (item.canUse()) {
	        item.callRemoteUse();
	    }
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/itemDestroy", (itemID) => {
	    const item = itemManager.getByID(itemID);
	    if (item.canDestroy()) {
	        item.callRemoteUse();
	    }
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/itemOperations", (itemOperationsData) => {
	    network.itemOperations(JSON.parse(itemOperationsData));
	});
	jcmp.ui.AddEvent("jc3mp-inventory/client/uiReady", () => {
	    network.sendUIReady();
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class Vector2Grid {
	    constructor(cols = 0, rows = 0) {
	        this.cols = cols;
	        this.rows = rows;
	    }
	}
	exports.Vector2Grid = Vector2Grid;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventory_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(2);
	const inventoryManager = __webpack_require__(5);
	const itemFactoryManager = __webpack_require__(6);
	const localInventoryWindow = __webpack_require__(7);
	const itemManager = __webpack_require__(8);
	const ui = __webpack_require__(1);
	function itemOperations(itemOperationsData) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemOperations", JSON.stringify(itemOperationsData));
	}
	exports.itemOperations = itemOperations;
	function itemCreate(itemData) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemCreate", JSON.stringify(itemData));
	}
	exports.itemCreate = itemCreate;
	function itemUse(item) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemUse", item.id);
	}
	exports.itemUse = itemUse;
	function itemDestroy(item) {
	    jcmp.events.CallRemote("jc3mp-inventory/network/itemDestroy", item.id);
	}
	exports.itemDestroy = itemDestroy;
	function sendUIReady() {
	    jcmp.events.CallRemote("jc3mp-inventory/network/uiReady");
	}
	exports.sendUIReady = sendUIReady;
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/inventoriesAndItemsData", (inventoryAndItemsData) => {
	    inventoryAndItemsData = JSON.parse(inventoryAndItemsData);
	    if (inventoryAndItemsData.inventories != undefined) {
	        inventoryAndItemsData.inventories.forEach((inventoryData, inventoryDataIndex) => {
	            let inventory = inventoryManager.get(inventoryData.uniqueName);
	            if (inventory == undefined) {
	                inventory = new inventory_1.Inventory(inventoryData.name, new vector2Grid_1.Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
	                inventoryManager.add(inventoryData.uniqueName, inventory);
	            }
	            else {
	                inventory.name = inventoryData.name;
	            }
	            if (inventoryData.isLocal) {
	                localInventoryWindow.set(inventory);
	            }
	        });
	    }
	    if (inventoryAndItemsData.items != undefined) {
	        inventoryAndItemsData.items.forEach((itemData, itemDataIndex) => {
	            const item = itemManager.getByID(itemData.id);
	            if (item != undefined && item.inventory != undefined) {
	                item.inventory.removeItem(item);
	            }
	        });
	        inventoryAndItemsData.items.forEach((itemData, itemDataIndex) => {
	            let item = itemManager.getByID(itemData.id);
	            if (item == undefined) {
	                const itemFactory = itemFactoryManager.get(itemData.type, "default");
	                if (itemFactory == undefined) {
	                    jcmp.print(`[jc3mp-inventory] Error: Item class (${itemData.type}) does not have a default factory in the item factory manager`);
	                    return;
	                }
	                else {
	                    item = itemFactory.assemble();
	                    item.id = itemData.id;
	                    itemData.padding = item.padding;
	                    itemData.canUse = item.canUse();
	                    itemData.canDestroy = item.canDestroy();
	                    itemData.category = item.category;
	                    itemData.useText = item.useText;
	                    itemData.destroyOnUse = item.destroyOnUse;
	                    itemData.name = item.name;
	                    itemData.description = item.description;
	                    itemData.src = item.src;
	                    itemData.tooltip = item.tooltip;
	                    itemData.defaultSlots = item.defaultSlots;
	                    itemManager.add(item);
	                }
	            }
	            item.rotation = itemData.rotation;
	            item.isFlipped = itemData.isFlipped;
	            item.updateSlots();
	            if (itemData.inventoryUniqueName != undefined) {
	                const inventory = inventoryManager.get(itemData.inventoryUniqueName);
	                if (inventory != undefined) {
	                    inventory.addItem(item, new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows));
	                }
	            }
	        });
	    }
	    ui.inventoriesAndItemsData(inventoryAndItemsData);
	});
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemUse", (itemID) => {
	    const item = itemManager.getByID(itemID);
	    if (item != undefined) {
	        item.use();
	        if (item.destroyOnUse) {
	            if (item.inventory != undefined) {
	                item.inventory.removeItem(item);
	            }
	            itemManager.remove(item);
	            item.destroy();
	        }
	    }
	});
	jcmp.events.AddRemoteCallable("jc3mp-inventory/network/itemDestroy", (itemID) => {
	    const item = itemManager.getByID(itemID);
	    if (item != undefined) {
	        if (item.inventory != undefined) {
	            item.inventory.removeItem(item);
	        }
	        itemManager.remove(item);
	        item.destroy();
	    }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vector2Grid_1 = __webpack_require__(2);
	class Inventory {
	    constructor(name, size) {
	        this.name = name;
	        this.items = [];
	        this.size = size;
	        this.slots = [];
	        this.createSlots();
	    }
	    createSlots() {
	        for (let rows = 0; rows < this.size.rows; rows++) {
	            this.slots[rows] = [];
	            for (let cols = 0; cols < this.size.cols; cols++) {
	                this.slots[rows][cols] = new InventorySlot(this, new vector2Grid_1.Vector2Grid(cols, rows));
	            }
	        }
	    }
	    getSlot(position) {
	        return this.slots[position.rows][position.cols];
	    }
	    setSlotsItem(item) {
	        for (let rows = 0; rows < item.slots.length; rows++) {
	            for (let cols = 0; cols < item.slots[rows].length; cols++) {
	                let isSolid = item.slots[rows][cols] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
	                    slot.item = item;
	                }
	            }
	        }
	    }
	    unsetSlotsItem(item) {
	        for (let rows = 0; rows < item.slots.length; rows++) {
	            for (let cols = 0; cols < item.slots[rows].length; cols++) {
	                let isSolid = item.slots[rows][cols] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
	                    slot.item = undefined;
	                }
	            }
	        }
	    }
	    addItem(item, position) {
	        if (!this.hasItem(item)) {
	            this.items.push(item);
	            item.inventory = this;
	            item.inventoryPosition = position;
	            this.setSlotsItem(item);
	        }
	    }
	    removeItem(item) {
	        if (this.hasItem(item)) {
	            this.unsetSlotsItem(item);
	            item.inventory = undefined;
	            item.inventoryPosition = undefined;
	            this.items.splice(this.items.indexOf(item), 1);
	        }
	    }
	    hasItem(item) {
	        return this.items.indexOf(item) === -1 ? false : true;
	    }
	    isItemWithinInventory(item, position) {
	        let itemSize = item.getSize();
	        return position.cols + itemSize.cols <= this.size.cols && position.rows + itemSize.rows <= this.size.rows;
	    }
	    canItemBePlaced(item, position) {
	        let itemSize = item.getSize();
	        for (let rows = 0; rows < itemSize.rows; rows++) {
	            for (let cols = 0; cols < itemSize.cols; cols++) {
	                let isSolid = item.slots[rows][cols] === 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2Grid_1.Vector2Grid(position.cols + cols, position.rows + rows));
	                    if (slot.item != undefined) {
	                        return false;
	                    }
	                }
	            }
	        }
	        return true;
	    }
	    hasAccess(player) {
	        return true;
	    }
	}
	exports.Inventory = Inventory;
	class InventorySlot {
	    constructor(inventoryWindow, position) {
	        this.inventory = inventoryWindow;
	        this.position = position;
	    }
	}
	exports.InventorySlot = InventorySlot;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventoriesMap = new Map();
	function add(uniqueName, inventory) {
	    remove(uniqueName);
	    inventory.uniqueName = uniqueName;
	    inventoriesMap.set(uniqueName, inventory);
	    return inventory;
	}
	exports.add = add;
	function remove(uniqueName) {
	    let inventory = get(uniqueName);
	    if (inventory) {
	        inventory.uniqueName = undefined;
	        inventoriesMap.delete(uniqueName);
	    }
	}
	exports.remove = remove;
	function get(uniqueName) {
	    return inventoriesMap.get(uniqueName);
	}
	exports.get = get;
	function forEach(callback) {
	    for (let [uniqueName, inventory] of inventoriesMap.entries()) {
	        if (callback(uniqueName, inventory)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const itemFactoriesMap = new Map();
	function add(itemName, factoryName, itemFactory) {
	    remove(itemName, factoryName);
	    if (itemFactoriesMap.get(itemName) == undefined) {
	        itemFactoriesMap.set(itemName, new Map());
	    }
	    itemFactoriesMap.get(itemName).set(factoryName, itemFactory);
	    return itemFactory;
	}
	exports.add = add;
	function remove(itemName, factoryName) {
	    if (itemFactoriesMap.get(itemName) != undefined) {
	        itemFactoriesMap.get(itemName).delete(factoryName);
	        if (itemFactoriesMap.get(itemName).size === 0) {
	            itemFactoriesMap.delete(itemName);
	        }
	    }
	}
	exports.remove = remove;
	function get(itemName, factoryName) {
	    if (itemFactoriesMap.get(itemName) != undefined) {
	        return itemFactoriesMap.get(itemName).get(factoryName);
	    }
	}
	exports.get = get;
	function forEach(callback) {
	    for (let [itemName, itemFactories] of itemFactoriesMap.entries()) {
	        if (callback(itemName, itemFactories)) {
	            break;
	        }
	    }
	}
	exports.forEach = forEach;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	let localInventoryWindow;
	function set(inventoryWindow) {
	    localInventoryWindow = inventoryWindow;
	}
	exports.set = set;
	function get() {
	    return localInventoryWindow;
	}
	exports.get = get;
	function exists() {
	    return localInventoryWindow != undefined;
	}
	exports.exists = exists;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const items = [];
	const itemsMap = new Map();
	function add(item) {
	    remove(item);
	    if (item.id != undefined) {
	        itemsMap.set(item.id, item);
	    }
	    items.push(item);
	    return item;
	}
	exports.add = add;
	function remove(item) {
	    if (exists(item)) {
	        if (item.id != undefined) {
	            itemsMap.delete(item.id);
	        }
	        delete items[getItemIndex(item)];
	    }
	}
	exports.remove = remove;
	function getByID(id) {
	    return itemsMap.get(id);
	}
	exports.getByID = getByID;
	function getByItemIndex(itemIndex) {
	    return items[itemIndex];
	}
	exports.getByItemIndex = getByItemIndex;
	function getItemIndex(item) {
	    return items.indexOf(item);
	}
	exports.getItemIndex = getItemIndex;
	function exists(item) {
	    if (getByID(item.id) != undefined) {
	        return true;
	    }
	    if (getItemIndex(item) !== -1) {
	        return true;
	    }
	    return false;
	}
	exports.exists = exists;
	function forEach(callback) {
	    for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
	        const item = items[itemIndex];
	        if (item != undefined && callback(itemIndex, item)) {
	            break;
	        }
	    }
	    ;
	}
	exports.forEach = forEach;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	jcmp.ui.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	    jcmp.localPlayer.controlsEnabled = !isVisible;
	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(11));
	__export(__webpack_require__(13));
	__export(__webpack_require__(26));
	__export(__webpack_require__(32));
	__export(__webpack_require__(37));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vector2Grid_1 = __webpack_require__(2);
	const network = __webpack_require__(3);
	const util = __webpack_require__(12);
	class Item {
	    set defaultSlots(value) {
	        this._defaultSlots = value;
	        this.slots = this.getDefaultSlotsClone();
	    }
	    get defaultSlots() {
	        return this._defaultSlots;
	    }
	    constructor() {
	        this.rotation = 0;
	        this.isFlipped = false;
	        this.padding = 2;
	        this.category = "Misc";
	        this.useText = "Use";
	        this.destroyOnUse = true;
	        this.name = "Item";
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
	    canUse() {
	        return true;
	    }
	    callRemoteUse() {
	        network.itemUse(this);
	    }
	    use() {
	    }
	    canDestroy() {
	        return true;
	    }
	    destroy() {
	    }
	    callRemoteDestroy() {
	        network.itemDestroy(this);
	    }
	    getDefaultSlotsClone() {
	        return util.cloneObject(this.defaultSlots);
	    }
	    getDefaultSize() {
	        return new vector2Grid_1.Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
	    }
	    getSize() {
	        return new vector2Grid_1.Vector2Grid(this.slots[0].length, this.slots.length);
	    }
	    updateSlots() {
	        this.slots = this.getDefaultSlotsClone();
	        if (this.isFlipped) {
	            for (let rows = 0; rows < this.getDefaultSize().rows; rows++) {
	                this.slots[rows].reverse();
	            }
	        }
	        this.slots = util.rotateMatrix(this.slots, this.rotation);
	    }
	}
	exports.Item = Item;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(14));
	__export(__webpack_require__(16));
	__export(__webpack_require__(18));
	__export(__webpack_require__(19));
	__export(__webpack_require__(20));
	__export(__webpack_require__(21));
	__export(__webpack_require__(22));
	__export(__webpack_require__(23));
	__export(__webpack_require__(24));
	__export(__webpack_require__(25));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const labels = __webpack_require__(15);
	class FoodItem extends item_1.Item {
	    constructor() {
	        super();
	        this.health = 0;
	        this.hunger = 0;
	        this.thirst = 0;
	        this.category = "Food";
	        this.useText = "Consume";
	        this.updateDescription();
	    }
	    updateDescription() {
	        let description = ``;
	        if (this.health !== 0) {
	            description += `Restore ` + labels.health() + ` by ` + labels.percentage(this.health);
	        }
	        if (this.hunger !== 0) {
	            description += (this.hunger > 0 ? `Decrease` : `Increase`) + ` ` + labels.hunger() + ` by ` + labels.percentage(this.hunger) + `<br />`;
	        }
	        if (this.thirst !== 0) {
	            description += (this.thirst > 0 ? `Decrease` : `Increase`) + ` ` + labels.thirst() + ` by ` + labels.percentage(this.thirst) + `<br />`;
	        }
	        this.description = description;
	    }
	}
	exports.FoodItem = FoodItem;


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class AppleItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(AppleItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new AppleItem();
	}));


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class ItemFactory {
	    constructor(assemble) {
	        this.assemble = assemble;
	    }
	}
	exports.ItemFactory = ItemFactory;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class RavelloBeansItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(RavelloBeansItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new RavelloBeansItem();
	}));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class LaisChipsItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(LaisChipsItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new LaisChipsItem();
	}));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class SnikersItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(SnikersItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new SnikersItem();
	}));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class MilkGallonItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(MilkGallonItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new MilkGallonItem();
	}));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class WaterBottleItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(WaterBottleItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new WaterBottleItem();
	}));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class FirstAidKitItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(FirstAidKitItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new FirstAidKitItem();
	}));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class BandageItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(BandageItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new BandageItem();
	}));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const foodItem_1 = __webpack_require__(14);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class PillsItem extends foodItem_1.FoodItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(PillsItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new PillsItem();
	}));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(27));
	__export(__webpack_require__(28));
	__export(__webpack_require__(29));
	__export(__webpack_require__(30));
	__export(__webpack_require__(31));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const inventory_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(2);
	const itemFactoryManager = __webpack_require__(6);
	const inventoryManager = __webpack_require__(5);
	class BackpackItem extends item_1.Item {
	    constructor() {
	        super();
	        this.backpackInventory = new inventory_1.Inventory("Backpack", new vector2Grid_1.Vector2Grid(4, 6));
	        inventoryManager.add("backpack" + this.id, this.backpackInventory);
	        this.useText = "Equip";
	        this.destroyOnUse = false;
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
	        this.description = `Size: ` + this.backpackInventory.size.cols + `x` + this.backpackInventory.size.rows;
	    }
	}
	exports.BackpackItem = BackpackItem;
	itemFactoryManager.add(BackpackItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new BackpackItem();
	}));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class BavariumWingsuitItem extends item_1.Item {
	    constructor() {
	        super();
	        this.useText = "Equip";
	        this.destroyOnUse = false;
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
	itemFactoryManager.add(BavariumWingsuitItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new BavariumWingsuitItem();
	}));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class GasCanItem extends item_1.Item {
	    constructor() {
	        super();
	        this.destroyOnUse = false;
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
	itemFactoryManager.add(GasCanItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new GasCanItem();
	}));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class GrapplingHookItem extends item_1.Item {
	    constructor() {
	        super();
	        this.useText = "Equip";
	        this.destroyOnUse = false;
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
	itemFactoryManager.add(GrapplingHookItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new GrapplingHookItem();
	}));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class MapItem extends item_1.Item {
	    constructor() {
	        super();
	        this.useText = "Examine";
	        this.destroyOnUse = false;
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
	itemFactoryManager.add(MapItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new MapItem();
	}));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(33));
	__export(__webpack_require__(34));
	__export(__webpack_require__(35));
	__export(__webpack_require__(36));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const labels = __webpack_require__(15);
	class VehicleRepairItem extends item_1.Item {
	    constructor() {
	        super();
	        this.repairAmount = 100;
	        this.category = "Vehicles";
	        this.updateDescription();
	    }
	    updateDescription() {
	        let description = "";
	        if (this.repairAmount !== 0) {
	            description = labels.repair(`Repair`) + ` a vehicle by ` + labels.percentage(this.repairAmount);
	        }
	        this.description = description;
	    }
	}
	exports.VehicleRepairItem = VehicleRepairItem;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vehicleRepairItem_1 = __webpack_require__(33);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class SmallWrenchItem extends vehicleRepairItem_1.VehicleRepairItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(SmallWrenchItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new SmallWrenchItem();
	}));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vehicleRepairItem_1 = __webpack_require__(33);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class BigWrenchItem extends vehicleRepairItem_1.VehicleRepairItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(BigWrenchItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new BigWrenchItem();
	}));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vehicleRepairItem_1 = __webpack_require__(33);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class ToolboxItem extends vehicleRepairItem_1.VehicleRepairItem {
	    constructor() {
	        super();
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
	itemFactoryManager.add(ToolboxItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new ToolboxItem();
	}));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(38));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const item_1 = __webpack_require__(11);
	const itemFactory_1 = __webpack_require__(17);
	const itemFactoryManager = __webpack_require__(6);
	class U39PlechovkaItem extends item_1.Item {
	    constructor() {
	        super();
	        this.category = "Weapons";
	        this.useText = "Equip";
	        this.destroyOnUse = false;
	        this.name = "U-39 Plechovka";
	        this.src = "images/u39_plechovka.png";
	        this.defaultSlots = [
	            [1, 1, 1, 1, 1, 1],
	            [1, 1, 1, 1, 0, 0],
	        ];
	    }
	}
	exports.U39PlechovkaItem = U39PlechovkaItem;
	itemFactoryManager.add(U39PlechovkaItem.name, "default", new itemFactory_1.ItemFactory(() => {
	    return new U39PlechovkaItem();
	}));


/***/ }
/******/ ]);