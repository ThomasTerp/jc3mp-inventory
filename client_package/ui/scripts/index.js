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
	__webpack_require__(8);
	__webpack_require__(14);
	if (typeof jcmp != "undefined") {
	    jcmp.CallEvent("jc3mp-inventory/client/uiReady");
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventoryWindow_1 = __webpack_require__(2);
	const vector2_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(5);
	const itemManager = __webpack_require__(7);
	const client = __webpack_require__(10);
	const util = __webpack_require__(6);
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
	        itemManager.forEach((itemIndex, item) => {
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
	        let cursorPosition = util.getCursorPosition();
	        return new vector2_1.Vector2(cursorPosition.x + this.offset.x, cursorPosition.y + this.offset.y);
	    }
	    getCursorOffset() {
	        let position = this.getPosition();
	        let cursorPosition = util.getCursorPosition();
	        return new vector2_1.Vector2(cursorPosition.x - position.x, cursorPosition.y - position.y);
	    }
	    getSlot(position) {
	        let elementFromPointOffset = inventoryWindow_1.InventorySlot.getPixelSize() * 0.5;
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
	            for (let rows = 0; rows < itemSize.rows; rows++) {
	                for (let cols = 0; cols < itemSize.cols; cols++) {
	                    let isSolid = this.item.slots[rows][cols] == 1;
	                    if (isSolid) {
	                        let slot2 = slot.inventoryWindow.getSlot(new vector2Grid_1.Vector2Grid(slot.position.cols + cols, slot.position.rows + rows));
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
	        if (this.item.id != undefined) {
	            client.addPreItemOperation(itemManager.getItemIndex(this.item), {
	                rotation: this.item.rotation,
	                isFlipped: this.item.isFlipped,
	                inventoryWindow: this.item.inventoryWindow,
	                inventoryPosition: this.item.inventoryPosition
	            });
	        }
	        this.item.html.css("pointer-events", "none");
	        if (this.item.inventoryWindow) {
	            this.item.inventoryWindow.removeItem(this.item);
	        }
	    }
	}
	ItemDrag.slotModifications = new Map();
	exports.ItemDrag = ItemDrag;
	$(document.body).on("mousemove", (event) => {
	    ItemDrag.undoSlotModifications();
	    ItemDrag.forEachInItemManager((itemDrag) => {
	        if (util.isCtrlPressed() && !itemDrag.hasMoved) {
	            delete itemDrag.item.itemDrag;
	            return;
	        }
	        itemDrag.update();
	    });
	});
	$(document.body).on("mouseup", (event) => {
	    ItemDrag.forEachInItemManager((itemDrag) => {
	        if (itemDrag.hasMoved) {
	            itemDrag.update();
	            ItemDrag.undoSlotModifications();
	            const slot = itemDrag.getSlot(itemDrag.getPosition());
	            const itemIndex = itemManager.getItemIndex(itemDrag.item);
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
	                client.addItemOperation(itemIndex, "drop");
	            }
	            else {
	                slot.inventoryWindow.addItem(itemDrag.item, slot.position);
	                client.addItemOperation(itemIndex, "move");
	            }
	            itemDrag.item.state = "selected";
	        }
	        if (itemDrag.onDropped != undefined) {
	            itemDrag.onDropped();
	        }
	        delete itemDrag.item.itemDrag;
	    });
	});
	$(document.body).on("mousedown", ".item", (event) => {
	    const item = $(event.currentTarget).data("item");
	    if (item != undefined && itemManager.exists(item) && !util.isCtrlPressed()) {
	        itemManager.startDragging(item, new vector2_1.Vector2(event.pageX, event.pageY));
	        event.preventDefault();
	    }
	});
	$(document.body).on("keydown", (event) => {
	    ItemDrag.undoSlotModifications();
	    ItemDrag.forEachInItemManager((itemDrag) => {
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
	    itemManager.forEach((id, item) => {
	        item.updateHTML();
	    });
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const window_1 = __webpack_require__(3);
	const vector2_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(5);
	const util = __webpack_require__(6);
	const itemManager = __webpack_require__(7);
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
	        for (let rows = 0; rows < this.size.rows; rows++) {
	            let rowHTML = $('<div class="row"></div>');
	            this.slots[rows] = [];
	            for (let cols = 0; cols < this.size.cols; cols++) {
	                this.slots[rows][cols] = new InventorySlot(this, new vector2Grid_1.Vector2Grid(cols, rows));
	                rowHTML.append(this.slots[rows][cols].html);
	            }
	            this.slotsHTML.append(rowHTML);
	        }
	        this.slotsHTML.on("mousedown", ".slot", (event) => {
	            if (!util.isCtrlPressed()) {
	                const slot = $(event.currentTarget).data("slot");
	                if (slot != undefined && slot.item != undefined) {
	                    itemManager.startDragging(slot.item, new vector2_1.Vector2(event.pageX, event.pageY));
	                    event.preventDefault();
	                }
	            }
	        });
	        this.slotsHTML.on("contextmenu", ".slot", (event) => {
	            const slot = $(event.currentTarget).data("slot");
	            if (slot != undefined && slot.item != undefined) {
	                slot.item.openContextMenu(new vector2_1.Vector2(event.pageX, event.pageY));
	                event.preventDefault();
	            }
	        });
	        return this.contentHTML;
	    }
	    updateHTML() {
	        super.updateHTML();
	        let slotSize = InventorySlot.getPixelSize();
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
	        return this.slots[position.rows][position.cols];
	    }
	    setSlotsItem(item) {
	        for (let rows = 0; rows < item.slots.length; rows++) {
	            for (let cols = 0; cols < item.slots[rows].length; cols++) {
	                let isSolid = item.slots[rows][cols] == 1;
	                if (isSolid) {
	                    let slot = this.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
	                    slot.state = "item";
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
	                    slot.state = "empty";
	                    slot.item = undefined;
	                }
	            }
	        }
	    }
	    addItem(item, position) {
	        if (item.inventoryWindow != undefined) {
	            item.inventoryWindow.removeItem(item);
	        }
	        this.items.push(item);
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
	        if (this.hasItem(item)) {
	            this.unsetSlotsItem(item);
	            item.inventoryWindow = undefined;
	            item.inventoryPosition = undefined;
	            item.state = "invalid";
	            item.html.detach().appendTo("body > .items");
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
	    onResize() {
	        super.onResize();
	        this.updateHTML();
	    }
	}
	exports.InventoryWindow = InventoryWindow;
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
/* 3 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class Window {
	    set uniqueName(value) {
	        this._uniqueName = value;
	        if (value != undefined) {
	            this.html.attr("id", "window-" + this.uniqueName);
	        }
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
	        if (typeof jcmp != "undefined") {
	            jcmp.CallEvent("jc3mp-inventory/ui/windowVisibilityChanged", this.uniqueName, this.isVisible);
	        }
	    }
	    get isVisible() {
	        return this._isVisible;
	    }
	    constructor(titleHTML) {
	        this.createHTML();
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
/* 4 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class Vector2 {
	    constructor(x = 0, y = 0) {
	        this.x = x;
	        this.y = y;
	    }
	}
	exports.Vector2 = Vector2;


/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const vector2_1 = __webpack_require__(4);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const itemDrag_1 = __webpack_require__(1);
	const vector2_1 = __webpack_require__(4);
	const itemSelection = __webpack_require__(8);
	const itemsHTML = $("body > .items");
	const items = [];
	const itemsMap = new Map();
	function startDragging(item, position) {
	    if (!item.isSelected) {
	        itemSelection.clearSelection();
	        itemSelection.setSelectedHTML(item, true);
	        itemSelection.selectedItems.set(item, true);
	    }
	    itemSelection.selectedItems.forEach((isSelected, item) => {
	        if (isSelected) {
	            let offset = item.html.offset();
	            item.itemDrag = new itemDrag_1.ItemDrag(item, new vector2_1.Vector2(offset.left - position.x, offset.top - position.y));
	        }
	    });
	}
	exports.startDragging = startDragging;
	function add(item) {
	    remove(item);
	    if (item.id != undefined) {
	        itemsMap.set(item.id, item);
	    }
	    items.push(item);
	    item.html.appendTo(itemsHTML);
	    return item;
	}
	exports.add = add;
	function remove(item) {
	    if (exists(item)) {
	        item.html.detach();
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
	$(document.body).on("contextmenu", (event) => {
	    const item = $(event.target).data("item");
	    if (item != undefined) {
	        item.openContextMenu(new vector2_1.Vector2(event.pageX, event.pageY));
	        event.preventDefault();
	    }
	});


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventoryWindow_1 = __webpack_require__(2);
	const vector2_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(5);
	const itemManager = __webpack_require__(7);
	const windowManager = __webpack_require__(9);
	const util = __webpack_require__(6);
	exports.selectingItems = new Map();
	exports.selectedItems = new Map();
	$("body").on("mousedown", (event) => {
	    let shouldCreateItemSelection = true;
	    let targetHTML = $(event.target);
	    removeHTML();
	    if (!util.isCtrlPressed()) {
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
	    windowManager.forEach((uniqueName, window) => {
	        if (window.isVisible && window instanceof inventoryWindow_1.InventoryWindow) {
	            isAnyInventoryWindowOpen = true;
	            return true;
	        }
	    });
	    if (!isAnyInventoryWindowOpen) {
	        shouldCreateItemSelection = false;
	    }
	    if (shouldCreateItemSelection) {
	        if (!util.isCtrlPressed()) {
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
	        let cursorPosition = util.getCursorPosition();
	        exports.selectionHTML.css({
	            "top": Math.min(cursorPosition.y, exports.selectionPosition.y),
	            "left": Math.min(cursorPosition.x, exports.selectionPosition.x),
	            "height": Math.abs(cursorPosition.y - exports.selectionPosition.y),
	            "width": Math.abs(cursorPosition.x - exports.selectionPosition.x)
	        });
	        itemManager.forEach((itemIndex, item) => {
	            let isSelected = false;
	            if (item.inventoryWindow) {
	                let itemSize = item.getSize();
	                checkForSlotsInSelection: for (let rows = 0; rows < itemSize.rows; rows++) {
	                    for (let cols = 0; cols < itemSize.cols; cols++) {
	                        let isSolid = item.slots[rows][cols] == 1;
	                        if (isSolid) {
	                            let slot = item.inventoryWindow.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
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
/* 9 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const windowsHTML = $(".windows");
	const windowsMap = new Map();
	$(window).on("resize", (event) => {
	    this.forEach((uniqueName, window) => {
	        window.onResize();
	    });
	});
	function add(uniqueName, window) {
	    remove(uniqueName);
	    window.uniqueName = uniqueName;
	    windowsMap.set(uniqueName, window);
	    window.html.appendTo(windowsHTML);
	    return window;
	}
	exports.add = add;
	function remove(uniqueName) {
	    let window = get(uniqueName);
	    if (window != undefined) {
	        window.uniqueName = undefined;
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventoryWindow_1 = __webpack_require__(2);
	const vector2Grid_1 = __webpack_require__(5);
	const item_1 = __webpack_require__(11);
	const itemManager = __webpack_require__(7);
	const windowManager = __webpack_require__(9);
	const localInventoryWindow = __webpack_require__(13);
	const itemOperationsMap = new Map();
	const preItemOperationsMap = new Map();
	function convertItemToOperation(item, itemOperationType) {
	    let itemOperation = {};
	    switch (itemOperationType) {
	        case "move":
	            itemOperation = {
	                itemOperationType: "move",
	                id: item.id,
	                rotation: item.rotation,
	                isFlipped: item.isFlipped
	            };
	            if (item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined) {
	                itemOperation.inventoryUniqueName = item.inventoryWindow.uniqueName,
	                    itemOperation.inventoryPosition = {
	                        cols: item.inventoryPosition.cols,
	                        rows: item.inventoryPosition.rows
	                    };
	            }
	            break;
	        case "drop":
	            itemOperation = {
	                itemOperationType: "drop",
	                id: item.id
	            };
	            break;
	    }
	    return itemOperation;
	}
	exports.convertItemToOperation = convertItemToOperation;
	function addItemOperation(itemIndex, itemOperationType) {
	    itemOperationsMap.set(itemIndex, itemOperationType);
	    const item = itemManager.getByItemIndex(itemIndex);
	    if (item != undefined && item.id != undefined) {
	        if (typeof jcmp != "undefined") {
	            jcmp.CallEvent("jc3mp-inventory/client/itemOperation", JSON.stringify(convertItemToOperation(item, itemOperationType)));
	        }
	    }
	}
	exports.addItemOperation = addItemOperation;
	function addPreItemOperation(itemIndex, preItemOperation) {
	    preItemOperationsMap.set(itemIndex, preItemOperation);
	}
	exports.addPreItemOperation = addPreItemOperation;
	function clearItemOperations() {
	    itemOperationsMap.clear();
	    preItemOperationsMap.clear();
	}
	exports.clearItemOperations = clearItemOperations;
	function itemOperations() {
	    const itemOperationsData = [];
	    for (let [itemIndex, itemOperationType] of itemOperationsMap.entries()) {
	        const item = itemManager.getByItemIndex(itemIndex);
	        if (item != undefined && item.id != undefined) {
	            itemOperationsData.push(convertItemToOperation(item, itemOperationType));
	        }
	    }
	    if (itemOperationsData.length > 0) {
	        if (typeof jcmp != "undefined") {
	            jcmp.CallEvent("jc3mp-inventory/client/itemOperations", JSON.stringify(itemOperationsData));
	        }
	    }
	    clearItemOperations();
	}
	exports.itemOperations = itemOperations;
	function itemCreate(item) {
	    const itemData = {
	        type: item.constructor.name,
	        rotation: item.rotation,
	        isFlipped: item.isFlipped
	    };
	    if (item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined) {
	        itemData.inventoryUniqueName = item.inventoryWindow.uniqueName,
	            itemData.inventoryPosition = {
	                cols: item.inventoryPosition.cols,
	                rows: item.inventoryPosition.rows
	            };
	    }
	    if (typeof jcmp != "undefined") {
	        jcmp.CallEvent("jc3mp-inventory/client/itemCreate", JSON.stringify(itemData));
	    }
	}
	exports.itemCreate = itemCreate;
	function itemUse(item) {
	    if (typeof jcmp != "undefined" && item.id != undefined) {
	        jcmp.CallEvent("jc3mp-inventory/client/itemUse", item.id);
	    }
	}
	exports.itemUse = itemUse;
	function itemDestroy(item) {
	    if (typeof jcmp != "undefined" && item.id != undefined) {
	        jcmp.CallEvent("jc3mp-inventory/client/itemDestroy", item.id);
	    }
	}
	exports.itemDestroy = itemDestroy;
	if (typeof jcmp != "undefined") {
	    jcmp.AddEvent("jc3mp-inventory/ui/inventoriesAndItemsData", (data) => {
	        data = JSON.parse(data);
	        if (data.inventories != undefined) {
	            data.inventories.forEach((inventoryData, inventoryDataIndex) => {
	                let inventoryWindow = windowManager.get(inventoryData.uniqueName);
	                if (inventoryWindow == undefined) {
	                    inventoryWindow = new inventoryWindow_1.InventoryWindow(inventoryData.name, new vector2Grid_1.Vector2Grid(inventoryData.size.cols, inventoryData.size.rows));
	                    windowManager.add(inventoryData.uniqueName, inventoryWindow);
	                }
	                else {
	                    inventoryWindow.titleHTML = inventoryData.name;
	                }
	                if (inventoryData.isLocal) {
	                    localInventoryWindow.set(inventoryWindow);
	                }
	            });
	        }
	        if (data.items != undefined) {
	            data.items.forEach((itemData, itemDataIndex) => {
	                const item = itemManager.getByID(itemData.id);
	                if (item != undefined && item.inventoryWindow != undefined) {
	                    item.inventoryWindow.removeItem(item);
	                }
	            });
	            data.items.forEach((itemData, itemDataIndex) => {
	                let item = itemManager.getByID(itemData.id);
	                if (item == undefined) {
	                    item = new item_1.Item();
	                    item.type = itemData.type;
	                    item.id = itemData.id;
	                    item.padding = itemData.padding;
	                    item.canUse = itemData.canUse;
	                    item.canDestroy = itemData.canDestroy;
	                    item.category = itemData.category;
	                    item.useText = itemData.useText;
	                    item.destroyOnUse = itemData.destroyOnUse;
	                    item.name = itemData.name;
	                    item.description = itemData.description;
	                    item.src = itemData.src;
	                    item.tooltip = itemData.tooltip;
	                    item.defaultSlots = itemData.defaultSlots;
	                    itemManager.add(item);
	                }
	                item.rotation = itemData.rotation;
	                item.isFlipped = itemData.isFlipped;
	                item.updateSlots();
	                if (itemData.inventoryUniqueName != undefined) {
	                    const inventoryWindow = windowManager.get(itemData.inventoryUniqueName);
	                    if (inventoryWindow != undefined) {
	                        inventoryWindow.addItem(item, new vector2Grid_1.Vector2Grid(itemData.inventoryPosition.cols, itemData.inventoryPosition.rows));
	                    }
	                }
	            });
	        }
	        if (data.inventories != undefined) {
	            data.inventories.forEach((inventoryData, inventoryDataIndex) => {
	                const inventoryWindow = windowManager.get(inventoryData.uniqueName);
	                if (inventoryWindow != undefined) {
	                    inventoryWindow.updateHTML();
	                }
	            });
	        }
	    });
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const inventoryWindow_1 = __webpack_require__(2);
	const vector2_1 = __webpack_require__(4);
	const vector2Grid_1 = __webpack_require__(5);
	const contextMenu_1 = __webpack_require__(12);
	const client = __webpack_require__(10);
	const util = __webpack_require__(6);
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
	    constructor() {
	        this.createHTML();
	        this.isSelected = false;
	        this.state = "none";
	    }
	    destroy() {
	        if (this.html != undefined) {
	            this.html.remove();
	        }
	        client.itemDestroy(this);
	    }
	    use() {
	        client.itemUse(this);
	    }
	    openContextMenu(position) {
	        const contextMenu = new contextMenu_1.ContextMenu(position, [
	            new contextMenu_1.ContextMenuOption(this.useText, () => {
	                if (this.canUse) {
	                    this.use();
	                }
	            }),
	            new contextMenu_1.ContextMenuOption("Destroy", () => {
	                if (this.canDestroy) {
	                    this.destroy();
	                }
	            })
	        ]);
	        contextMenu_1.ContextMenu.open(contextMenu);
	        return contextMenu;
	    }
	    getDefaultSlotsClone() {
	        return util.cloneObject(this.defaultSlots);
	    }
	    createHTML() {
	        if (this.html == undefined) {
	            this.html = $(`<img class="item" />`);
	            this.html.data("item", this);
	        }
	        return this.html;
	    }
	    updateHTML() {
	        let pixelDefaultSize = this.getPixelDefaultSize();
	        this.html.css({
	            "width": pixelDefaultSize.x + "px",
	            "height": pixelDefaultSize.y + "px",
	            "padding": this.padding + "px",
	        });
	        this.html.css("transform", "rotate(" + -this.rotation + "deg) scaleX(" + (this.isFlipped ? "-1" : "1") + ")");
	        let top = 0;
	        let left = 0;
	        if (this.rotation == 0) {
	            top = 0;
	            left = 0;
	            if (this.isFlipped) {
	                left += pixelDefaultSize.x;
	            }
	        }
	        else if (this.rotation == 90) {
	            top = pixelDefaultSize.x;
	            left = 0;
	            if (this.isFlipped) {
	                top -= pixelDefaultSize.x;
	            }
	        }
	        else if (this.rotation == 180) {
	            top = pixelDefaultSize.y;
	            left = pixelDefaultSize.x;
	            if (this.isFlipped) {
	                left -= pixelDefaultSize.x;
	            }
	        }
	        else if (this.rotation == 270) {
	            top = 0;
	            left = pixelDefaultSize.y;
	            if (this.isFlipped) {
	                top += pixelDefaultSize.x;
	            }
	        }
	        this.html.css({
	            "margin-top": top + "px",
	            "margin-left": left + "px"
	        });
	    }
	    getDefaultSize() {
	        return new vector2Grid_1.Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
	    }
	    getSize() {
	        return new vector2Grid_1.Vector2Grid(this.slots[0].length, this.slots.length);
	    }
	    getPixelDefaultSize() {
	        let defaultSize = this.getDefaultSize();
	        let slotSize = inventoryWindow_1.InventorySlot.getPixelSize() + 2;
	        return new vector2_1.Vector2(slotSize * defaultSize.cols - 1, slotSize * defaultSize.rows - 1);
	    }
	    getPixelSize() {
	        let size = this.getSize();
	        let slotSize = inventoryWindow_1.InventorySlot.getPixelSize();
	        return new vector2_1.Vector2(slotSize * size.cols * 1, slotSize * size.rows * 1);
	    }
	    rotateClockwise() {
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.rotation += 90;
	            if (this.rotation >= 360) {
	                this.rotation = 0;
	            }
	            let cursorOffset = this.itemDrag.getCursorOffset();
	            this.itemDrag.offset.y -= this.getPixelSize().x - cursorOffset.y - cursorOffset.x;
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
	            this.itemDrag.offset.x -= this.getPixelSize().y - cursorOffset.x - cursorOffset.y;
	            this.updateSlots();
	        }
	    }
	    flip() {
	        if (this.itemDrag && this.itemDrag.hasMoved) {
	            this.isFlipped = !this.isFlipped;
	            if (this.rotation == 0 || this.rotation == 180) {
	                this.itemDrag.offset.x -= (this.getPixelDefaultSize().x * 0.5 - this.itemDrag.getCursorOffset().x) * 2;
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
	        this.slots = this.getDefaultSlotsClone();
	        if (this.isFlipped) {
	            for (let rows = 0; rows < this.getDefaultSize().rows; rows++) {
	                this.slots[rows].reverse();
	            }
	        }
	        this.slots = util.rotateMatrix(this.slots, this.rotation);
	        this.updateHTML();
	    }
	}
	exports.Item = Item;


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	let currentContextMenu;
	class ContextMenu {
	    static open(contextMenu) {
	        ContextMenu.close();
	        currentContextMenu = contextMenu;
	        $(document.body).append(contextMenu.html);
	    }
	    static close() {
	        if (currentContextMenu != undefined) {
	            currentContextMenu.destroy();
	            currentContextMenu = undefined;
	        }
	    }
	    set options(value) {
	        this._options = value;
	        this.options.forEach((option, optionIndex) => {
	            this.html.append(option.html);
	        });
	    }
	    get options() {
	        return this._options;
	    }
	    set position(value) {
	        this._position = value;
	        this.html.offset({
	            left: this.position.x,
	            top: this.position.y
	        });
	    }
	    get position() {
	        return this._position;
	    }
	    constructor(position, options) {
	        this.createHTML();
	        this.position = position;
	        this.options = options;
	    }
	    destroy() {
	        this.html.remove();
	    }
	    createHTML() {
	        this.html = $(`<div class="context-menu"></div>`);
	        this.html.data("contextMenu", this);
	    }
	    addOption(option) {
	        option.contextMenu = this;
	        this.html.append(option.html);
	    }
	}
	exports.ContextMenu = ContextMenu;
	class ContextMenuOption {
	    constructor(nameHTML, onClick) {
	        this.createHTML();
	        this.nameHTML.html(nameHTML);
	        this.onClick = onClick;
	    }
	    destroy() {
	        this.html.remove();
	    }
	    createHTML() {
	        this.html = $(`
				<div class="option">
					<div class="name"></div>
				</div>
			`);
	        this.html.data("contextMenuOption", this);
	        this.nameHTML = this.html.find(".name");
	        this.html.on("mouseup", (event) => {
	            this.onClick();
	            ContextMenu.close();
	        });
	    }
	}
	exports.ContextMenuOption = ContextMenuOption;
	$(document.body).on("mousedown", (event) => {
	    const contextMenuOption = $(event.target).data("contextMenuOption");
	    if (contextMenuOption == undefined) {
	        ContextMenu.close();
	    }
	});


/***/ },
/* 13 */
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const adminWindow_1 = __webpack_require__(15);
	const inventoryWindow_1 = __webpack_require__(2);
	const vector2Grid_1 = __webpack_require__(5);
	const localInventoryWindow = __webpack_require__(13);
	const windowManager = __webpack_require__(9);
	const client = __webpack_require__(10);
	if (typeof jcmp == "undefined") {
	    let inventoryWindow = new inventoryWindow_1.InventoryWindow("Inventory", new vector2Grid_1.Vector2Grid(18, 12));
	    windowManager.add("local", inventoryWindow);
	    localInventoryWindow.set(inventoryWindow);
	}
	let adminWindow = new adminWindow_1.AdminWindow("Items");
	windowManager.add("adminWindow", adminWindow);
	let chatIsOpen = false;
	if (typeof jcmp != "undefined") {
	    jcmp.AddEvent("chat_input_state", function (state) {
	        chatIsOpen = state;
	    });
	    jcmp.AddEvent("jc3mp-inventory/ui/windowVisibilityChanged", (uniqueName, isVisible) => {
	        if (isVisible) {
	            jcmp.ShowCursor();
	        }
	        else {
	            jcmp.HideCursor();
	        }
	        if (!windowManager.isAnyWindowVisible()) {
	            client.itemOperations();
	        }
	    });
	}
	$(document).on("keydown", (event) => {
	    if (!chatIsOpen) {
	        switch (event.which) {
	            case 73:
	                if (localInventoryWindow.exists()) {
	                    localInventoryWindow.get().toggle();
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
	$.fn.disableSelection = function () {
	    return this
	        .attr("unselectable", "on")
	        .css("user-select", "none")
	        .on("selectstart", false);
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const window_1 = __webpack_require__(3);
	const vector2_1 = __webpack_require__(4);
	const client = __webpack_require__(10);
	const itemManager = __webpack_require__(7);
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
	class ItemCloner {
	    constructor(itemFactory) {
	        this.itemFactory = itemFactory;
	        this.item = itemFactory.assemble();
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
	            let item = this.itemFactory.assemble();
	            item.html.css({
	                "left": position.left + "px",
	                "top": position.top + "px"
	            });
	            itemManager.add(item);
	            itemManager.startDragging(item, new vector2_1.Vector2(event.pageX, event.pageY));
	            item.itemDrag.hasMoved = true;
	            item.itemDrag.onDropped = () => {
	                if (item.inventoryWindow != undefined && item.inventoryWindow.uniqueName != undefined) {
	                    client.itemCreate(item);
	                    item.inventoryWindow.removeItem(item);
	                }
	                itemManager.remove(item);
	                item.destroy();
	            };
	            event.preventDefault();
	        });
	    }
	}
	exports.ItemCloner = ItemCloner;


/***/ }
/******/ ]);